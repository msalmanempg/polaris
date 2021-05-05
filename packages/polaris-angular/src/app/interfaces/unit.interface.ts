import { unitStatus } from ".prisma/client";

export type UnitType = "residential" | "commercial";

export type UnitStatus = "booked" | "sold" | "available";

export type UnitStatusAll = UnitStatus | "all";

export interface UnitStatusCount {
  status: unitStatus | "all";
  count: number;
}

export interface PaginatedUnit {
  count: number | undefined;
  pageSize: number | undefined;
  pageOffset: number | undefined;
  results: Unit[];
  stats?: [];
}

export interface Unit {
  id?: number | null | undefined;
  unitNumber: string;
  location: string;
  type: UnitType;
  bed: number;
  basePrice: number;
  publishedPrice: number;
  netArea: number;
  grossArea: number;
  status: UnitStatus;
  projectId: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Project: {
    name: string;
  };
  completionDate: Date | null | undefined | string;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}
