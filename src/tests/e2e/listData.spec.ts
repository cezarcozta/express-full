import { describe, it, expect } from "vitest";
import { S3Service } from "../../services/S3Service.js";
import { S3ServiceException } from "@aws-sdk/client-s3";

describe("S3Service E2E", () => {
  it("should list objects from the bucket", async () => {
    const params = { Bucket: "test-bucket" };
    const result = await S3Service.listObjects(params);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("Contents");
  });

  it("should upload an object to the bucket", async () => {
    const params = {
      Bucket: "lead-inbound",
      Key: "test-file.txt",
      Body: "Hello World",
    };
    const result = await S3Service.putObject(params);
    console.log(result);
    expect(result).toBeDefined();
    expect(result).toHaveProperty("ETag");
  });

  it("should retrieve an object from the bucket", async () => {
    const params = { Bucket: "test-bucket", Key: "test-file.txt" };
    const result = await S3Service.getObject(params);

    expect(result).toBeDefined();
    expect(result).toEqual(expect.any(Object));
  });

  it("should delete an object from the bucket", async () => {
    const params = { Bucket: "test-bucket", Key: "test-file.txt" };
    const result = await S3Service.deleteObject(params);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("DeleteMarker");
  });

  it("should handle invalid bucket errors", async () => {
    const params = { Bucket: "invalid-bucket", Key: "nonexistent.txt" };
    const result = await S3Service.getObject(params);

    expect(result).toBeInstanceOf(S3ServiceException);
  });
});
