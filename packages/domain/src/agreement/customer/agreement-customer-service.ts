import { Prisma, PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { AgreementCustomer } from "./types";

@Injectable()
export class AgreementCustomerService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create Agreement customer records
   * @param { AgreementCustomer } agreementCustomer agreement customer data
   * @param { number } customerId parent customer id
   * @param { number } agreementId agreement Id
   * @returns { Promise<AgreementCustomer } Promise containing agreement customer data
   */

  public async createMany(
    agreementCustomers: AgreementCustomer[],
    agreementId: number
  ): Promise<any> {
    const allCustomers: any[] = [];
    for (const agreementCustomer of agreementCustomers) {
      const customerData: Prisma.AgreementCustomerCreateInput = {
        ...{ ...agreementCustomer, customerId: undefined, agreementId: undefined },
        Customer: { connect: { id: agreementCustomer.customerId } },
        Agreement: { connect: { id: agreementId } },
      };
      allCustomers.push(
        this.prisma.agreementCustomer.create({
          data: customerData,
        })
      );
    }
    return this.prisma.$transaction(allCustomers);
  }
}
