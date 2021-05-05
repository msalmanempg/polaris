export type attachmentType = "ID Front" | "ID Back" | "Profile Picture" | "Other";
export type govtIdType = "cnic" | "nicop" | "poc";

export interface Nominee {
  id?: number;
  govtId: string;
  govtIdType: govtIdType;
  nomineeFor: string;
  fullName: string;
  contactNumber: string;
  email: string;
  relationship: string;
  meta?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NomineeAttachment {
  id?: number;
  nomineeId: number;
  attachmentId: number;
  type: attachmentType;
  createdAt?: Date;
  updatedAt?: Date;
}
