import { Logger } from "polaris-api/utils/";
import { AppError, ErrorTypes } from "polaris-api/utils/error";
import { AwsS3Client } from "./aws-s3-client";
import { AwsS3ClientConfig } from "./types";

let awsS3Client: AwsS3Client | null;

export const getGlobalAwsS3Client = (): AwsS3Client => {
  if (!awsS3Client || awsS3Client === null) {
    throw new AppError("Trying to access static aws s3 client before setup", {
      name: ErrorTypes.WrongSetup,
    });
  }

  return awsS3Client;
};

export const setupGlobalAwsS3Client = (config: AwsS3ClientConfig, logger: Logger): AwsS3Client => {
  if (awsS3Client) {
    throw new AppError("Static AWS S3 Client has already been setup", {
      name: ErrorTypes.WrongSetup,
    });
  }

  awsS3Client = new AwsS3Client(config, logger);

  return awsS3Client;
};
