import { NomineeAttachment, nomineeAttachmentType, Prisma, PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { AttachmentDTO } from "../../common";
import { Nominee } from "./types";

@Injectable()
export class NomineeService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create Mulitple Nominee
   * @param { Nominee[] } nominees nominees data
   * @param { number } agreementId agreement Id
   * @returns { Promise<Nominee[]> } Promise containing newly created Nominess
   */

  public async createMany(nominees: Nominee[], agreementId: number): Promise<Nominee[]> {
    const allNominees = [];
    for (const nominee of nominees) {
      const nomineeData: Prisma.NomineeCreateInput = {
        ...nominee,
        Agreement: { connect: { id: agreementId } },
      };
      allNominees.push(this.prisma.nominee.create({ data: nomineeData }));
    }
    return this.prisma.$transaction(allNominees);
  }

  /**
   * Create Nominee
   * @param { Nominee } nominee nominee data
   * @param { number } agreementId agreement Id
   * @returns { Promise<Nominee> } Promise containing newly created Nominee
   */

  public async create(nominee: Nominee, agreementId: number): Promise<Nominee> {
    const nomineeData: Prisma.NomineeCreateInput = {
      ...nominee,
      Agreement: { connect: { id: agreementId } },
    };

    return this.prisma.nominee.create({ data: nomineeData });
  }

  /**
   * Create or update a nominee
   * @param { Nominee } nominee nominee data
   * @param { number } agreementId agreement Id
   * @return { Promise<Nominee> } Promise containing newly created or updated nominee
   */
  public async upsert(nominee: Nominee, agreementId: number): Promise<Nominee> {
    return this.prisma.nominee.upsert({
      where: {
        id: nominee.id,
      },
      update: { ...nominee, id: undefined },
      create: { ...nominee, id: undefined, Agreement: { connect: { id: agreementId } } },
    });
  }

  /**
   * Save nominees' attachments
   * @param { number } nomineeId nominee Id
   * @param { Attachment } attachment nominee attachment
   * @return { Promise<NomineeAttachment> } Promise containing a NomineeAttachment
   */
  public async saveAttachment(
    nomineeId: number,
    attachment: AttachmentDTO
  ): Promise<NomineeAttachment> {
    return this.prisma.nomineeAttachment.create({
      data: {
        type: attachment.type as nomineeAttachmentType,
        nomineeId: nomineeId,
        Attachment: {
          create: {
            name: attachment.fileName,
            key: attachment.key as string,
          },
        },
      },
    });
  }
}
