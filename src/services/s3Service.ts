import { IAwsLead, ILead, IResultGetFolderContent } from "#interfaces/types.js";
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, S3Client, S3ServiceException } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID_KEY ?? "",
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY ?? "",
  },
  region: process.env.REGION ?? "us-east-1",
});

const Bucket = process.env.BUCKET_NAME ?? "";
const ACL = process.env.ACL ?? "private";
const max_keys = process.env.MAX_KEYS ?? 1000;
const MaxKeys = Number(max_keys);

export const getFolderContent = async (Prefix: string): Promise<IResultGetFolderContent[] | S3ServiceException> => {
  try {
    const resultArray = [] as { Key: string | undefined; content: ILead }[];
    const params = {
      Bucket,
      Prefix,
      ACL,
      MaxKeys,
    };
    const command = new ListObjectsV2Command(params);
    const listObjectsResponse = await s3Client.send(command);
    const isEmpty = listObjectsResponse.KeyCount === 0;
    const contents = listObjectsResponse.Contents;
    if (isEmpty || contents === undefined) {
      return [];
    }
    for (const content of contents) {
      const Key = content.Key;
      const params = {
        Bucket,
        Key,
      };
      const command = new GetObjectCommand(params);
      const readResponse = await s3Client.send(command);
      const body = readResponse.Body as ReadableStream;
      const chunks = [];
      for await (const chunk of body) {
        chunks.push(chunk);
      }
      const objectContent = Buffer.concat(chunks).toString();
      const parseJSON = JSON.parse(objectContent) as IAwsLead;
      const leads = parseJSON.leads;
      leads.map((content: ILead) => {
        resultArray.push({ Key, content });
      });
    }
    return resultArray;
  } catch (err: unknown) {
    const error = err as S3ServiceException;
    return error;
  }
};

export const putObjectData = async (Key: string, Body: string): Promise<PutObjectCommandOutput> => {
  const params = {
    Bucket,
    Key,
    Body,
  };
  const command = new PutObjectCommand(params);
  const putObjectDataResponse = await s3Client.send(command);
  return putObjectDataResponse;
};
