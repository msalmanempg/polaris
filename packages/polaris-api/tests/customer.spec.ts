import { Customer, prisma } from "@polaris/prisma";
import { customers } from "./support/fixtures/customers";
import { testExpressApp } from "./support/requestFactory";

describe("customers", () => {
  let createdCustomers: Customer[];

  beforeEach(async () => {
    createdCustomers = await Promise.all(
      customers.map((customer) => {
        return prisma.customer.create({
          data: customer as any,
        });
      })
    );
  });

  afterEach(async () => {
    await prisma.agreementCustomer.deleteMany({});
    await prisma.customer.deleteMany({
      where: {
        id: {
          in: createdCustomers.map((customer) => customer.id),
        },
      },
    });
  });

  it("Should create a new Customer", async () => {
    const customer = {
      fullName: "Test Customer",
      govtId: "88888-8888888-8",
      govtIdType: "cnic",
      relationType: "father",
      guardianName: "Test Customer Guardian",
      nationality: "Pakistani",
      passportNumber: "11111-1111111-1",
      dateOfBirth: "2021-02-19T05:20:01.269Z",
      gender: "male",
      meta: {},
    };

    const { body } = await testExpressApp().post("/api/customer/add").send(customer).expect(201);

    expect(body).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("Should List all Customers", async () => {
    const params = {
      pageOffset: 0,
      pageSize: 10,
    };

    const { body } = await testExpressApp().get("/api/customer/").query(params).expect(200);

    const createdCustomersIds = new Set(createdCustomers.map((customer) => customer.id));
    const customers = body
      .filter((customer: any) => createdCustomersIds.has(customer.id))
      .sort((a: { govtId: string }, b: { govtId: string }) => a.govtId.localeCompare(b.govtId));

    customers.map((customer: any) => {
      expect(customer).toMatchSnapshot({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  it("Should update existing Customer", async () => {
    const existingCustomer = createdCustomers[0];

    const customer = {
      fullName: "Test Customer",
      govtId: "99999-9999999-9",
      govtIdType: "cnic",
      relationType: "father",
      guardianName: "Test Customer Guardian",
      nationality: "Pakistani",
      passportNumber: "11111-1111111-1",
      dateOfBirth: "2021-02-19T05:20:01.269Z",
      gender: "male",
      meta: {},
    };

    await testExpressApp()
      .put(`/api/customer/update/${existingCustomer.id}`)
      .send(customer)
      .expect(204);
  });

  it("Should delete existing Customer", async () => {
    const existingCustomer = createdCustomers[0];

    await testExpressApp().delete(`/api/customer/delete/${existingCustomer.id}`).expect(204);
  });
});
