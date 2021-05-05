import {
  AgreementAttachment,
  agreementDocumentType,
  agreementStatus,
  Prisma,
  PrismaClient,
} from "@polaris/prisma";
import { Injectable } from "injection-js";

import { AttachmentDTO } from "../common";
import { AgreementCustomer } from "./customer";
import { SalePerson } from "./sale-person";
import {
  Agreement,
  AgreementDTO,
  AgreementNumberValidity,
  AgreementsQueryResult,
  AgreementStats,
  PaginatedAgreement,
  HybridAgreement,
  PaginatedHybridAgreement,
} from "./types";

@Injectable()
export class AgreementService {
  public preCalculatedHybridStats: any;
  constructor(private prisma: PrismaClient) {}

  /**
   * Lists all units
   * @param { number } pageOffset page offset
   * @param { number } pageSize page size
   * @param { number } projectId project id
   * @returns { Promise<PaginatedAgreement | AgreementDTO[]> } Promise containing list of all agreements (paginated or not based on query parameters provided).
   */
  async all(
    pageOffset?: number,
    pageSize?: number,
    projectId?: number,
    unitId?: number,
    customerGovtId?: string,
    status?: agreementStatus
  ): Promise<PaginatedAgreement | AgreementDTO[]> {
    const findAgreementsIncludeQuery = {
      customers: {
        select: {
          id: true,
          Customer: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        where: {
          isPrimary: true,
        },
      },
      Unit: {
        select: {
          id: true,
          unitNumber: true,
          Project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    };

    const findAgreementsWhereQuery = {
      ...((!!projectId || !!unitId) && {
        Unit: {
          ...(!!unitId && {
            id: unitId,
          }),
          ...(!!projectId && {
            Project: {
              id: projectId,
            },
          }),
        },
      }),
      ...(!!customerGovtId && {
        customers: {
          some: {
            Customer: {
              govtId: customerGovtId,
            },
          },
        },
      }),
      ...(!!status && {
        status: {
          equals: status,
        },
      }),
    };

    const findAgreementsPaginationQuery = {
      include: findAgreementsIncludeQuery,
      where: findAgreementsWhereQuery,
      skip: pageOffset,
      take: pageSize,
      orderBy: {
        agreementNumber: Prisma.SortOrder.asc,
      },
    };

    if (pageSize) {
      const [agreementsQueryResult, agreementsQueryResultCount] = await Promise.all([
        this.prisma.agreement.findMany(findAgreementsPaginationQuery),
        this.prisma.agreement.count({
          where: findAgreementsWhereQuery,
        }),
      ]);

      const agreements = this.mapAgreementsQueryResultToDTO(agreementsQueryResult);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        pageSize: pageSize,
        pageOffset: pageOffset,
        agreements: agreements,
        count: agreementsQueryResultCount,
      } as PaginatedAgreement;
    } else {
      const agreementsQueryResult = await this.prisma.agreement.findMany({
        include: findAgreementsIncludeQuery,
      });

      return this.mapAgreementsQueryResultToDTO(agreementsQueryResult);
    }
  }

  /**
   * Maps agreements query result to argreements data tranfer objects
   * @param { AgreementsQueryResult[] } agreementsQueryResult page offset
   * @returns { AgreementDTO[]> } an array of all agreements data transfer objects
   */
  mapAgreementsQueryResultToDTO(agreementsQueryResult: AgreementsQueryResult[]): AgreementDTO[] {
    return agreementsQueryResult.map((agreement) => {
      const [agreementCustomer] = agreement.customers;

      return {
        //...agreement,
        id: agreement.id,
        agreementNumber: agreement.agreementNumber,
        agreementDate: agreement.agreementDate,
        status: agreement.status,
        paymentPercentage: 0,
        noticesCount: 0,
        overduePayments: 0,
        unit: {
          id: agreement.unitId,
          unitNumber: agreement.Unit.unitNumber,
          project: {
            id: agreement.Unit.Project.id,
            name: agreement.Unit.Project.name,
          },
        },
        customer: {
          id: agreementCustomer?.Customer.id,
          name: agreementCustomer?.Customer.fullName,
        },
      } as AgreementDTO;
    });
  }

  /**
   * Returns agreements stats and count with respect to status
   * @param { number } projectId project id
   * @returns { Promise<AgreementStats> } Promise containing agreement stats
   */
  public async getAgreementsStats(
    projectId?: number,
    unitId?: number,
    customerGovtId?: string
  ): Promise<AgreementStats[]> {
    const agreementStatuses: unknown = await this.prisma.agreement.groupBy({
      by: ["status"],
      count: true,
      where: {
        ...((!!projectId || !!unitId) && {
          Unit: {
            ...(!!unitId && {
              id: unitId,
            }),
            ...(!!projectId && {
              Project: {
                id: projectId,
              },
            }),
          },
        }),
        ...(!!customerGovtId && {
          customers: {
            some: {
              Customer: {
                govtId: customerGovtId,
              },
            },
          },
        }),
      },
    });

    let totalCount = 0;

    (agreementStatuses as AgreementStats[]).map(
      (agreementStatus) => (totalCount += agreementStatus.count)
    );

    (agreementStatuses as AgreementStats[]).push({
      status: "all",
      count: totalCount,
    });

    return agreementStatuses as AgreementStats[];
  }
  /**
   * Creates new agreement
   * @param { Agreement } agreement agreement data
   * @returns { Promise<Agreement> } Promise containing newly created agreement object.
   */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  public async create(agreement: Agreement): Promise<Agreement> {
    const unitId: number = agreement.unitId;
    const salesPerson: SalePerson[] | undefined = agreement.salesPerson;
    const customers: AgreementCustomer[] | undefined = agreement.customers;
    const data = { ...agreement, unitId: undefined };
    const agreementData: Prisma.AgreementCreateInput = {
      ...data,
      Unit: {
        connect: { id: unitId },
      },
      salesPerson: {
        createMany: {
          data: salesPerson ? salesPerson : [],
        },
      },
      customers: {
        createMany: { data: customers ? customers : [] },
      },
    };

    const [, createdAgreement] = await Promise.all([
      this.prisma.unit.update({ where: { id: unitId }, data: { status: "booked" } }),
      this.prisma.agreement.upsert({
        where: { agreementNumber: agreement.agreementNumber },
        create: { ...agreementData },
        update: { ...agreementData },
        include: { salesPerson: true, customers: true },
      }),
    ]);

    return createdAgreement;
  }
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */

  /**
   * Get Details of a Project
   * @param { number } agreementId agreement id
   * @return { Promise <Agreement> } Promise containing agreement details
   */
  public async getAgreementdetail(agreementId: number): Promise<Agreement | null> {
    return this.prisma.agreement.findUnique({
      where: { id: agreementId },
      include: { salesPerson: true, customers: true, nominees: true, Unit: true },
    });
  }

  /**
   * Save agreements' attachments
   * @param { number } agreementId agreement Id
   * @param { Attachment } attachment agreement attachment
   * @return { Promise<AgreementAttachment> } Promise containing a AgreementAttachment
   */
  public async saveAttachment(
    agreementId: number,
    attachment: AttachmentDTO
  ): Promise<AgreementAttachment> {
    return this.prisma.agreementAttachment.create({
      data: {
        agreementId: agreementId,
        type: attachment.type as agreementDocumentType,
        Attachment: {
          create: {
            name: attachment.fileName,
            key: attachment.key as string,
          },
        },
      },
    });
  }

  /**
   * Check if an Agreement Number is unique or not
   * @param { string } agreementNumber agreement number
   * @returns { Promise<Number> } Promise containing number of results found.
   */
  public async validateAgreementNumber(agreementNumber: string): Promise<AgreementNumberValidity> {
    return this.prisma.agreement.aggregate({
      where: {
        agreementNumber: {
          contains: agreementNumber,
        },
      },
      count: { agreementNumber: true },
    });
  }

  /**
   * Creates a Paginated Hybrid response of Agreements and Drafts
   * @param { number } pageOffset page offset
   * @param { number } pageSize page size
   * @returns { Promise<PaginatedAgreement | AgreementDTO[]> } Promise containing list of all agreements (paginated or not based on query parameters provided).
   */
  public async hybridAll(
    pageOffset?: number,
    pageSize?: number,
    projectId?: number,
    unitId?: number,
    customerGovtId?: string,
    status?: agreementStatus,
    includeStats?: boolean
  ): Promise<PaginatedHybridAgreement | HybridAgreement[]> {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const collection = await this.createCollection();
    const filteredResults = this.filterCollection(
      collection,
      projectId,
      unitId,
      customerGovtId,
      status
    );
    const mappedCollection = this.hybridMap(filteredResults);
    return pageSize && pageOffset !== undefined
      ? this.paginator(mappedCollection, pageSize, pageOffset, includeStats)
      : mappedCollection;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/no-unsafe-return */
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  /**
   * Create Collection of Agreements and Drafts
   */
  private async createCollection(): Promise<HybridAgreement[]> {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    const collection: Agreement[] = await this.prisma.agreement.findMany({
      where: {},
      include: {
        salesPerson: true,
        customers: { include: { Customer: true } },
        nominees: true,
        Unit: { include: { Project: true } },
      },
    });
    const drafts: any[] = (
      await this.prisma.draftAgreement.findMany({
        where: {},
        include: { Unit: { include: { Project: true } } },
      })
    ).map((x: any) => ({
      ...x.data,
      status: "draft",
      ...x,
      data: undefined,
    }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return [...collection, ...drafts];
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  /**
   * Paginate combined list of agreements and drafts
   * @param { HybridAgreement[] } items array of anytype.
   * @param { number } pageSize page size
   * @param { number } pageOffset page off set
   * @returns { PaginatedHybridAgreement | HybridAgreement[] } returns paginated object or array
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  private paginator(
    items: HybridAgreement[],
    pageSize?: number,
    pageOffset?: number,
    includeStats?: boolean
  ): PaginatedHybridAgreement | HybridAgreement[] {
    return items.length > 0
      ? {
          agreements: pageOffset
            ? items.length > pageOffset
              ? items.slice(
                  pageOffset ? pageOffset : 0,
                  pageSize ? pageOffset + pageSize : pageOffset + 10
                )
              : items
            : items,
          count: items.length,
          pageSize: pageSize,
          pageOffset: pageOffset,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          stats: includeStats ? this.preCalculatedHybridStats : undefined,
        }
      : [];
  }

  /**
   * Filter results
   * @param { HybridAgreement[] } items Array of items to perform filter
   * @param { number } projectId project id
   * @param { number } unitId unit id
   * @param { string } customerGovtId customer's govt Id
   * @param { string } status status of agreement
   * @return { HybridAgreement[] } Collection containing filtered results
   */
  private filterCollection(
    items: HybridAgreement[],
    projectId?: number,
    unitId?: number,
    customerGovtId?: string,
    status?: string
  ): HybridAgreement[] {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    let results: HybridAgreement[];
    results = projectId
      ? items.filter((item: HybridAgreement) => item?.Unit?.Project?.id === projectId)
      : items;
    results = unitId ? results.filter((item: HybridAgreement) => item.unitId === unitId) : results;
    results = customerGovtId
      ? results.filter(
          (item: any) => this.matchCustomerGovtId(item.customers, customerGovtId) === true
        )
      : results;
    this.preCalculatedHybridStats = this.hybridStats(results);
    results = status ? results.filter((item: HybridAgreement) => item.status === status) : results;
    return results;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  /**
   * Check if User with Given Govt Id exists in collection
   * @param { AgreementCustomer[] } collection list of agreement customers
   * @param { string } customerGovtId given govt id to check against
   * @returns { boolean } returns true if record with given govt id exists in collection
   */
  private matchCustomerGovtId(collection: AgreementCustomer[], customerGovtId: string): boolean {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    if (collection && collection.length > 0) {
      const matched = collection.filter(
        (singleton: any) => singleton.Customer.govtId === customerGovtId
      );
      return matched.length > 0 ? true : false;
    }
    return false;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  /**
   * Calculate Stats for Hybrid Collection of Agreements and Drafts
   * @param { HybridAgreement[] } collection Collection of Hybrid Agreements
   * @return { any [] } Returns collection containing stats of given collection.
   */
  private hybridStats(collection: HybridAgreement[]) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    const stats = [];

    const grouped = this.groupBy(collection, (item: any) => item.status);
    for (const [key, value] of grouped) {
      stats.push({ status: key, count: value.length });
    }
    stats.push({ status: "all", count: collection.length });
    return stats;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  private groupBy(list: unknown[], keyGetter: any) {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    const map = new Map();
    for (const item of list) {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    }
    return map;
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  private hybridMap(collection: any) {
    const mappedCollection = [];
    for (const item of collection) {
      if (item) {
        mappedCollection.push(this.keyToLowerCase(item));
      }
    }

    return mappedCollection;
  }

  private keyToLowerCase(obj: any): any {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const unit = obj.Unit ? { ...obj.Unit, project: obj.Unit.Project, Project: undefined } : {};
    return { ...obj, unit: unit, Unit: undefined };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
}
