import { PrismaClient, Unit, unitStatus } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { ImportUnit, UnitService } from "..";

describe("UnitService", () => {
  let injector: ReflectiveInjector;
  let service: UnitService;
  let prisma: MockProxy<PrismaClient>;

  const unitsMock: Unit[] = [
    {
      id: 1,
      unitNumber: "unit-123",
      location: "Block A, Street 5",
      type: "residential",
      bed: 3,
      basePrice: 5000000,
      publishedPrice: 5500000,
      netArea: 1250,
      grossArea: 1250,
      status: "available",
      projectId: 1,
      meta: {},
      completionDate: new Date("2021-02-19T05:20:07.269Z"),
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-19T05:20:07.269Z"),
    },
    {
      id: 2,
      unitNumber: "unit-456",
      location: "Block B, Street 6",
      type: "commercial",
      bed: 0,
      basePrice: 5000000,
      publishedPrice: 5500000,
      netArea: 1250,
      grossArea: 1250,
      status: "sold",
      projectId: 2,
      meta: {},
      completionDate: new Date("2021-02-19T05:20:07.269Z"),
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-19T05:20:07.269Z"),
    },
  ];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      UnitService,
      {
        provide: PrismaClient,
        useValue: mockDeep<PrismaClient>(),
      },
    ]);
    service = injector.get(UnitService) as UnitService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(UnitService);
  });

  it("should create unit", async () => {
    const unitMock: Unit = unitsMock[0];

    prisma.unit.create.mockResolvedValue(unitMock);

    const unit = await service.create(unitMock);

    expect(unit).toEqual(unitMock);
  });

  it("should get units", async () => {
    prisma.unit.findMany.mockResolvedValue(unitsMock);

    const units = await service.all(undefined, undefined, 1, unitStatus.available);
    expect(units).toEqual(unitsMock);
  });

  it("should get units with pagination", async () => {
    const pageOffset = 0;

    const pageSize = 10;

    const paginationResponse = {
      pageOffset,
      pageSize,
      count: unitsMock.length,
      results: unitsMock,
    };

    prisma.unit.findMany.mockResolvedValue(unitsMock);
    prisma.unit.count.mockResolvedValue(unitsMock.length);

    const units = await service.all(pageOffset, pageSize, 1, unitStatus.available);
    expect(units).toEqual(paginationResponse);
  });

  it("should update unit", async () => {
    const unitMock: Unit = unitsMock[0];
    prisma.unit.update.mockResolvedValue(unitMock);

    const updatedUnit = await service.update(unitMock, unitMock.id);
    expect(updatedUnit).toEqual(unitMock);
  });

  it("should delete unit", async () => {
    const unitMock: Unit = unitsMock[0];
    prisma.unit.delete.mockResolvedValue(unitMock);

    const deletedUnit = await service.delete(unitMock.id);
    expect(deletedUnit).toEqual(unitMock);
  });

  it("should get unit details", async () => {
    const unitMock: Unit = unitsMock[0];
    prisma.unit.findUnique.mockResolvedValue(unitMock);

    const updatedUnit = await service.getUnitDetail(unitMock.id);
    expect(updatedUnit).toEqual(unitMock);
  });

  it("Should import units", async () => {
    const importMock: ImportUnit = { units: unitsMock, projectId: 1 };
    const importedUnits = await service.import(importMock);
    // TODO: Since Prisma didn't ignite any transaction this alway return undefined, should be a better way to test this.
    expect(importedUnits).toEqual(undefined);
  });

  it("Should return all units of Project", async () => {
    prisma.unit.findMany.mockResolvedValue(unitsMock);
    const projectId = unitsMock[0].projectId;
    const projectUnits = await service.projectUnits(projectId);
    expect(projectUnits).toEqual(unitsMock);
  });

  it("should get units by project id", async () => {
    const projectId = 2;

    prisma.unit.findMany.mockResolvedValue(
      unitsMock.filter((unit) => unit.projectId === projectId)
    );

    const expectedUnits = unitsMock.filter((unit) => unit.projectId === projectId);

    const units = await service.all(undefined, undefined, projectId);

    expect(units).toEqual(expectedUnits);
  });

  it("should get units by status", async () => {
    const status = unitStatus.available;

    prisma.unit.findMany.mockResolvedValue(unitsMock.filter((unit) => unit.status === status));

    const expectedUnits = unitsMock.filter((unit) => unit.status === status);

    const units = await service.all(undefined, undefined, undefined, status);

    expect(units).toEqual(expectedUnits);
  });

  it("should get units status count", async () => {
    const groupByMock = jest.spyOn(prisma.unit, "groupBy");
    groupByMock.mockResolvedValue([
      { status: unitStatus.available, count: 1 },
      { status: unitStatus.booked, count: 1 },
      { status: unitStatus.sold, count: 1 },
    ] as any);

    const unitsStatusCount = await service.getUnitsStats(1);

    expect(unitsStatusCount).toEqual([
      { status: unitStatus.available, count: 1 },
      { status: unitStatus.booked, count: 1 },
      { status: unitStatus.sold, count: 1 },
      { status: "all", count: 3 },
    ]);
  });
});
