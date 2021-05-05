import AWS from "aws-sdk";
import crypto from "crypto";
import Excel from "exceljs";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import mime from "mime-types";
import { config } from "polaris-api/config";
import { logger } from "polaris-api/utils/logging";

const excelMimes = new Set([
  "application/vnd.ms-excel",
  "application/msexcel",
  "application/x-msexcel",
  "application/x-ms-excel",
  "application/x-excel",
  "application/x-dos_ms_excel",
  "application/xls",
  "application/x-xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/svg+xml"]);

interface CustomRequest extends Request {
  parsedData?: any;
}

export class FileService {
  public fileHandlre = async (
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    if (request.files) {
      const allFiles = request.files as Express.Multer.File[];
      const allPromises = [];
      for (const file of allFiles) {
        const field = file.fieldname;
        if (excelMimes.has(file.mimetype)) {
          allPromises.push(this.parseExcelFile(field, file, request, response, next));
        } else if (allowedImageTypes.has(file.mimetype)) {
          allPromises.push(this.upload(field, file, request, response, next));
        } else {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          logger.warn(`${field}: Unsupported File Type ${file.mimetype}`);
          next();
        }
      }
      await Promise.all(allPromises);
    } else {
      next();
    }
  };

  private uniqueName = (mimeType: string): string => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${crypto.randomBytes(16).toString("hex")}.${mime.extension(mimeType)}`;
  };

  public upload = async (
    field: string,
    file: Express.Multer.File,
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ): Promise<any> => {
    const uniqueName = this.uniqueName(file.mimetype);
    await (config.get("environment").name === "dev"
      ? this.local(field, uniqueName, file, request, response, next)
      : this.S3(uniqueName, file, field, request, response, next));
    next();
  };

  private local = (
    field: any,
    name: string,
    file: Express.Multer.File,
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ): void => {
    const port = request.app.settings.port;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const assetPath = `${request.protocol}://${request.get("host")}:${port}/static/images/${name}`;
    const uploadPath = `${config.get("assetsDirectory")}/images/${name}`;
    fs.rename(file.path, uploadPath, (errors: any) => {
      if (errors) {
        request.body[field] = errors;
      } else {
        request.body[field] = assetPath;
      }
    });
    next();
  };

  private S3 = async (
    name: string,
    file: Express.Multer.File,
    field: any,
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    AWS.config.update({
      accessKeyId: config.get("aws").accessKeyId,
      secretAccessKey: config.get("aws").secretAccessKey,
    });

    const s3Bucket = new AWS.S3();
    const body = file.buffer.length > 0 ? file.buffer : fs.readFileSync(file.path);
    const params = { Bucket: config.get("aws").s3Bucket, Key: name, Body: body };

    await s3Bucket
      .upload(params)
      .promise()
      .then(
        (data: any) => {
          request.body[field] = data.Location;
        },
        (error: any) => {
          logger.error(error);
          request.body[field] = error;
        }
      );
  };

  private parseExcelFile = async (
    field: string,
    file: Express.Multer.File,
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) => {
    const parsedData = await this.readExcelFile(file);
    const docFn = {
      upload: this.upload,
      data: parsedData,
    };
    request.parsedData = request.parsedData
      ? (request.parsedData[field] = docFn)
      : { [field]: docFn };
    next();
  };

  private readExcelFile = async (file: Express.Multer.File): Promise<any> => {
    const data: {
      sheetId: number;
      data: { rowNumber: number; data: Excel.CellValue[] | { [key: string]: Excel.CellValue } }[];
    }[] = [];
    const workbook = new Excel.Workbook();
    const subjectFile = await workbook.xlsx.readFile(file.path);
    subjectFile.eachSheet((sheet, id) => {
      const dataStore: {
        rowNumber: number;
        data: Excel.CellValue[] | { [key: string]: Excel.CellValue };
      }[] = [];
      sheet.eachRow((row, rowNumber) => {
        const rowData = { rowNumber: rowNumber, data: row.values };
        dataStore.push(rowData);
      });
      data.push({ sheetId: id, data: dataStore });
    });
    return data;
  };
}
