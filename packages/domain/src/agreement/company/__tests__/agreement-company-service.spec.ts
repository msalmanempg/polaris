import { PrismaClient } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { AgreementCompany, AgreementCompanyService } from "..";

describe("AgreementCustomerService", () => {
  let injector: ReflectiveInjector;
  let service: AgreementCompanyService;
  let prisma: MockProxy<PrismaClient>;

  const agreementCompanyMock: AgreementCompany = {
    id: 1,
    name: "Company A",
    ntn: "123456789",
    registrationNumber: "123456789",
    address: "Main Gulberg",
    city: "Lahore",
    email: "company@example.com",
    contactNumber: "03216786543",
  };
  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      AgreementCompanyService,
      { provide: PrismaClient, useValue: mockDeep<PrismaClient>() },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    service = injector.get(AgreementCompanyService) as AgreementCompanyService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(AgreementCompanyService);
  });

  it("should create a company", async () => {
    prisma.agreementCompany.upsert.mockResolvedValue(agreementCompanyMock as any);
    const agreementCustomerId = 1;

    const agreementCompany = await service.create(agreementCompanyMock, agreementCustomerId);
    expect(agreementCompany).toEqual(agreementCompanyMock);
  });
});
