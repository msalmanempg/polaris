import { Prisma, PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { ImportUnit, PaginatedUnit, ProjectUnitDTO, Unit, UnitStats, UnitStatus } from "./types";

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Lists all units
   * @param { number } pageOffset page offset
   * @param { number } pageSize page size
   * @param { number } projectId project id
   * @returns { Promise<PaginatedUnit | Unit[]> } Promise containing list of all units (paginated or not based on query parameters provided).
   */
  async all(
    pageOffset?: number,
    pageSize?: number,
    projectId?: number,
    status?: UnitStatus
  ): Promise<ProjectUnitDTO[] | PaginatedUnit> {
    if (pageSize) {
      const units = await this.prisma.unit.findMany({
        skip: pageOffset,
        take: pageSize,
        orderBy: {
          unitNumber: "asc",
        },
        include: {
          Project: {
            select: {
              name: true,
            },
          },
        },
        where: {
          ...(!!projectId && {
            projectId: {
              equals: projectId,
            },
          }),
          ...(!!status && {
            status: {
              equals: status,
            },
          }),
        },
      });

      return {
        pageSize: pageSize,
        pageOffset: pageOffset,
        results: units,
        count: await this.prisma.unit.count({
          where: {
            ...(!!projectId && {
              projectId: {
                equals: projectId,
              },
            }),
            ...(!!status && {
              status: {
                equals: status,
              },
            }),
          },
        }),
      } as PaginatedUnit;
    } else {
      return this.prisma.unit.findMany({
        include: {
          Project: {
            select: {
              name: true,
            },
          },
        },
        where: {
          ...(!!projectId && {
            projectId: {
              equals: projectId,
            },
          }),
          ...(!!status && {
            status: {
              equals: status,
            },
          }),
        },
      });
    }
  }

  /**
   * Get unit Details
   * @param { Number } unitId unit Id
   * @returns { Promise<Unit> } Promise containing unit against the unitId provided.
   */
  async getUnitDetail(unitId?: number): Promise<Unit | null> {
    return await this.prisma.unit.findUnique({
      where: { id: unitId },
    });
  }

  /**
   * Creates a new unit
   * @param { Unit } unit unit data
   * @returns { Promise<Unit> } Promise containing newly created unit object.
   */
  public async create(unit: Unit): Promise<Unit> {
    const unitData: Prisma.UnitCreateInput = {
      ...unit,
      Project: {
        connect: {
          id: unit.projectId,
        },
      },
    };
    return this.prisma.unit.create({ data: unitData });
  }

  /**
   * Updates an existing unit
   * @param { Unit } unit unit data
   * @param { number } unitId unit id
   * @returns { Promise<Unit> } Promise containing updated unit object.
   */
  public async update(unit: Unit, unitId: number): Promise<Unit> {
    const unitData: Prisma.UnitUpdateInput = {
      ...unit,
    };
    return this.prisma.unit.update({
      where: { id: unitId },
      data: unitData,
    });
  }

  /**
   * Deletes an existing unit
   * @param { number } unitId unit id
   * @returns { Promise<Unit | void> } Promise containing deleted unit object.
   */
  public async delete(unitId: number): Promise<Unit | void> {
    return this.prisma.unit.delete({ where: { id: unitId } });
  }

  /**
   * Import Units Data and create or update based on data
   * @param { ImportUnit } data units data array
   * @returns { Promise<Unit[] | void } Promise containing units list
   */
  public async import(data: ImportUnit): Promise<Unit[] | void | unknown> {
    const units: Unit[] = data.units;
    const projectId: number = data.projectId;
    // eslint-disable-next-line sonarjs/no-unused-collection
    const allPromises = [];
    for (const unit of units) {
      // TODO: This calculation would be based on unit engagement with Agreements
      const status = unit.status ? unit.status : "available";
      allPromises.push(
        this.prisma.unit.upsert({
          where: { unitNumber: unit.unitNumber },
          update: { ...unit, id: undefined, projectId: projectId },
          create: { ...unit, id: undefined, projectId: projectId, status: status },
        })
      );
    }
    return await this.prisma.$transaction(allPromises);
  }

  /**
   * Units related to Single Project
   * @param { projectId } number project id
   * @returns { Promise<Unit[] | void> } Promise containing units list
   */
  public async projectUnits(projectId: number): Promise<Unit[] | void> {
    return this.prisma.unit.findMany({ where: { projectId: projectId } });
  }

  /**
   * Returns units count with respect to status
   * @param { number } projectId project id
   * @returns { Promise<UnitStats> } Promise containing units list
   */
  public async getUnitsStats(projectId?: number): Promise<UnitStats[]> {
    const unitStatuses: unknown = await this.prisma.unit.groupBy({
      by: ["status"],
      count: true,
      where: {
        ...(!!projectId && {
          projectId: {
            equals: projectId,
          },
        }),
      },
    });

    let totalCount = 0;

    (unitStatuses as UnitStats[]).map((unitStatus) => (totalCount += unitStatus.count));

    (unitStatuses as UnitStats[]).push({
      status: "all",
      count: totalCount,
    });

    return unitStatuses as UnitStats[];
  }
}
