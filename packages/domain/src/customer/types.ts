import { Gender } from "../common";

export type CustomerGovtIdType = "cnic" | "nicop" | "poc";

export type CustomerRelationType = "father" | "husband";

export interface Customer {
  id?: number | null | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  fullName: string;
  govtIdType: CustomerGovtIdType;
  govtId: string;
  relationType: CustomerRelationType;
  guardianName: string;
  nationality: string;
  passportNumber?: string | null;
  dateOfBirth: string | Date;
  gender: Gender;
  meta: any;
}
