import { IAwsLead, IAwsOpt, IKeyAndContent, ILead, IPrefix, IProcessedResult, IPutDataBody } from "#interfaces/types.js";
import { S3ServiceException } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { S3Service } from "#services/S3Service.js";
import { delay } from "#utils/wait.js";

const Bucket = process.env.BUCKET_NAME ?? "";
const MaxKeys = Number(process.env.MAX_KEYS ?? "1000");

export const getData = async (request: Request, response: Response): Promise<void> => {
  try {
    const resultArray: IKeyAndContent[] = [];
    const body = request.body as IPrefix;
    const Prefix = body.prefix;
    const isLead = Prefix.includes("lead");
    const data = await S3Service.listObjects({ Bucket, MaxKeys, Prefix });
    if (data instanceof S3ServiceException) {
      const statusCode = data.$metadata.httpStatusCode ?? 500;
      response.status(statusCode).json({ error: data.message });
    } else {
      const objects = data.Contents ?? [];
      for (const content of objects) {
        const Key = content.Key;
        const object = await S3Service.getObject({ Bucket, Key });
        if (object instanceof S3ServiceException) {
          const statusCode = object.$metadata.httpStatusCode ?? 500;
          response.status(statusCode).json({ error: object.message });
        } else {
          if (isLead) {
            const data = object as IAwsLead;
            const leads = data.leads;
            leads.map((content: ILead) => {
              resultArray.push({ Key, content });
            });
          } else {
            const data = object as IAwsOpt;
            const opportunities = data.opportunities;
            opportunities.map((content: ILead) => {
              resultArray.push({ Key, content });
            });
          }
        }
      }
      response.status(200).json({ objects: resultArray, size: resultArray.length });
    }
  } catch (err: unknown) {
    const error = err as S3ServiceException;
    response.status(500).json({ error: error.message });
  }
};

export const putData = async (request: Request, response: Response): Promise<void> => {
  try {
    const body = request.body as IPutDataBody;
    const Key = body.fileName;
    const content = body.content;
    const Body = JSON.stringify(content);
    const data = await S3Service.putObject({ Bucket, Key, Body });
    if (data instanceof S3ServiceException) {
      const statusCode = data.$metadata.httpStatusCode ?? 500;
      response.status(statusCode).json({ error: data.message });
      return;
    }
    await delay(2500);
    const resultKey = Key.replace(".json", "_result.json");
    const resultObject = await S3Service.getObject({ Bucket, Key: resultKey });
    if (resultObject instanceof S3ServiceException) {
      const statusCode = resultObject.$metadata.httpStatusCode ?? 500;
      response.status(statusCode).json({ error: resultObject.message });
      return;
    } else {
      const result = resultObject as IProcessedResult;
      const isSuccess = result.success === "ALL";
      if (!isSuccess) {
        const statusCode = 400;
        const error = result.inboundApiResults[0].errors;
        const warnings = result.inboundApiResults[0].warnings;
        const isApiError = result.isApiError;
        const apiErrors = result.apiErrors;
        response.status(statusCode).json({ error, warnings, apiErrors, isApiError });
        return;
      }
      response.status(201).json({ content, result });
    }
  } catch (err: unknown) {
    const error = err as S3ServiceException;
    response.status(500).json({ error: error.message });
  }
};

export const deleteData = async (request: Request, response: Response): Promise<void> => {
  try {
    const body = request.body as { key: string };
    const Key = body.key;
    const data = await S3Service.deleteObject({ Bucket, Key });
    if (data instanceof S3ServiceException) {
      const statusCode = data.$metadata.httpStatusCode ?? 500;
      response.status(statusCode).json({ error: data.message });
    } else {
      response.status(204).json({});
    }
  } catch (err: unknown) {
    const error = err as S3ServiceException;
    response.status(500).json({ error: error.message });
  }
};
