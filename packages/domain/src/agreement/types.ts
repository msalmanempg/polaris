import { SalePerson } from "./sale-person";
import { AgreementCustomer } from "./customer";
import { UnitIncludeProject } from "./../index";

export type attachmentType = "Agreement" | "Booking Form" | "Payment Plan" | "Floor Plan" | "Other";
export type AgreementStatus = "draft" | "review" | "active" | "transferred" | "terminated";
export type AgreementStatusAll = AgreementStatus | "all";
export interface AgreementDTO {
  id: number;
  agreementNumber: string;
  agreementDate: Date;
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

export interface Agreement {
  id?: number;
  leadId: number;
  agreementNumber: string;
  publishedPrice: number;
  bookingPrice: number;
  discountValue?: number | null | undefined;
  posessionValue: number;
  unitId: number;
  status: AgreementStatus;
  bookingDate: Date;
  notarisedDate: Date;
  agreementDate: Date;
  installmentStartDate: Date;
  installmentEndDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  payments?: undefined;
  customers?: AgreementCustomer[];
  salesPerson?: SalePerson[];
}

export interface CreateAgreementDTO extends Agreement {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface AgreementsQueryResult {
  id: number;
  leadId: number;
  agreementNumber: string;
  publishedPrice: number;
  bookingPrice: number;
  discountValue?: number | null | undefined;
  posessionValue: number;
  unitId: number;
  status: AgreementStatus;
  bookingDate: Date;
  notarisedDate: Date;
  agreementDate: Date;
  installmentStartDate: Date;
  installmentEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
  customers: Array<{
    Customer: {
      id: number;
      fullName: string;
      govtId?: string;
    };
  }>;
  Unit: {
    id: number;
    unitNumber: string;
    Project: {
      id: number;
      name: string;
    };
  };
}

export interface AgreementStats {
  status: AgreementStatusAll;
  count: number;
}
export interface AgreementAttachment {
  id?: number;
  agreementId: number;
  attachmentId: number;
  type: attachmentType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgreementNumberValidity {
  count: { agreementNumber: number };
}

export interface HybridAgreement {
  id?: number;
  leadId?: number;
  agreementNumber: string;
  publishedPrice?: number;
  bookingPrice?: number;
  discountValue?: number | null | undefined;
  posessionValue?: number;
  unitId: number;
  status: AgreementStatus;
  bookingDate?: Date;
  notarisedDate?: Date;
  agreementDate?: Date;
  installmentStartDate?: Date;
  installmentEndDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  payments?: undefined;
  customers?: AgreementCustomer[];
  salesPerson?: SalePerson[];
  Unit?: UnitIncludeProject;
}

export interface PaginatedHybridAgreement {
  agreements: HybridAgreement[];
  count?: number;
  pageSize?: number;
  pageOffset?: number;
  stats?: any[];
}
