import { PrismaClient, SalePerson } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";

import { SalePersonService } from "..";

describe("SalePersonService", () => {
  let injector: ReflectiveInjector;
  let service: SalePersonService;
  let prisma: MockProxy<PrismaClient>;

  const salePersonMock: SalePerson = {
    id: 1,
    designation: "Manager",
    fullName: "Ali Raza",
    email: "ali.raza@gmail.com",
    govtId: "0000000000000",
    phoneNumber: "03136799098",
    sortLevel: 0,
    agreementId: 1,
    createdAt: new Date("2021-04-08T10:22:23.177Z"),
    updatedAt: new Date("2021-04-08T10:22:23.179Z"),
  };

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      SalePersonService,
      { provide: PrismaClient, useValue: mockDeep<PrismaClient>() },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    service = injector.get(SalePersonService) as SalePersonService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(SalePersonService);
  });

  it("should create a sale person", async () => {
    prisma.salePerson.create.mockResolvedValue(salePersonMock);
    const agreementId = 1;
    const salePerson = await service.create(salePersonMock, agreementId);
    expect(salePerson).toEqual(salePersonMock);
  });
});
