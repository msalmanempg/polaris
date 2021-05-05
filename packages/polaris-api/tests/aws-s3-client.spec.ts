import { logger } from "polaris-api/utils/logging";
import {
  AwsS3Client,
  getGlobalAwsS3Client,
  setupGlobalAwsS3Client,
} from "polaris-api/utils/storage";
import { AwsS3ClientConfig, S3UploadParams } from "polaris-api/utils/storage/types";

jest.mock("aws-sdk/clients/s3", () =>
  jest.fn().mockImplementation(() => ({
    upload: () => ({
      promise: jest.fn(() => ({
        Location: "Location",
        ETag: "ETag",
        Bucket: "Bucket",
        Key: "Key",
      })),
    }),
    getSignedUrl: () => "signedUrl",
  }))
);

describe("AWS S3 client", () => {
  let awsS3Client: AwsS3Client;
  const s3UploadParams: S3UploadParams = {
    tenantFolder: "tenantFoler",
    objectFolder: "objectFolder",
    uniqueName: "uniqueName.png",
  };

  const awsS3ClientConfig: AwsS3ClientConfig = {
    bucket: "polaris-test-bucket",
    bucketRegion: "polaris-test-region",
    defaultACL: "private",
    accessKeyId: "polaris-test-access-key-id",
    secretAccessKey: "polaris-test-secret-access-key",
    appFolder: "polaris-test-app-folder",
  };

  beforeAll(() => {
    awsS3Client = setupGlobalAwsS3Client(awsS3ClientConfig, logger);
  });

  it("should set up global aws s3 client", () => {
    expect(awsS3Client).toBeTruthy();
    expect(awsS3Client).toBeInstanceOf(AwsS3Client);
  });

  it("should get global aws s3 client", () => {
    const anotherAWSS3Client = getGlobalAwsS3Client();

    expect(anotherAWSS3Client).toBeTruthy();
    expect(anotherAWSS3Client).toBeInstanceOf(AwsS3Client);
    expect(anotherAWSS3Client).toEqual(awsS3Client);
  });

  it("should generate presigned write url", () => {
    const { key, signedUrl } = awsS3Client.createWritePresignedUrl(s3UploadParams);

    expect(key).toBeTruthy();
    expect(signedUrl).toBeTruthy();
    expect(typeof key).toEqual("string");
    expect(typeof signedUrl).toEqual("string");
  });

  it("should generate presigned read url", () => {
    const signedUrl = awsS3Client.createReadPresignedUrl("file-key", s3UploadParams);

    expect(signedUrl).toBeTruthy();
    expect(typeof signedUrl).toEqual("string");
  });

  it("should upload file", async () => {
    const response = await awsS3Client.uploadFile("file-content", s3UploadParams);

    expect(response).toBeTruthy();
  });
});
