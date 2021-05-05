import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorFormatter, matchedData, ValidationChain, validationResult } from "express-validator";

import { ErrorTypes } from "../error";

interface ValidationError {
  name: string;
  message: string;
  param?: string | string[] | undefined;
  location: string | undefined;
  nestedErrors?: any | undefined;
}

interface CustomRequest extends Request {
  validData?: any;
  parsedData?: any;
}
export const validationErrorFormatter: ErrorFormatter = (error) => {
  const data: ValidationError = {
    name: ErrorTypes.InvalidRequestData,
    message: error.msg,
    param: error.param,
    location: error.location,
  };

  if (Array.isArray(error.nestedErrors)) {
    // TODO: limitation of TypeScript. If you have a union of two arrays you can't call any method on it. You need to disjoin the union first.
    // data.nestedErrors = error.nestedErrors.map((element:any) => <ValidationError>validationErrorFormatter(element));
    data.nestedErrors = error.nestedErrors;
    delete data.param;
  }

  return data;
};

export const handleValidations: RequestHandler = (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request).formatWith(validationErrorFormatter);
  if (errors.isEmpty()) {
    request.validData = matchedData(request);
    next();
  } else {
    response.status(400).json({ errors: errors.array() });
  }
};

/**
 * Appends a validation check middleware which automatically sends the error response
 * in case validation fails, or puts the sanitized data on `request.validData` in case
 * the validation passes.
 *
 * @example ```js
 *      const clientRetrieveValidators = validate([
 *        checkBody('agencyId').isString().notEmpty(),
 *        checkParam('id').isInt().toInt(),
 *        ...
 *      ]);
 *
 *      const clientRetrieveView = (request, response) => {
 *        console.log(request.validData);
 *      }
 *
 *      router.get('/clients/:id', clientRetrieveValidators, asyncHandler(clientRetrieveView));
 * ```
 *
 * @param validators A list of validators from express-validation
 */
export const validate = (validators: ValidationChain[]): RequestHandler[] => {
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return [...validators, handleValidations];
  /* eslint-enable @typescript-eslint/no-unsafe-return */
};
