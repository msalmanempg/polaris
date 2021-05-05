import { Nominee, nomineeAttachmentType, PrismaClient } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { NomineeService } from "..";

describe("NomineeService", () => {
  let injector: ReflectiveInjector;
  let service: NomineeService;
  let prisma: MockProxy<PrismaClient>;

  const nomineesMock: Nominee[] = [
    {
      id: 1,
      govtId: "0000000000000",
      govtIdType: "cnic",
      nomineeFor: "Muhammad Ali",
      fullName: "Arslan Ali",
      contactNumber: "03216786543",
      email: "arslan.ali@gmail.com",
      relationship: "Brother",
      agreementId: 1,
      // eslint-disable-next-line unicorn/no-null
      meta: null,
      createdAt: new Date("2021-04-08T10:22:23.317Z"),
      updatedAt: new Date("2021-04-08T10:22:23.318Z"),
    },
  ];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      NomineeService,
      { provide: PrismaClient, useValue: mockDeep<PrismaClient>() },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    service = injector.get(NomineeService) as NomineeService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(NomineeService);
  });

  it("should create many nominees", async () => {
    prisma.$transaction.mockResolvedValue(nomineesMock);
    const agreementId = 1;
    const nominees = await service.createMany(nomineesMock, agreementId);
    expect(nominees).toEqual(nomineesMock);
  });

  it("should create a nominee", async () => {
    prisma.nominee.create.mockResolvedValue(nomineesMock[0]);

    const agreementId = 1;

    const nominee = await service.create(nomineesMock[0], agreementId);
    expect(nominee).toEqual(nomineesMock[0]);
  });

  it("should upsert a nominee", async () => {
    prisma.nominee.upsert.mockResolvedValue(nomineesMock[0]);

    const agreementId = 1;

    const nominee = await service.upsert(nomineesMock[0], agreementId);
    expect(nominee).toEqual(nomineesMock[0]);
  });

  it("should save attachment", async () => {
    const nomineeAttachment = {
      fileName: "nominee-attachment.png",
      type: "id_front",
      key: "key",
    };

    const nomineeAttachmentsMock = {
      id: 1,
      nomineeId: 1,
      attachmentId: 1,
      type: "id_front" as nomineeAttachmentType,
      createdAt: new Date("2021-04-08T10:22:23.317Z"),
      updatedAt: new Date("2021-04-08T10:22:23.318Z"),
    };

    prisma.nomineeAttachment.create.mockResolvedValue(nomineeAttachmentsMock);

    const nomineeId = 1;

    const savedAttachment = await service.saveAttachment(nomineeId, nomineeAttachment);
    expect(savedAttachment).toEqual(nomineeAttachmentsMock);
  });
});
