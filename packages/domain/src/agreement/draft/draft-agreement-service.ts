import { PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { DraftAgreement } from "./types";

@Injectable()
export class DraftAgreementService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create Draft Agreement
   * @param { DraftAgreement } data draft data
   * @returns { Promise<DraftAgreement> } Promise containing newly created draft
   */
  async create(data: DraftAgreement): Promise<DraftAgreement> {
    return this.prisma.draftAgreement.upsert({
      where: { agreementNumber: data.agreementNumber },
      create: { ...data },
      update: { ...data },
    });
  }

  /**
   * Get All Draft Agreements
   * @returns {  Promise <DraftAgreement[]> } Promise containing list of all drafts
   */
  async all(): Promise<DraftAgreement[]> {
    return this.prisma.draftAgreement.findMany({});
  }

  /**
   * Get Detail of a Draft by Id or Agreement Number
   * @param { number } id unique record id
   * @param { string } agreementNumber unique agreementNumber
   * @returns { Promise<DraftAgreement>} Promise containing record details
   */
  async getDetails(id?: number, agreementNumber?: string): Promise<DraftAgreement | null> {
    const query = id ? { id: id } : agreementNumber ? { agreementNumber: agreementNumber } : {};
    return this.prisma.draftAgreement.findUnique({ where: { ...query } });
  }

  /**
   * Remove record from table
   * @param { string } agreementNumber unique agreement number
   * @returns { Promise<DraftAgreement>} Promise containing deleted record details
   */
  async delete(agreementNumber: string): Promise<DraftAgreement | void> {
    return this.prisma.draftAgreement.delete({ where: { agreementNumber: agreementNumber } });
  }
}
