import { Types } from "aws-sdk/clients/s3";

export interface AwsS3ClientConfig {
  /**
   * The S3 bucket used to store/find all objects.
   */
  bucket: string;
  /**
   * The S3 region where the bucket is stored.
   */
  bucketRegion: string;
  /**
   * The default access control to set for each object.
   */
  defaultACL?: Types.ObjectCannedACL;
  /**
   * The access key id used to connect to S3.
   */
  accessKeyId: string;
  /**
   * The secret access key used to connect to S3.
   */
  secretAccessKey: string;
  /**
   * The folder used to store all the subfolders and files inside the bucket.
   * This is useful when running separate app instances for the same environment
   *
   * @example
   *
   *    The propforce-stage bucket gets used by multiple environments. We can store the files
   *    of a specific environment in it's own folder:
   *
   *    /dev-3007/some-folder/some-file.jpg
   *    /dev-3008/some-folder/some-file.jpg
   *    /dev-lucian/some-folder/some-file.jpg
   *
   *    This way we can easily identify which files come from which environment, and it's easier
   *    for testing.
   */
  appFolder?: string;
}

export interface S3ObjectParams {
  /**
   * Since we are running multiple tenants in the same environment, it would be useful to isolate
   * files between tenants by storing them in separate folders.
   *
   * This folder goes inside the folder configured in @see {AwsS3ClientConfig#appFolder}
   *
   * @example
   *
   *    In the current context, this will be the equivalent of an agency.
   *    This is meant to prevent unauthorised access from one agency to another.
   *
   *    /app-folder/zameen/some-folder/some-file.jpg
   *    /app-folder/mubawab/some-folder/some-file.jpg
   */
  tenantFolder: string | null;
  /**
   * The folder from inside the tenant folder where the object will get stored.
   * This could be a representative name for the type of objects that are kept in that folder.
   *
   * @example
   *
   *    /app-folder/tenant/contracts/some-file.jpg
   *    /app-folder/tenant/booking-forms/some-file.jpg
   */
  objectFolder: string;
  /**
   * The name used to store the object. This will be unique inside the folder.
   * This is typically the file name, on which we add a timestamp to ensure uniqueness.
   *
   * @example
   *
   *    /app-folder/tenant/objects/some-file_1598627475.jpg
   *    /app-folder/tenant/objects/some-file_676425600.jpg
   */
  uniqueName: string;
}

export interface S3UploadParams extends S3ObjectParams {
  /**
   * The access control to set for the object that gets uploaded.
   */
  acl?: Types.ObjectCannedACL;
  /**
   * To enable server side encrption while uploading object
   */
  ServerSideEncryption?: Types.ServerSideEncryption;
}

export interface CreateWritePresignedUrlDTO {
  key: string;
  signedUrl: string;
}
