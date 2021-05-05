import { ImportUnit, UnitService } from "@polaris/domain";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import multer from "multer";
import { config } from "polaris-api/config";
import { FileService } from "polaris-api/utils/fileServiceMiddleware/fileService";
import { importUnitValidator, validateUnits } from "polaris-api/utils/validators";

const storage = multer.diskStorage({
  destination: config.get("tempDirectory"),
  filename: function (request, file, cb) {
    // eslint-disable-next-line unicorn/no-null
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

export const importUnit = [
  upload.any(),
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    console.log(request.body);
    const fileService = new FileService();
    await fileService.fileHandlre(request, response, next);
  },
  importUnitValidator,
  validateUnits,
  async (request: Request, response: Response): Promise<void> => {
    const unitService: UnitService = request.injector.get(UnitService);
    const requestData = matchedData(request, { includeOptionals: true }) as ImportUnit;
    const data = await unitService.import(requestData);
    response.status(201);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
