import AWS from "aws-sdk";
import crypto from "crypto";
import Excel from "exceljs";
import Stream from "stream";
import { config } from "polaris-api/config";
import { ExcelColumn } from "polaris-api/types/excelColumn";

const createWorkBook = async (columns: ExcelColumn[], data: any[]): Promise<any> => {
  const fileStream = new Stream.PassThrough();
  const workbook = new Excel.Workbook();
  workbook.creator = "Polaris-Platform";
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet("inventory", { views: [{ state: "frozen", xSplit: 1 }] });
  worksheet.columns = columns;
  worksheet.addRows(data);

  await workbook.xlsx.write(fileStream);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await uploadToS3(fileStream);
};

const uploadToS3 = async (stream: any): Promise<any> => {
  AWS.config.update({
    accessKeyId: config.get("aws").accessKeyId,
    secretAccessKey: config.get("aws").secretAccessKey,
  });
  const s3Bucket = new AWS.S3();
  const fileName = `${crypto.randomBytes(16).toString("hex")}.xlsx`;
  const uploadParams = { Bucket: config.get("aws").s3Bucket, Key: fileName, Body: stream };
  return process.env.NODE_ENV !== "test"
    ? await s3Bucket.upload(uploadParams).promise()
    : { Location: "https://localhost:3000/testfile" };
};

export const exportExcelFile = async (columns: ExcelColumn[], data: any[]): Promise<any> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await createWorkBook(columns, data);
};
