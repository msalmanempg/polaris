import { getDomainProviders } from "@polaris/domain";
import { prisma, PrismaClient } from "@polaris/prisma";
import { NextFunction, Request, Response } from "express";
import { Provider, ReflectiveInjector } from "injection-js";
import { AwsS3Client, getGlobalAwsS3Client } from "../storage";

const getProviders = (_request: Request): Array<Provider> => {
  const domainProviders: Provider[] = getDomainProviders();
  return [
    ...domainProviders,
    { provide: PrismaClient, useValue: prisma },
    { provide: AwsS3Client, useValue: getGlobalAwsS3Client() },
  ] as Provider[];
};

const createInjector = (request: Request): ReflectiveInjector => {
  const providers: Provider[] = getProviders(request);
  return ReflectiveInjector.resolveAndCreate(providers);
};

const diMiddleware = (request: Request, _response: Response, next: NextFunction): any => {
  request.injector = createInjector(request);
  next();
};

export { createInjector, diMiddleware };
