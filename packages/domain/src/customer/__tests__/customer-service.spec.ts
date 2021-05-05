import { Customer, PrismaClient } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { CustomerService } from "..";

describe("CustomerService", () => {
  let injector: ReflectiveInjector;
  let service: CustomerService;
  let prisma: MockProxy<PrismaClient>;

  const customersMock: Customer[] = [
    {
      id: 1,
      fullName: "Test Customer",
      govtId: "11111-1111111-1",
      govtIdType: "cnic",
      relationType: "father",
      guardianName: "Test Customer Guardian",
      nationality: "Pakistani",
      passportNumber: "11111-1111111-1",
      dateOfBirth: new Date(),
      gender: "male",
      meta: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      CustomerService,
      {
        provide: PrismaClient,
        useValue: mockDeep<PrismaClient>(),
      },
    ]);
    service = injector.get(CustomerService) as CustomerService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(CustomerService);
  });

  it("should create customer", async () => {
    const customerMock: Customer = customersMock[0];

    prisma.customer.create.mockResolvedValue(customerMock);

    const customer = await service.create(customerMock);
    expect(customer).toEqual(customerMock);
  });

  it("should get customers", async () => {
    prisma.customer.findMany.mockResolvedValue(customersMock);

    const customers = await service.all();
    expect(customers).toEqual(customersMock);
  });

  it("should update customers", async () => {
    const customerMock: Customer = customersMock[0];
    prisma.customer.update.mockResolvedValue(customerMock);

    const updatedCustomer = await service.update(customerMock, customerMock.id);
    expect(updatedCustomer).toEqual(customerMock);
  });

  it("should delete customers", async () => {
    const customerMock: Customer = customersMock[0];
    prisma.customer.delete.mockResolvedValue(customerMock);

    const deletedCustomer = await service.delete(customerMock.id);
    expect(deletedCustomer).toEqual(customerMock);
  });

  it("should create many customers", async () => {
    prisma.$transaction.mockResolvedValue(customersMock);

    const customers = await service.createMany(customersMock);
    expect(customers).toMatchObject({});
  });

  it("should upsert a customer", async () => {
    prisma.customer.upsert.mockResolvedValue(customersMock[0]);

    const customer = await service.upsert(customersMock[0]);
    expect(customer).toEqual(customersMock[0]);
  });

  it("should save attachment", async () => {
    const customerAttachment = {
      fileName: "customer-attachment.png",
      type: "id_front",
      key: "key",
    };

    const customerAttachmentsMock = {
      id: 1,
      customerId: 1,
      attachmentId: 1,
      type: "id_front",
      createdAt: new Date("2021-04-08T10:22:23.317Z"),
      updatedAt: new Date("2021-04-08T10:22:23.318Z"),
    };

    prisma.customerAttachment.create.mockResolvedValue(customerAttachmentsMock);

    const customerId = 1;

    const savedAttachment = await service.saveAttachment(customerId, customerAttachment);
    expect(savedAttachment).toEqual(customerAttachmentsMock);
  });
});
