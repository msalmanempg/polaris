import { Project } from "../project";
export type UnitType = "residential" | "commercial";

export type UnitStatus = "booked" | "sold" | "available";

export interface PaginatedUnit {
  count: number | undefined;
  pageSize: number | undefined;
  pageOffset: number | undefined;
  results: ProjectUnitDTO[];
}

export interface Unit {
  id: number | undefined;
  unitNumber: string;
  location: string;
  type: UnitType;
  bed: number;
  basePrice: number;
  publishedPrice: number;
  netArea: number;
  grossArea: number;
  status: UnitStatus;
  meta?: any;
  projectId: number;
  completionDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitIncludeProject extends Unit {
  Project: Project;
}

export interface ProjectUnitDTO extends Unit {
  Project: {
    name: string;
  };
}
export interface ImportUnit {
  projectId: number;
  units: Unit[];
}

export interface UnitStats {
  status: UnitStatus | "all";
  count: number;
}
