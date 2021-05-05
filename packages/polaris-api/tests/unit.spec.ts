import { prisma, Project, Unit } from "@polaris/prisma";
import path from "path";
import { projects, units } from "./support/fixtures/units";
import { testExpressApp } from "./support/requestFactory";

describe("units", () => {
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
          create: { ...unit, id: undefined, projectId: createdProject.id },
        });
      })
    );
  });

  afterEach(async () => {
    await prisma.unit.deleteMany({
      where: {
        projectId: {
          in: createdProject.id,
        },
      },
    });

    await prisma.project.deleteMany({
      where: {
        id: {
          equals: createdProject.id,
        },
      },
    });
  });

  it("Should list all units", async () => {
    const params = {
      pageOffset: 0,
      pageSize: 10,
    };

    const { body } = await testExpressApp().get("/api/unit/").query(params).expect(200);

    const createdUnitIds = new Set(createdUnits.map((unit) => unit.id));
    const units = body.results
      .filter((unit: any) => createdUnitIds.has(unit.id))
      .sort((a: { unitNumber: string }, b: { unitNumber: string }) =>
        a.unitNumber.localeCompare(b.unitNumber)
      );

    expect(body).toMatchSnapshot({
      count: expect.any(Number),
      results: expect.any(Array),
    });

    matchUnits(units);
  });

  it("Should list and filter units by project id", async () => {
    const params = {
      pageOffset: 0,
      pageSize: 10,
      projectId: createdProject.id,
    };

    const { body } = await testExpressApp().get("/api/unit").query(params).expect(200);

    body.results.map((unit: any) => expect(unit.projectId).toEqual(createdProject.id));
  });

  it("Should list and filter units by status", async () => {
    const params = {
      pageOffset: 0,
      pageSize: 10,
      status: "available",
    };

    const { body } = await testExpressApp().get("/api/unit").query(params).expect(200);

    body.results.map((unit: any) => expect(unit.status).toEqual("available"));
  });

  it("Should list units with stats", async () => {
    const params = {
      pageOffset: 0,
      pageSize: 10,
      includeStats: true,
    };
    const { body } = await testExpressApp().get("/api/unit").query(params).expect(200);

    expect(body.stats).toBeTruthy();
    expect(body.stats).toBeInstanceOf(Array);

    body.stats
      .sort(
        (a: { status: string; count: number }, b: { status: string; count: number }) =>
          a.status < b.status
      )
      .map((unitStat: { status: string; count: number }) =>
        expect(unitStat).toMatchSnapshot(
          {
            count: expect.any(Number),
          },
          `${unitStat.status}`
        )
      );
  });

  it("Should upload units", async () => {
    const { body } = await testExpressApp()
      .post("/api/unit/import")
      .field("projectId", createdProject.id)
      .attach("units", path.join(__dirname, "support/fixtures/sample.xlsx"));
    matchUnits(body);
  });

  it("Should export units of Project", async () => {
    const { body } = await testExpressApp()
      .get(`/api/unit/export/${createdProject.id}`)
      .expect(200);
    expect(body).toMatchSnapshot();
  });
});

const matchUnits = (units: any) => {
  units.map((unit: any) => {
    expect(unit).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      completionDate: expect.any(String),
      projectId: expect.any(Number),
      unitNumber: expect.any(String),
    });
  });
};
