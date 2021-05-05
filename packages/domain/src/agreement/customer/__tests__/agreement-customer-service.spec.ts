import { PrismaClient, AgreementCustomer } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";

import { AgreementCustomerService } from "..";

describe("AgreementCustomerService", () => {
  let injector: ReflectiveInjector;
  let service: AgreementCustomerService;
  let prisma: MockProxy<PrismaClient>;

  const agreementCustomersMock: AgreementCustomer[] = [
    {
      id: 1,
      type: "individual",
      customerId: 1,
      agreementId: 1,
      isPrimary: true,
      // eslint-disable-next-line unicorn/no-null
      meta: null,
      email: "m.ali@gmail.com",
      // eslint-disable-next-line unicorn/no-null
      primaryPhoneNumber: "9230060000000",
      // eslint-disable-next-line unicorn/no-null
      secondaryPhoneNumber: null,
      address: "Some Address",
      createdAt: new Date("2021-04-08T16:18:10.965Z"),
      updatedAt: new Date("2021-04-08T16:18:10.966Z"),
    },
  ];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      AgreementCustomerService,
      { provide: PrismaClient, useValue: mockDeep<PrismaClient>() },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    service = injector.get(AgreementCustomerService) as AgreementCustomerService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(AgreementCustomerService);
  });

  it("should create a nominee", async () => {
    prisma.$transaction.mockResolvedValue(agreementCustomersMock);
    const agreementId = 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const agreementCustomers = await service.createMany(agreementCustomersMock, agreementId);
    expect(agreementCustomers).toEqual(agreementCustomersMock);
  });
});
