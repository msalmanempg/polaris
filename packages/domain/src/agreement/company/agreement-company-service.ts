import { PrismaClient } from "@polaris/prisma";
import { create } from "domain";
import { Injectable } from "injection-js";
import { AgreementCompany } from "./types";

@Injectable()
export class AgreementCompanyService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create agreement company record
   * @param { AgreementCompany } agreementCompany data
   * @param { number } agreementCustomerId agreement customer id
   * @return { Promise<AgreementCompany>} Promise containing agreement company data
   */
  public async create(
    agreementCompany: AgreementCompany,
    agreementCustomerId: number
  ): Promise<AgreementCompany> {
    return this.prisma.agreementCompany.upsert({
      where: { registrationNumber: agreementCompany.registrationNumber },
      create: { ...agreementCompany, agreementCustomerId: agreementCustomerId },
      update: { ...agreementCompany },
    });
  }
}
