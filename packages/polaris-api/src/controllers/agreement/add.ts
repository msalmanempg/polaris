import fs from "fs";
import multer from "multer";
import {
  Agreement,
  AgreementCompany,
  AgreementCompanyService,
  AgreementCustomer,
  AgreementCustomerService,
  AgreementService,
  Customer,
  CustomerService,
  DraftAgreementService,
  Nominee,
  NomineeService,
} from "@polaris/domain";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { config } from "polaris-api/config";
import { AwsS3Client } from "polaris-api/utils/storage";
import {
  createAgreementCompanyValidator,
  createAgreementCustomerParentValidator,
  createAgreementCustomerValidator,
  createAgreementNomineeValidator,
  createAgreementValidator,
} from "polaris-api/utils/validators";

/* eslint-disable unicorn/no-array-for-each */
interface Attachment {
  fileName: string;
  type: string;
  file?: Buffer;
}

const getFileFromStorage = (attachment: Attachment, files: Express.Multer.File[]): void => {
  const file = files.find((file) => file.originalname === attachment.fileName);
  attachment.file = file && fs.readFileSync(file.path);
};

const processAttachments = (request: Request, response: Response, next: NextFunction): void => {
  const files = request.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return next();
  }

  const { agreementAttachments, customers, nominees } = request.body;

  if (agreementAttachments && agreementAttachments.length > 0) {
    agreementAttachments.forEach((agreementAttachment: Attachment) =>
      getFileFromStorage(agreementAttachment, files)
    );
  }

  customers.forEach((customer: any) => {
    if (customer.customerAttachments && customer.customerAttachments.length > 0) {
      customer.customerAttachments.forEach((customerAttachment: Attachment) =>
        getFileFromStorage(customerAttachment, files)
      );
    }
  });

  nominees.forEach((nominee: any) => {
    if (nominee.nomineeAttachments && nominee.nomineeAttachments.length > 0) {
      nominee.nomineeAttachments.forEach((nomineeAttachment: Attachment) => {
        getFileFromStorage(nomineeAttachment, files);
      });
    }
  });

  next();
};

const createBaseAgreement = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const agreementService: AgreementService = request.injector.get(AgreementService);
  const awsS3Client: AwsS3Client = request.injector.get(AwsS3Client);
  const requestData = matchedData(request, { includeOptionals: true });

  const agreement = await agreementService.create(requestData as Agreement);

  const { agreementAttachments } = request.body;

  if (agreementAttachments) {
    agreementAttachments.map(async (attachment: Attachment) => {
      const uploadedAttachment = await awsS3Client.uploadFile(attachment.file as Buffer, {
        uniqueName: attachment.fileName,
        objectFolder: `${agreement.id as number}`,
        tenantFolder: "agreements",
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return agreementService.saveAttachment(agreement.id as number, {
        fileName: attachment.fileName,
        type: attachment.type,
        key: uploadedAttachment && uploadedAttachment.Key,
      });
    });
  }

  request.body["agreementId"] = agreement.id ? agreement.id : undefined;
  next();
};

const createCustomer = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const customerService: CustomerService = request.injector.get(CustomerService);
  const awsS3Client: AwsS3Client = request.injector.get(AwsS3Client);
  const requestData = matchedData(request, { includeOptionals: true });

  const { agreementId } = request.body;

  const customers: Customer[] | void = await Promise.all(
    requestData.customers.map(async (customerData: any) => {
      const data = {
        ...customerData,
        type: undefined,
        address: undefined,
        email: undefined,
        primaryPhoneNumber: undefined,
        secondaryPhoneNumber: undefined,
      };
      const { customerAttachments, ...customerUpsertData } = data;

      const customer = await customerService.upsert(customerUpsertData);

      if (customerAttachments) {
        customerAttachments.map(async (attachment: Attachment) => {
          const uploadedAttachment = await awsS3Client.uploadFile(attachment.file as Buffer, {
            uniqueName: attachment.fileName,
            objectFolder: `${agreementId as number}`,
            tenantFolder: "agreements",
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return customerService.saveAttachment(customer.id as number, {
            fileName: attachment.fileName,
            type: attachment.type,
            key: uploadedAttachment && uploadedAttachment.Key,
          });
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return customer;
    })
  );
  const agreementCustomers: AgreementCustomer[] = [];

  if (customers && customers.length > 0) {
    for (const customer of customers) {
      const rawCustomer = request.body.customers.find(
        (x: Customer) => x.govtId === customer.govtId
      );
      rawCustomer
        ? agreementCustomers.push({
            customerId: customer.id ? customer.id : 0,
            type: rawCustomer.type,
            agreementId: agreementId,
            isPrimary: rawCustomer.isPrimary,
            email: rawCustomer.email,
            primaryPhoneNumber: rawCustomer.primaryPhoneNumber,
            secondaryPhoneNumber: rawCustomer.secondaryPhoneNumber,
            address: rawCustomer.address,
          })
        : false;
    }

    request.body.customers = customers;
    request.body.agreementCustomers = agreementCustomers;
  }
  next();
};

const createAgreementCustomer = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const agreementCustomerService: AgreementCustomerService = request.injector.get(
    AgreementCustomerService
  );
  const requestData = matchedData(request, { includeOptionals: true });
  const agreementId = request.body.agreementId;
  const rawAgreementCustomers = requestData.agreementCustomers as AgreementCustomer[];
  const agreementCustomer = await agreementCustomerService.createMany(
    rawAgreementCustomers,
    agreementId
  );

  request.body["agreementCustomers"] = agreementCustomer;

  next();
};

const createAgreementCompany = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  if (request.body.company) {
    const requestData = matchedData(request, { includeOptionals: true });
    const agreementCompanyService: AgreementCompanyService = request.injector.get(
      AgreementCompanyService
    );
    const rawCompany = requestData?.company as AgreementCompany;
    const customerId = request.body.customers[0] ? request.body.customers[0].id : 0;
    const agreementCompany = await agreementCompanyService.create(rawCompany, customerId);
    request.body["agreementCompany"] = agreementCompany;
  }
  next();
};

const createAgreementNominee = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const nomineeService: NomineeService = request.injector.get(NomineeService);
  const awsS3Client: AwsS3Client = request.injector.get(AwsS3Client);
  const requestData = matchedData(request, { includeOptionals: true });
  const { agreementId } = request.body;

  const nominees: Nominee[] | void = await Promise.all(
    requestData.nominees.map(async (nomineeData: any) => {
      const { nomineeAttachments, ...nomineeUpsertData } = nomineeData;

      const nominee = await nomineeService.create(nomineeUpsertData, agreementId);

      if (nomineeAttachments) {
        nomineeAttachments.map(async (attachment: Attachment) => {
          const uploadedAttachment = await awsS3Client.uploadFile(attachment.file as Buffer, {
            uniqueName: attachment.fileName,
            objectFolder: `${agreementId as number}`,
            tenantFolder: "agreements",
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return nomineeService.saveAttachment(nominee.id as number, {
            fileName: attachment.fileName,
            type: attachment.type,
            key: uploadedAttachment && uploadedAttachment.Key,
          });
        });
      }
    })
  );

  request.body["nominees"] = nominees;
  next();
};

const agreementDetails = async (request: Request, response: Response): Promise<void> => {
  const agreementId = request.body.agreementId ? request.body.agreementId : undefined;
  const agreementService: AgreementService = request.injector.get(AgreementService);
  const agreementData: Agreement | null = await agreementService.getAgreementdetail(agreementId);

  if (agreementData && agreementData.agreementNumber) {
    const draftService: DraftAgreementService = request.injector.get(DraftAgreementService);
    const draft = await draftService.getDetails(undefined, agreementData.agreementNumber);
    if (draft && draft.agreementNumber) {
      await draftService.delete(agreementData.agreementNumber);
    }
  }

  response.status(201);
  response.json({
    ...agreementData,
    company: request.body.agreementCompany ? request.body.agreementCompany : {},
  });
  response.end();
};

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

export const createAgreement = [
  upload.any(),
  processAttachments,
  createAgreementValidator,
  createBaseAgreement,
  createAgreementCustomerParentValidator,
  createCustomer,
  createAgreementCustomerValidator,
  createAgreementCustomer,
  createAgreementCompanyValidator,
  createAgreementCompany,
  createAgreementNomineeValidator,
  createAgreementNominee,
  agreementDetails,
] as RequestHandler[];
