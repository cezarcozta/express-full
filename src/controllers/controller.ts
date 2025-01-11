import { IPrefix, IPutDataBody } from "#interfaces/types.js";
import { getFolderContent, putObjectData } from "#services/s3Service.js";
import { S3ServiceException } from "@aws-sdk/client-s3";
import { Request, Response } from "express";

export const getData = async (request: Request, response: Response): Promise<void> => {
  try {
    const body = request.body as IPrefix;
    const prefix = body.prefix;
    const data = await getFolderContent(prefix);
    if (Array.isArray(data)) {
      const size = data.length;
      const isEmpty = size === 0;
      if (isEmpty) {
        response.status(404).json({ data: [], size: 0 });
      }
      response.status(200).json({ data, size });
    }
    const error = data as S3ServiceException;
    const statusCode = error.$metadata.httpStatusCode ?? 500;
    const message = error.message;
    response.status(statusCode).json({ error: message });
  } catch (err: unknown) {
    const error = err as S3ServiceException;
    response.status(500).json({ error: error.message });
  }
};

export const putData = async (request: Request, response: Response): Promise<void> => {
  try {
    const body = request.body as IPutDataBody;
    const fileName = body.fileName;
    const content = body.content;
    const stringfiedContent = JSON.stringify(content);
    const data = await putObjectData(fileName, stringfiedContent);
    if (data.$metadata.httpStatusCode !== 204) response.status(500).json({ error: "Error uploading data" });
    response.status(201).json({ message: "Data uploaded successfully" });
  } catch (err: unknown) {
    const error = err as Error;
    response.status(500).json({ error: error.message });
  }
};
