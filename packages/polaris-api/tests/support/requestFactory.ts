import { Application } from "express";
import { createExpressApp } from "polaris-api/app";
import { AwsS3Client } from "polaris-api/utils/storage";
import supertest, { Test } from "supertest";
import * as awsS3ClientFactory from "../../src/utils/storage/aws-s3-client-factory";

/**
 * This is a thin wrapper over `SuperTest` in order
 * to make Authorize access to express application.
 */
class RequestFactory {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * This method returns supertest.get method
   * @param path {string} api path to invoke
   * @returns Supertest.Test
   */
  public get(path: string): Test {
    return supertest(this.app).get(path);
  }

  /**
   * This method returns supertest.post method
   * @param path {string} api path to invoke
   * @returns Supertest.Test
   */
  public post(path: string): Test {
    return supertest(this.app).post(path);
  }

  /**
   * This method returns supertest.put method
   * @param path {string} api path to invoke
   * @returns Supertest.Test
   */
  public put(path: string): Test {
    return supertest(this.app).put(path);
  }

  /**
   * This method returns supertest.delete method
   * @param path {string} api path to invoke
   * @returns Supertest.Test
   */
  public delete(path: string): Test {
    return supertest(this.app).delete(path);
  }
}

/**
 * This function is useful for mocking the middlewares and configuration functions,
 * that needed to be mocked for testing express application,
 * like sentry, S3 client, injectors e.t.c
 *
 * @returns supertest test agent of express apllication to test
 */
export const testExpressApp = (): RequestFactory => {
  const app = createExpressApp();

  jest
    .spyOn(awsS3ClientFactory, "setupGlobalAwsS3Client")
    .mockImplementation((): AwsS3Client => awsS3ClientFactory.getGlobalAwsS3Client());

  return new RequestFactory(app);
};
