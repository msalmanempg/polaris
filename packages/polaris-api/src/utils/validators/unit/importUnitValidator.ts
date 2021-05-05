import { NextFunction, Request, Response } from "express";
import { body, check } from "express-validator";
import {
  lowerCase,
  numberToString,
  removeConsecutiveSpaces,
  stringToNumber,
  validate,
} from "polaris-api/utils";

interface CustomRequest extends Request {
  parsedData?: any;
  validData?: any;
}

const unitKeys = [
  "id",
  "unitNumber",
  "type",
  "netArea",
  "grossArea",
  "basePrice",
  "publishedPrice",
  "bed",
  "location",
  "completionDate",
];

export const importUnitValidator = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  if (request.parsedData && request.parsedData.hasOwnProperty("units")) {
    const units = request.parsedData.units;
    const unitObject = await parseObjects(units.data);
    if (unitObject.length > 0) {
      request.body["units"] = unitObject;
      next();
    } else {
      response.status(400);
      response.send({ error: "File Contains no or Invalid Data" });
      response.end();
    }
  } else {
    next();
  }
};

const parseObjects = async (data: any): Promise<any> => {
  // eslint-disable-next-line sonarjs/no-unused-collection
  const unitObjects: any = [];
  // Iteration over Sheets
  for await (const sheet of data) {
    const sheetData = sheet.data;
    for await (const [index, unitRow] of sheetData.entries()) {
      // Skipping Headers
      if (index > 0) {
        // first Element of Row is always Empty
        unitRow.data.splice(0, 1);
        const unitObj = <any>{};
        for await (const [idx, key] of unitKeys.entries()) {
          unitObj[key] = unitRow.data[idx] ? unitRow.data[idx] : undefined;
        }
        unitObj["rowNumber"] = unitRow.rowNumber;
        unitObjects.push(unitObj);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return unitObjects;
};

export const validateUnits = validate([
  body("projectId").exists().notEmpty().isNumeric().customSanitizer(stringToNumber),
  check("units.*.unitNumber").exists().notEmpty().customSanitizer(numberToString),
  check("units.*.location")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .customSanitizer(removeConsecutiveSpaces),
  check("units.*.type")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .customSanitizer(removeConsecutiveSpaces)
    .customSanitizer(lowerCase),
  ...[
    check("units.*.netArea"),
    check("units.*.grossArea"),
    check("units.*.basePrice"),
    check("units.*.publishedPrice"),
    check("units.*.bed"),
  ].map((x) => x.exists().notEmpty().isNumeric()),
  check("units.*.completionDate").optional().isISO8601(),
]);
