import { AgreementCompany } from "./../company";
export type customerType = "individual" | "company";
export interface AgreementCustomer {
  id?: number;
  type: customerType;
  customerId: number;
  agreementId: number;
  isPrimary: boolean;
  meta?: any;
  email: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string | null;
  address: string;
  company?: AgreementCompany;
  createdAt?: Date;
  updatedAt?: Date;
}
