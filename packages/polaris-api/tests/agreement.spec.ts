import {
  Agreement,
  AgreementCustomer,
  Customer,
  prisma,
  Prisma,
  Project,
  Unit,
} from "@polaris/prisma";

import {
  agreementCustomers,
  agreementProject,
  agreements,
  agreementUnit,
  customers,
  projects,
  rawAgreement,
  rawCustomers,
  rawNominees,
  rawSalesPersons,
  units,
} from "./support/fixtures/agreements";
import { testExpressApp } from "./support/requestFactory";

describe("agreements", () => {
  let createdProject: Project;
  let createdUnits: Unit[];
  let createdCustomers: Customer[];
  let createdAgreements: Agreement[];
  let createdAgreementCustomers: AgreementCustomer[];

  beforeEach(async () => {
    const [project] = projects;

    createdProject = await prisma.project.create({
      data: {
        ...(project as any),
      },
    });

    createdUnits = await Promise.all(
      units.map((unit) => {
        const unitData = {
          ...unit,
          unitNumber: `${createdProject.name} - ${unit.unitNumber as string}`,
          Project: {
            connect: {
              id: createdProject.id,
            },
          },
        } as any;

        return prisma.unit.create({ data: unitData });
      })
    );

    createdCustomers = await Promise.all(
      customers.map((customer) => {
        return prisma.customer.create({
          data: customer as any,
        });
      })
    );

    createdAgreements = await Promise.all(
      agreements.map((agreement, index) => {
        const agreementData: Prisma.AgreementCreateInput = {
          ...agreement,
          Unit: {
            connect: {
              id: createdUnits[index].id,
            },
          },
        } as any;

        return prisma.agreement.create({ data: agreementData });
      })
    );

    const [createdAgreement] = createdAgreements;

    createdAgreementCustomers = await Promise.all(
      agreementCustomers.slice(0, 2).map((agreementCustomer, index) => {
        const agreementCustomerData: Prisma.AgreementCustomerCreateInput = {
          ...agreementCustomer,
          Customer: {
            connect: {
              id: createdCustomers[index].id,
            },
          },
          Agreement: {
            connect: {
              id: createdAgreement.id,
            },
          },
        } as any;

        return prisma.agreementCustomer.create({ data: agreementCustomerData });
      })
    );
  });

  afterEach(async () => {
    const deleteAgreementCustomer = prisma.agreementCustomer.deleteMany({
      where: {
        id: {
          in: createdAgreementCustomers.map((agreementCustomer) => agreementCustomer.id),
        },
      },
    });

    const deleteCustomer = prisma.customer.deleteMany({
      where: {
        id: {
          in: createdCustomers.map((customer) => customer.id),
        },
      },
    });

    const deleteAgreement = prisma.agreement.deleteMany({
      where: {
        id: {
          in: createdAgreements.map((agreement) => agreement.id),
        },
      },
    });

    const deleteUnit = prisma.unit.deleteMany({
      where: {
        projectId: {
          in: createdProject.id,
        },
      },
    });

    const deleteProject = prisma.project.deleteMany({
      where: {
        id: {
          equals: createdProject.id,
        },
      },
    });

    await prisma.$transaction([
      deleteAgreementCustomer,
      deleteCustomer,
      deleteAgreement,
      deleteUnit,
      deleteProject,
    ]);
  });

  [
    {
      description: "with no filter",
      parameters: {
        pageOffset: 0,
        pageSize: 10,
      },
    },
    {
      description: "with status",
      parameters: {
        pageOffset: 0,
        pageSize: 10,
        status: "active",
      },
    },
  ].map(({ description, parameters }) => {
    it(`Should list all agreements ${description}`, async () => {
      await listAllAgreements(parameters);
    });
  });

  it("Should list all agreements for a project id", async () => {
    const parameters = {
      pageOffset: 0,
      pageSize: 10,
      projectId: createdProject.id,
    };

    await listAllAgreements(parameters);
  });

  it("Should list all agreements with stats", async () => {
    const parameters = {
      pageOffset: 0,
      pageSize: 10,
      includeStats: true,
    };

    const { body } = await testExpressApp().get("/api/agreement").query(parameters).expect(200);

    body.stats.sort((a: { status: string; count: number }, b: { status: string; count: number }) =>
      a.status.localeCompare(b.status)
    );

    expect(body).toMatchSnapshot({
      agreements: expect.any(Array),
      count: expect.any(Number),
    });
  });

  it("Should list all agreements for customer govt id", async () => {
    const parameters = {
      pageOffset: 0,
      pageSize: 10,
      customerGovtId: createdCustomers[0].govtId,
    };

    await listAllAgreements(parameters);
  });

  it("Should create new agreement", async () => {
    const project = await prisma.project.create({
      data: {
        ...(agreementProject as any),
        units: {
          createMany: {
            data: [agreementUnit],
          },
        },
      },
    });
    const rawUnit = await prisma.unit.findFirst({ where: { projectId: project.id } });
    const agreementData = {
      ...rawAgreement,
      unitId: rawUnit?.id,
      customers: rawCustomers,
      nominees: rawNominees,
      salesPerson: rawSalesPersons,
    };

    const { body } = await testExpressApp()
      .post("/api/agreement/add")
      .send(agreementData)
      .expect(201);
    expect(body).toMatchSnapshot(agreementSnapshotMatch(body));
  });

  it("should check availability of an agreement number", async () => {
    const agreementNumber = "XYZ0123456789";

    const { body } = await testExpressApp()
      .get(`/api/agreement/check_agreement_number/${agreementNumber}`)
      .expect(200);
    expect(body).toEqual(true);
    expect(body).toMatchSnapshot();
  });

  it("Should fecth details of an agreement", async () => {
    const agreement = await prisma.agreement.findFirst({
      where: { agreementNumber: agreements[0].agreementNumber },
    });

    const { body } = await testExpressApp().get(
      `/api/agreement/detail/${agreement ? agreement.id : 0}`
    );
    expect(body).toMatchSnapshot(agreementSnapshotMatch(body));
  });
});

const listAllAgreements = async (parameters: any) => {
  const { body } = await testExpressApp().get("/api/agreement/all").query(parameters).expect(200);

  expect(body).toMatchSnapshot({
    agreements: expect.any(Array),
  });

  const agreements = body.agreements.sort((a: { id: number }, b: { id: number }) => a.id < b.id);
  matchAgreements(agreements);
};

const matchAgreements = (agreements: any) => {
  agreements.map((agreement: any) => {
    expect(agreement).toMatchSnapshot({
      ...agreement,
      id: expect.any(Number),
      unit: {
        id: expect.any(Number),
        project: {
          id: expect.any(Number),
        },
      },
      customer: expect.any(Object),
    });
  });
};

const agreementSnapshotMatch = (body: any) => {
  return {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    unitId: expect.any(Number),
    Unit: {
      ...body.Unit,
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      projectId: expect.any(Number),
    },
    customers: body.customers.map(
      (customer: any) =>
        ({
          ...customer,
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          agreementId: expect.any(Number),
          customerId: expect.any(Number),
        } as unknown)
    ),
    nominees: body.nominees.map(
      (nominee: any) =>
        ({
          ...nominee,
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          agreementId: expect.any(Number),
        } as unknown)
    ),
    salesPerson: body.salesPerson.map(
      (salePerson: any) =>
        ({
          ...salePerson,
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          agreementId: expect.any(Number),
        } as unknown)
    ),
  };
};
