import { Prisma, PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { SalePerson } from "./types";

@Injectable()
export class SalePersonService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create new SalePerson
   * @param { SalePerson } saleperson sale person data
   * @param { number } agreementId agreement number
   * @returns { Promise<SalePerson> } Promise containing new created Sale Person
   */
  public async create(saleperson: SalePerson, agreementId: number): Promise<SalePerson> {
    const salePersonData: Prisma.SalePersonCreateInput = {
      ...saleperson,
      Agreement: {
        connect: {
          id: agreementId,
        },
      },
    };
    return this.prisma.salePerson.create({ data: salePersonData });
  }
}
