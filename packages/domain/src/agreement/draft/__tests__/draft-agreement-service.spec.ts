import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { PrismaClient } from "@polaris/prisma";
import { DraftAgreementService } from "../draft-agreement-service";

describe("draftAgreementService", () => {
  let injector: ReflectiveInjector;
  let service: DraftAgreementService;
  let prisma: MockProxy<PrismaClient>;

  const rawDraft = {
    id: 1,
    agreementNumber: "AGR1234",
    unitId: 1,
    data: {},
    createdAt: new Date("2021-02-19T05:20:07.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  };

  const draftsMock = [rawDraft];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      DraftAgreementService,
      {
        provide: PrismaClient,
        useValue: mockDeep<PrismaClient>(),
      },
    ]);
    service = injector.get(DraftAgreementService) as DraftAgreementService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(DraftAgreementService);
  });

  it("should create a draft agreement", async () => {
    prisma.draftAgreement.upsert.mockResolvedValue(rawDraft);

    const draft = await service.create(rawDraft);
    expect(draft).toEqual(rawDraft);
  });

  it("should list all drafts", async () => {
    prisma.draftAgreement.findMany.mockResolvedValue(draftsMock);

    const drafts = await service.all();
    expect(drafts).toEqual(draftsMock);
  });

  it("should get details by agreementNumber", async () => {
    prisma.draftAgreement.findUnique.mockResolvedValue(rawDraft);
    const draftNumber = rawDraft.agreementNumber;
    const draft = await service.getDetails(undefined, draftNumber);
    expect(draft).toEqual(rawDraft);
  });

  it("should delete draft by agreementNumber", async () => {
    prisma.draftAgreement.delete.mockResolvedValue(rawDraft);
    const draftNumber = rawDraft.agreementNumber;
    const draft = await service.delete(draftNumber);
    expect(draft).toEqual(rawDraft);
  });
});
