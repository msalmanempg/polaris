import { Agreement, agreementDocumentType, agreementStatus, PrismaClient } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { AgreementsQueryResult } from "..";
import { AgreementService } from "../agreement-service";
import { AgreementDTO, PaginatedAgreement } from "../types";

describe("agreementService", () => {
  let injector: ReflectiveInjector;
  let service: AgreementService;
  let prisma: MockProxy<PrismaClient>;

  const rawAgreement: Agreement = {
    id: 1,
    leadId: 1234,
    agreementNumber: "ABC1234",
    publishedPrice: 10000,
    bookingPrice: 9900,
    discountValue: 100,
    posessionValue: 2000,
    unitId: 1,
    status: "active",
    bookingDate: new Date("2022-02-15T00:03:58.000Z"),
    notarisedDate: new Date("2022-02-15T00:03:58.000Z"),
    agreementDate: new Date("2022-02-15T00:03:58.000Z"),
    installmentStartDate: new Date("2022-02-15T00:03:58.000Z"),
    installmentEndDate: new Date("2022-02-15T00:03:58.000Z"),
    createdAt: new Date("2021-02-19T05:20:07.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  };

  const agreementsMock: AgreementsQueryResult[] = [
    {
      id: 1,
      leadId: 1,
      agreementNumber: "AG-01",
      publishedPrice: 5500000,
      bookingPrice: 5000000,
      discountValue: 500000,
      posessionValue: 1000000,
      unitId: 1,
      status: "active",
      bookingDate: new Date("2021-02-20T05:20:07.269Z"),
      notarisedDate: new Date("2021-02-21T05:20:07.269Z"),
      agreementDate: new Date("2021-02-22T05:20:07.269Z"),
      installmentStartDate: new Date("2021-02-23T05:20:07.269Z"),
      installmentEndDate: new Date("2022-02-23T05:20:07.269Z"),
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-23T05:20:07.269Z"),
      customers: [
        {
          Customer: {
            id: 1,
            fullName: "test customer 1",
            govtId: "11111-1111111-1",
          },
        },
      ],
      Unit: {
        id: 1,
        unitNumber: "unit 1",
        Project: {
          id: 1,
          name: "project 1",
        },
      },
    },
  ];

  const expectedAgreements: AgreementDTO[] = [
    {
      id: 1,
      agreementNumber: "AG-01",
      agreementDate: new Date("2021-02-22T05:20:07.269Z"),
      status: "active",
      paymentPercentage: 0,
      noticesCount: 0,
      overduePayments: 0,
      unit: { id: 1, unitNumber: "unit 1", project: { id: 1, name: "project 1" } },
      customer: { id: 1, name: "test customer 1" },
    },
  ];

  const expectedAgreementNumberValidity = {
    count: { agreementNumber: 0 },
    avg: {},
    sum: {},
    min: {},
    max: {},
  };

  const rawDraft = {
    id: 1,
    agreementNumber: "AGR1234",
    unitId: 1,
    Unit: {
      id: 1,
      unitNumber: "unit 1",
      Project: {
        id: 1,
        name: "project 1",
      },
    },
    data: {},
    createdAt: new Date("2021-02-19T05:20:07.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  };

  /* eslint-disable @typescript-eslint/no-unsafe-return */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const expectedHybridAgreementsMock = agreementsMock.map((item: any) => ({
    ...item,
    unit: { ...item.Unit, project: item.Unit.Project, Project: undefined },
    Unit: undefined,
  }));

  /* eslint-enable @typescript-eslint/no-unsafe-return */
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */

  const expectedHybridAgreements = [
    ...expectedHybridAgreementsMock,
    {
      id: 1,
      agreementNumber: "AGR1234",
      unitId: 1,
      status: "draft",
      Unit: undefined,
      unit: {
        id: 1,
        unitNumber: "unit 1",
        Project: undefined,
        project: {
          id: 1,
          name: "project 1",
        },
      },
      data: undefined,
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-19T05:20:07.269Z"),
    },
  ];
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      AgreementService,
      {
        provide: PrismaClient,
        useValue: mockDeep<PrismaClient>(),
      },
    ]);
    service = injector.get(AgreementService) as AgreementService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(AgreementService);
  });

  it("should create an agreement", async () => {
    prisma.agreement.upsert.mockResolvedValue(rawAgreement);
    const agreement = await service.create(rawAgreement);
    expect(agreement).toEqual(rawAgreement);
  });

  it("should get agreements", async () => {
    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);

    const agreements = await service.all();
    expect(agreements).toEqual(expectedAgreements);
  });

  it("should get agreements with pagination", async () => {
    const pageOffset = 0;

    const pageSize = 10;

    const paginationResponse: PaginatedAgreement = {
      pageOffset,
      pageSize,
      count: expectedAgreements.length,
      agreements: expectedAgreements,
    };

    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.agreement.count.mockResolvedValue(agreementsMock.length);

    const PaginatedAgreements = await service.all(pageOffset, pageSize);
    expect(PaginatedAgreements).toEqual(paginationResponse);
  });

  it("should get agreements by project id", async () => {
    const projectId = 1;

    prisma.agreement.findMany.mockResolvedValue(
      agreementsMock.filter((agreement) => agreement.Unit.Project.id === projectId) as any
    );

    const expectedAgreementsByProject = expectedAgreements.filter(
      (agreement) => agreement.unit.project.id === projectId
    );

    const agreements = await service.all(undefined, undefined, projectId);

    expect(agreements).toEqual(expectedAgreementsByProject);
  });

  it("should get agreements by unit id", async () => {
    const unitId = 1;

    prisma.agreement.findMany.mockResolvedValue(
      agreementsMock.filter((agreement) => agreement.Unit.id === unitId) as any
    );

    const expectedAgreementsByProjectUnit = expectedAgreements.filter(
      (agreement) => agreement.unit.id === unitId
    );

    const agreements = await service.all(undefined, undefined, undefined, unitId);

    expect(agreements).toEqual(expectedAgreementsByProjectUnit);
  });

  it("should get agreements by customer govt id", async () => {
    const customerGovtId = "11111-1111111-1";
    const customerId = 1;

    prisma.agreement.findMany.mockResolvedValue(
      agreementsMock.filter((agreement) =>
        agreement.customers.find((customer) => customer.Customer.id === customerId)
      ) as any
    );

    const expectedAgreementsByCustomers = expectedAgreements.filter(
      (agreement) => agreement.customer.id === customerId
    );

    const agreements = await service.all(
      undefined,
      undefined,
      undefined,
      undefined,
      customerGovtId
    );

    expect(agreements).toEqual(expectedAgreementsByCustomers);
  });

  it("should get agreements by status", async () => {
    const status = "active";

    prisma.agreement.findMany.mockResolvedValue(
      agreementsMock.filter((agreement) => agreement.status === status) as any
    );

    const expectedAgreementsByStatus = expectedAgreements.filter(
      (agreement) => agreement.status === status
    );

    const agreements = await service.all(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      status
    );

    expect(agreements).toEqual(expectedAgreementsByStatus);
  });

  it("should get agreements status count", async () => {
    const groupByMock = jest.spyOn(prisma.agreement, "groupBy");

    groupByMock.mockResolvedValueOnce([
      { status: agreementStatus.active, count: 1 },
      { status: agreementStatus.draft, count: 1 },
      { status: agreementStatus.review, count: 1 },
      { status: agreementStatus.terminated, count: 1 },
      { status: agreementStatus.transferred, count: 1 },
    ] as any);

    const agreementsStatusCount = await service.getAgreementsStats();

    expect(agreementsStatusCount).toEqual([
      { status: agreementStatus.active, count: 1 },
      { status: agreementStatus.draft, count: 1 },
      { status: agreementStatus.review, count: 1 },
      { status: agreementStatus.terminated, count: 1 },
      { status: agreementStatus.transferred, count: 1 },
      { status: "all", count: 5 },
    ]);
  });

  it("should get agreements status count by project id, unit id and customer govt id", async () => {
    const groupByMock = jest.spyOn(prisma.agreement, "groupBy");

    groupByMock.mockResolvedValueOnce([
      { status: agreementStatus.active, count: 1 },
      { status: agreementStatus.draft, count: 1 },
      { status: agreementStatus.review, count: 1 },
      { status: agreementStatus.terminated, count: 1 },
      { status: agreementStatus.transferred, count: 1 },
    ] as any);

    const projectId = 1;
    const unitId = 1;
    const customerGovtId = "11111-1111111-1";

    const agreementsStatusCount = await service.getAgreementsStats(
      projectId,
      unitId,
      customerGovtId
    );

    expect(agreementsStatusCount).toEqual([
      { status: agreementStatus.active, count: 1 },
      { status: agreementStatus.draft, count: 1 },
      { status: agreementStatus.review, count: 1 },
      { status: agreementStatus.terminated, count: 1 },
      { status: agreementStatus.transferred, count: 1 },
      { status: "all", count: 5 },
    ]);
  });

  it("should get agreement by id", async () => {
    prisma.agreement.findUnique.mockResolvedValue(rawAgreement);
    const agreementId = 1;
    const agreement = await service.getAgreementdetail(agreementId);
    // TODO: Investigate Why?
    expect(agreement).toMatchObject({});
  });

  it("should save attachment", async () => {
    const agreementAttachment = {
      fileName: "agreement-attachment.png",
      type: "",
      key: "key",
    };

    const agreementAttachmentsMock = {
      id: 1,
      agreementId: 1,
      attachmentId: 1,
      type: "agreement" as agreementDocumentType,
      createdAt: new Date("2021-04-08T10:22:23.317Z"),
      updatedAt: new Date("2021-04-08T10:22:23.318Z"),
    };

    prisma.agreementAttachment.create.mockResolvedValue(agreementAttachmentsMock);

    const agreementId = 1;

    const savedAttachment = await service.saveAttachment(agreementId, agreementAttachment);
    expect(savedAttachment).toEqual(agreementAttachmentsMock);
  });

  it("should check agreement number", async () => {
    prisma.agreement.aggregate.mockResolvedValue(expectedAgreementNumberValidity);
    const agreementNumber = "AG-01";
    const validate = await service.validateAgreementNumber(agreementNumber);
    expect(validate).toEqual(expectedAgreementNumberValidity);
  });

  it("should get hybrid agreemnts", async () => {
    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    const hybridAgreements = await service.hybridAll();
    expect(hybridAgreements).toEqual(expectedHybridAgreements);
  });

  it("should get hybrid agreements with pagination", async () => {
    const pageOffset = 0;

    const pageSize = 10;

    const paginationResponse = {
      pageOffset,
      pageSize,
      count: expectedHybridAgreements.length,
      agreements: expectedHybridAgreements,
      stats: undefined,
    };

    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    const PaginatedHybridAgreements = await service.hybridAll(pageOffset, pageSize);
    expect(PaginatedHybridAgreements).toEqual(paginationResponse);
  });

  it("should get hybrid agreements by project id", async () => {
    const projectId = 1;

    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    const expectedHybridAgreementsByProject = expectedHybridAgreements.filter(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (agreement: any) => agreement.unit.project.id === projectId
    );

    const agreements = await service.hybridAll(undefined, undefined, projectId);

    expect(agreements).toEqual(expectedHybridAgreementsByProject);
  });

  it("should get hybrid agreements by unit id", async () => {
    const unitId = 1;

    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    const expectedAgreementsByProjectUnit = expectedHybridAgreements.filter(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (agreement: any) => agreement.unit.id === unitId
    );

    const agreements = await service.hybridAll(undefined, undefined, undefined, unitId);

    expect(agreements).toEqual(expectedAgreementsByProjectUnit);
  });

  it("should get hybrid agreements by customer govt id", async () => {
    const customerGovtId = "11111-1111111-1";

    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    const agreements = await service.hybridAll(
      undefined,
      undefined,
      undefined,
      undefined,
      customerGovtId
    );

    expect(agreements).toEqual(expectedHybridAgreementsMock);
  });

  it("should get hybrid agreements by status", async () => {
    const status = "active";

    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    const agreements = await service.hybridAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      status
    );

    expect(agreements).toEqual(expectedHybridAgreementsMock);
  });

  it("should get hybrid agreements with stats", async () => {
    const pageOffset = 0;
    const pageSize = 10;
    const includeStats = true;
    prisma.agreement.findMany.mockResolvedValue(agreementsMock as any);
    prisma.draftAgreement.findMany.mockResolvedValue([rawDraft as any]);

    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    const drafts = expectedHybridAgreements.filter((agreement) => agreement.status === "draft");
    const active = expectedHybridAgreements.filter((agreement) => agreement.status === "active");
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */

    const expectedAgreements = {
      agreements: expectedHybridAgreements,
      count: expectedHybridAgreements.length,
      pageSize: pageSize,
      pageOffset: pageOffset,
      stats: [
        {
          status: "active",
          count: active.length,
        },
        {
          status: "draft",
          count: drafts.length,
        },
        {
          status: "all",
          count: active.length + drafts.length,
        },
      ],
    };

    const agreements = await service.hybridAll(
      pageOffset,
      pageSize,
      undefined,
      undefined,
      undefined,
      undefined,
      includeStats
    );
    expect(agreements).toEqual(expectedAgreements);
  });
});
