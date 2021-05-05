import {
  CustomerType,
  GovtIdType,
  RelationType,
  GenderType,
  CustomerAttachmentType,
} from "@app/types/customer.type";

export interface Customer {
  id?: number;
  type?: CustomerType;
  govtIdType?: GovtIdType;
  govtId?: string;
  fullName?: string;
  guardianName?: RelationType;
  relationshipFullName?: string;
  relationType?: string;
  nationality?: string;
  passportNumber?: string;
  gender?: GenderType;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  email?: string;
  primaryContactNumber?: string;
  secondaryContactNumber?: string;
  isPrimary?: number;
  customerAttachments?: CustomerAttachment[];
}

export interface CustomerAttachment {
  id?: number;
  fileName?: string;
  fileExtension?: string;
  file?: File;
  type?: CustomerAttachmentType;
}

export interface Nominee {
  govtIdType?: GovtIdType;
  govtIdNumber?: number;
  fullName?: string;
  contactNumber?: string;
  email?: string;
  nomineeFor?: string;
  relationship?: string;
  nomineeAttachments?: CustomerAttachment[];
}

export interface Company {
  name?: GovtIdType;
  ntn?: number;
  registration?: string;
  address?: string;
  city?: string;
  email?: string;
  contactNumber?: string;
}
