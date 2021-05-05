import { NextFunction, Request, RequestHandler, Response } from "express";

import { AppError } from "../error";
import { Logger } from "../logging";

interface RequestWithLogger extends Request {
  log?: Logger;
}

export function asyncHandler(handler: RequestHandler): RequestHandler;
export function asyncHandler(handler: RequestHandler[]): RequestHandler[];
export function asyncHandler(
  handler: RequestHandler | RequestHandler[]
): RequestHandler | RequestHandler[] {
  if (Array.isArray(handler)) {
    return handler.map((singleHandler) => asyncHandler(singleHandler));
  }

  return async (
    request: RequestWithLogger,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await Promise.resolve(handler(request, response, next));
    } catch (error) {
      if (error instanceof AppError && error.statusCode) {
        request.log?.info({ err: error });
        response.status(error.statusCode).json({ errors: [error.toJSON()] });
      } else {
        next(error);
      }
    }
  };
}
