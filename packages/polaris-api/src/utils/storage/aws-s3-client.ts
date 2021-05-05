import S3 from "aws-sdk/clients/s3";
import HttpStatus from "http-status-codes";
import { AppError } from "polaris-api/utils/error";
import { Stream } from "stream";
import { Logger } from "../logging";
import { MimeTypesMapping } from "./constants";
import {
  AwsS3ClientConfig,
  CreateWritePresignedUrlDTO,
  S3ObjectParams,
  S3UploadParams,
} from "./types";

export class AwsS3Client {
  /**
   * Client objects are thread safe, disposable, and can be reused. (Client objects are inexpensive, so you are not
   * incurring a large overhead by constructing multiple instances, but it’s not a bad idea to create and reuse a client.)
   */
  private _s3Client: S3 | undefined = undefined;

  constructor(private readonly config: AwsS3ClientConfig, private readonly logger: Logger) {}

  private get defaultACL(): S3.Types.ObjectCannedACL {
    return this.config.defaultACL ?? "private";
  }

  private get s3Client(): S3 {
    if (!this._s3Client) {
      this._s3Client = this.createS3Client();
    }
    return this._s3Client;
  }

  /**
   * Retrieve an object stored as JSON from S3.
   *
   * @param params The params used to identify the object
   */
  public async getJSON<T>(params: S3ObjectParams): Promise<T | undefined> {
    const objectKey = this.createFilePath(params);

    this.logger.info("Retrieving JSON object from AWS S3", { data: { objectKey } });

    const s3Client = this.createS3Client();

    let content: string;

    try {
      const s3Response = await s3Client
        .getObject({ Bucket: this.config.bucket, Key: objectKey })
        .promise();

      content = s3Response?.Body?.toString() ?? "";
    } catch (error) {
      throw new AppError("Could not load JSON from S3", {
        statusCode: error.statusCode,
        name: error.code,
        error,
      });
    }

    try {
      return (JSON.parse(content) as T) ?? undefined;
    } catch (error) {
      this.logger.info("Could not parse S3 content as JSON", { err: error });
      return;
    }
  }

  /**
   * Store a JSON object in S3.
   * Uses default access control if it's not provided in params.
   *
   * @param content The JSON object to be stored
   * @param params Used to identify the permissions, object key and path
   */
  public async uploadJSON<T extends Record<string, unknown>>(
    content: T,
    params: S3UploadParams
  ): Promise<S3.Types.ManagedUpload.SendData> {
    const body = JSON.stringify(content);
    this.logger.info("Uploading JSON to AWS S3", { data: { bodySize: body.length } });
    return await this.upload(body, params, "application/json; charset=utf-8");
  }

  /**
   * Retrieve a file stored in S3 as a ReadableStream object.
   * This allows for easily piping the response to whichever destination is needed.
   *
   * @example
   *
   *    router.get('/download', (req, res, next) => {
   *        const awsS3Client = getGlobalAwsS3Client();
   *        const params = {
   *          objectFolder: 'logos',
   *          uniqueName: 'abcd.jpg'
   *         }
   *         const stream = awsS3Client.getFile(params);
   *         res.setHeader('Content-Disposition', 'attachment; filename="abcd.jpg"');
   *         res.setHeader('Content-Type', 'image/jpeg');
   *
   *         stream.on('error', next);
   *         stream.pipe(res);
   *         res.on('close', stream.destroy);
   *
   *    NB: please note that this is just an example, and you shouldn't stream files downloaded from S3 to the frontend.
   *    For that use case, please use a signed URL and serve it directly, so that our servers don't get overloaded.
   *
   * @param params The params used to identify the object
   */
  public getFile(params: S3ObjectParams): Stream | null {
    const objectKey = this.createFilePath(params);

    this.logger.info("Retrieving file object from AWS S3", { data: { objectKey } });

    try {
      return this.s3Client
        .getObject({ Bucket: this.config.bucket, Key: objectKey })
        .createReadStream();
    } catch (error) {
      throw new AppError("Could not retrieve data from S3", {
        statusCode: error.statusCode,
        name: error.code,
        error,
      });
    }
  }

  /**
   * Upload a local file or stream to S3.
   * File will be base64 encoded before upload.
   *
   * @param content File as buffer or content string.
   * @param params Used to identify the permissions, object key and path
   */
  public async uploadFile<T extends NodeJS.ReadableStream>(
    content: Buffer | string,
    params: S3UploadParams
  ): Promise<S3.Types.ManagedUpload.SendData | undefined> {
    const body = content instanceof Buffer ? content : Buffer.from(content, "base64");
    const mimeType = this.getMimeType(params.uniqueName);
    if (!mimeType) {
      this.logger.info("No mime type detected, file does not have extension. Upload canceled.", {
        data: { fileName: params.uniqueName },
      });
      return;
    }

    this.logger.info("Uploading file to AWS S3", { data: { bodySize: body.length, mimeType } });
    return await this.upload(body, params, mimeType);
  }

  private async upload<T>(
    data: T,
    params: S3UploadParams,
    contentType: string
  ): Promise<S3.Types.ManagedUpload.SendData> {
    const filePath = this.createFilePath({
      ...params,
      uniqueName: this.createUniqueName(params.uniqueName),
    });
    try {
      return await this.s3Client
        .upload({
          Bucket: this.config.bucket,
          ACL: params.acl ?? this.defaultACL,
          Key: filePath,
          Body: data,
          ContentType: contentType,
        })
        .promise();
    } catch (error) {
      throw new AppError("Could not upload file to S3", {
        statusCode: error.statusCode,
        name: error.code,
        error,
      });
    }
  }

  /**
   * Return an AWS S3 signed URL for uploading an object.
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
   * This will have an expiry time of 1 hour.
   *
   * @param params {S3UploadParams} Used to compute the file key and Server side options.
   */

  public createWritePresignedUrl(params: S3UploadParams): CreateWritePresignedUrlDTO {
    const key = this.createFilePath({
      ...params,
      uniqueName: this.createUniqueName(params.uniqueName),
    });
    const serverSideEncryption = params?.ServerSideEncryption ?? undefined;

    if (!key) {
      throw new AppError("Could not compute key for S3 object", {
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const signedUrl = this.s3Client.getSignedUrl("putObject", {
      Key: key,
      Bucket: this.config.bucket,
      Expires: 3600, // 1 hour,
      ServerSideEncryption: serverSideEncryption,
      ContentType: "application/octet-stream",
    });
    return { key, signedUrl };
  }

  /**
   * Return an AWS S3 signed URL for getting an object.
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
   * This will have an expiry time of 1 hour, and needs either the file Key, or the params that were used on upload.
   *
   * @param fileKey The unique key for the file being shared. This is for backwards compatibility purposes.
   * @param params Used to compute the file key if it's not being passed as string. It's recommended we use this from now on.
   */
  public createReadPresignedUrl(fileKey?: string, params?: S3UploadParams): string {
    const key = fileKey ?? (params && this.createFilePath(params));
    if (!key) {
      this.logger.info("Could not compute key for S3 object.", {
        data: { err: "No file key or params provided." },
      });
      return "";
    }
    return this.s3Client.getSignedUrl("getObject", {
      Key: key,
      Bucket: this.config.bucket,
      Expires: 3600, // 1 hour
    });
  }

  private getMimeType(filename: string): string | undefined {
    this.logger.info("Getting MIME type for file.", { data: { filename } });

    const parts = filename.split(".");
    if (parts && parts.length > 1) {
      const extension = parts.pop()?.toLowerCase();
      return extension ? MimeTypesMapping[extension] : undefined;
    }
  }

  private createUniqueName(filename: string): string {
    this.logger.info("Creating unique file name.", { data: { filename } });

    const timestamp = Date.now();
    return filename.replace(/(\.[\w-]+)?$/i, `-${timestamp}$1`);
  }

  private createS3Client(): S3 {
    return new S3({
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
      region: this.config.bucketRegion,
      signatureVersion: "v4",
    });
  }

  private createFilePath(params: S3ObjectParams): string {
    return [this.config.appFolder, params.tenantFolder, params.objectFolder, params.uniqueName]
      .filter((x) => !!x)
      .join("/");
  }
}
