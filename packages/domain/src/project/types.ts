import { Unit } from "../unit";

export interface Project {
  id?: number | null | undefined;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  longitude: number;
  latitude: number;
  email: string;
  phone: string;
  url: string;
  completionDate: Date | null | undefined;
  logo: string;
  meta?: any;
  bankDetails?: ProjectBankDetail[] | any;
  unit?: Unit[] | any;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}

export interface ProjectBankDetail {
  id?: number;
  bankName: string;
  accountTitle: string;
  iban: string;
  accountNumber: string;
  swiftCode: string;
  branchAddress: string;
  branchCode: string;
  meta?: any;
  projectId?: number | null | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}

export interface PaginatedProject {
  count: number | undefined;
  pageSize: number | undefined;
  pageOffset: number | undefined;
  results: Project[];
}
