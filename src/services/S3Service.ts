import { IAWSData, IProcessedResult } from "#interfaces/types.js";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";

const config = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID_KEY ?? "",
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY ?? "",
  },
  region: process.env.REGION ?? "us-west-2",
};

const s3Client = new S3Client(config);

const S3Service = {
  listObjects: async (params: ListObjectsV2CommandInput): Promise<ListObjectsV2CommandOutput | S3ServiceException> => {
    try {
      const command = new ListObjectsV2Command(params);
      const response = await s3Client.send(command);
      return response;
    } catch (err: unknown) {
      const error = err as S3ServiceException;
      return error;
    }
  },
  putObject: async (params: PutObjectCommandInput): Promise<PutObjectCommandOutput | S3ServiceException> => {
    try {
      const command = new PutObjectCommand(params);
      const response = await s3Client.send(command);
      return response;
    } catch (err: unknown) {
      const error = err as S3ServiceException;
      return error;
    }
  },
  getObject: async (params: GetObjectCommandInput): Promise<object | S3ServiceException> => {
    try {
      const isResult = params.Key?.includes("_result.json");
      const command = new GetObjectCommand(params);
      const response = await s3Client.send(command);
      const body = response.Body as ReadableStream;
      const chunks = [];
      for await (const chunk of body) {
        chunks.push(chunk);
      }
      const objectContent = Buffer.concat(chunks).toString();
      return isResult ? (JSON.parse(objectContent) as IProcessedResult) : (JSON.parse(objectContent) as IAWSData);
    } catch (err: unknown) {
      const error = err as S3ServiceException;
      return error;
    }
  },
  deleteObject: async (params: DeleteObjectCommandInput): Promise<DeleteObjectCommandOutput | S3ServiceException> => {
    try {
      const command = new DeleteObjectCommand(params);
      const response = await s3Client.send(command);
      return response;
    } catch (err: unknown) {
      const error = err as S3ServiceException;
      return error;
    }
  },
};

export { S3Service };
