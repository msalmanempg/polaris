import { AgreementStatus, AgreementAttachmentType } from "@app/types/agreement.type";
import { Customer, Nominee, Company } from "./customer.interface";
export interface AgreementFormDetail {
  leadId?: number;
  agreementNumber?: string;
  status?: AgreementStatus;
  statusType?: string;
  unitId?: number;
  publishedPrice?: string;
  bookingPrice?: number;
  discountValue?: number;
  bookingDate?: string | null;
  posessionValue?: number;
  notarisedDate?: string;
  agreementDate?: string;
  installmentStartDate?: Date;
  installmentEndDate?: Date;
  agreementAttachments?: AgreementAttachment[];
  salePersons?: SalePerson[];
  customers?: Customer[];
  nominees?: Nominee[];
  company?: Company;
}
export interface SalePerson {
  designation?: string;
  fullName?: string;
  email?: string;
  contactNumber?: string;
}
export interface AgreementAttachment {
  id?: number;
  fileName?: string;
  fileExtension?: string;
  file?: File;
  type?: AgreementAttachmentType;
}
export interface AgreementDTO {
  id: number;
  agreementNumber: string;
  agreementDate: string;
  paymentPercentage: number;
  noticesCount: number;
  overduePayments: number;
  status: AgreementStatus;
  unit: {
    id: number;
    unitNumber: string;
    project: {
      id: number;
      name: string;
    };
  };
  customer: {
    id: number;
    name: string;
  };
}

export type AgreementStatusAll = AgreementStatus | "all";

export interface AgreementStatusCount {
  status: AgreementStatusAll;
  count: number;
}

export interface PaginatedAgreement {
  count: number | undefined;
  pageSize: number | undefined;
  pageOffset: number | undefined;
  agreements: AgreementDTO[];
  stats?: [];
}
