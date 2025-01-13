import { describe, it, expect, vi, beforeEach } from "vitest";
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { S3Service } from "../../services/S3Service.js";

// Mock S3Client
vi.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: vi.fn().mockImplementation(() => ({
      send: vi.fn(),
    })),
    ListObjectsV2Command: vi.fn(),
    PutObjectCommand: vi.fn(),
    GetObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
  };
});

describe("S3Service", () => {
  const mockSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    S3Client.prototype.send = mockSend;
  });

  it("should list objects", async () => {
    const mockResponse = { Contents: [{ Key: "file1.txt" }, { Key: "file2.txt" }] };
    mockSend.mockResolvedValueOnce(mockResponse);

    const params = { Bucket: "test-bucket" };
    const result = await S3Service.listObjects(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    expect(result).toEqual(mockResponse);
  });

  it("should handle list objects error", async () => {
    const mockError = new Error("List error");
    mockSend.mockRejectedValueOnce(mockError);

    const params = { Bucket: "test-bucket" };
    const result = await S3Service.listObjects(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    expect(result).toBeInstanceOf(S3ServiceException);
  });

  it("should upload an object", async () => {
    const mockResponse = { ETag: "mock-etag" };
    mockSend.mockResolvedValueOnce(mockResponse);

    const params = { Bucket: "test-bucket", Key: "file.txt", Body: "content" };
    const result = await S3Service.putObject(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toEqual(mockResponse);
  });

  it("should handle upload object error", async () => {
    const mockError = new Error("Upload error");
    mockSend.mockRejectedValueOnce(mockError);

    const params = { Bucket: "test-bucket", Key: "file.txt", Body: "content" };
    const result = await S3Service.putObject(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toBeInstanceOf(S3ServiceException);
  });

  it("should get an object", async () => {
    const mockBody = new ReadableStream({
      start(controller) {
        controller.enqueue(Buffer.from(JSON.stringify({ test: "data" })));
        controller.close();
      },
    });
    const mockResponse = { Body: mockBody };
    mockSend.mockResolvedValueOnce(mockResponse);

    const params = { Bucket: "test-bucket", Key: "file.json" };
    const result = await S3Service.getObject(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(GetObjectCommand));
    expect(result).toEqual({ test: "data" });
  });

  it("should handle get object error", async () => {
    const mockError = new Error("Get error");
    mockSend.mockRejectedValueOnce(mockError);

    const params = { Bucket: "test-bucket", Key: "file.json" };
    const result = await S3Service.getObject(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(GetObjectCommand));
    expect(result).toBeInstanceOf(S3ServiceException);
  });

  it("should delete an object", async () => {
    const mockResponse = { DeleteMarker: true };
    mockSend.mockResolvedValueOnce(mockResponse);

    const params = { Bucket: "test-bucket", Key: "file.txt" };
    const result = await S3Service.deleteObject(params);

    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    expect(result).toEqual(mockResponse);
  });

  it("should handle delete object error", async () => {
    const mockError = new Error("Delete error");
    mockSend.mockRejectedValueOnce(mockError);

    const params = { Bucket: "test-bucket", Key: "file.txt" };
    const result = await S3Service.deleteObject(params);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(S3ServiceException);
  });
});
