import { prisma, Project, Unit } from "@polaris/prisma";
import { projects, units } from "./support/fixtures/units";
import { draftAgreements } from "./support/fixtures/draft.agreements";
import { testExpressApp } from "./support/requestFactory";

describe("draftAgreements", () => {
  let createdProject: Project;
  let createdUnits: Unit[];
  beforeEach(async () => {
    const [project] = projects;

    createdProject = await prisma.project.create({
      data: {
        ...(project as any),
      },
    });

    createdUnits = await Promise.all(
      units.map((unit: any) => {
        return prisma.unit.upsert({
          where: { unitNumber: unit.unitNumber },
          update: { ...unit, id: undefined, projectId: createdProject.id },
          create: { ...unit, id: undefined, projectId: createdProject.id, status: "available" },
        });
      })
    );

    await Promise.all(
      draftAgreements.map((draft) => {
        const data = {
          ...draft,
          Unit: { connect: { id: createdUnits[0].id } },
          unitId: undefined,
        } as any;
        return prisma.draftAgreement.create({ data: data });
      })
    );
  });

  afterEach(async () => {
    await prisma.draftAgreement.deleteMany({});
    await prisma.unit.deleteMany({
      where: {
        projectId: {
          in: createdProject.id,
        },
      },
    });
    await prisma.project.deleteMany({ where: { id: createdProject.id } });
  });

  it("Should create a new agreement draft", async () => {
    const rawDraft = { agreementNumber: "ABC1236", unitId: createdUnits[0].id, data: {} };

    const { body } = await testExpressApp().post("/api/agreement/draft").send(rawDraft).expect(201);

    expect(body).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      unitId: expect.any(Number),
    });
  });

  it("Should get draft agreement details", async () => {
    const draft = await prisma.draftAgreement.findUnique({
      where: { agreementNumber: draftAgreements[0].agreementNumber },
    });

    const { body } = await testExpressApp()
      .get(`/api/agreement/draft/detail/${draft ? draft.id : 0}`)
      .expect(200);
    expect(body).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      unitId: expect.any(Number),
    });
  });
});
