import { Unit } from "./unit.interface";
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
  completionDate: Date | null | undefined | string;
  logo: string;
  bankDetails?: ProjectBankDetail[];
  units?: Unit[];
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}
export interface ProjectBankDetail {
  id?: number | null | undefined;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branchAddress: string;
  branchCode: string;
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
