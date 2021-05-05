import { prisma, Project, ProjectBankDetail } from "@polaris/prisma";
import { projectBankDetails, projects } from "./support/fixtures/projects";
import { testExpressApp } from "./support/requestFactory";

describe("projects", () => {
  let createdProjects: Project[];

  beforeEach(async () => {
    const projectsData = projects.map((project, index) => ({
      ...project,
      bankDetails: {
        create: [projectBankDetails[index]],
      },
    }));

    createdProjects = await Promise.all(
      projectsData.map((project) =>
        prisma.project.create({
          data: project as any,
        })
      )
    );
  });

  afterEach(async () => {
    await prisma.projectBankDetail.deleteMany({
      where: {
        projectId: {
          in: createdProjects.map((project) => project.id),
        },
      },
    });

    await prisma.project.deleteMany({
      where: {
        id: {
          in: createdProjects.map((project) => project.id),
        },
      },
    });
  });

  it("Should list all projects", async () => {
    const params = {
      pageOffset: 0,
      pageSize: 10,
    };
    const { body } = await testExpressApp().get("/api/project").query(params).expect(200);
    expect(body).toMatchSnapshot({
      count: expect.any(Number),
      pageOffset: expect.any(Number),
      pageSize: expect.any(Number),
      results: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          completionDate: expect.any(String),
          bankDetails: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              projectId: expect.any(Number),
            }),
          ]),
        }),
      ]),
    });
  });

  it("Should create a new project", async () => {
    const project = {
      name: "Project 4",
      address: "Cantt",
      city: "Karachi",
      province: "Sindh",
      country: "Pakistan",
      longitude: 4.14678,
      latitude: 2.36745,
      email: "project3@zameen.com",
      phone: "+923007651326",
      url: "https://www.zameendevelopments.com",
      logo:
        "http://gdj.graphicdesignjunction.com/wp-content/uploads/2012/07/business-logo-design-2.jpg",
      completionDate: "2022-02-15T00:03:58.000Z",
      bankDetails: [
        {
          bankName: "United Bank",
          accountTitle: "Project 3 Account",
          accountNumber: "22222222222222",
          iban: "PK067UB22222222222222",
          swiftCode: "0932",
          branchAddress: "mm alam",
          branchCode: "00722",
          createdAt: new Date("2021-02-19T05:20:07.269Z"),
          updatedAt: new Date("2021-02-19T05:20:07.269Z"),
        },
      ],
    };

    const { body } = await testExpressApp().post("/api/project/add").send(project).expect(201);

    expect(body).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      completionDate: expect.any(String),
      bankDetails: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          projectId: expect.any(Number),
        }),
      ]),
    });
  });

  it("Should update existing project", async () => {
    const existingProject = await prisma.project.findFirst({
      where: { name: "Project 3" },
      include: { bankDetails: true },
    });

    const projectId: number = existingProject ? existingProject.id : 0;
    const existingBankDetails: ProjectBankDetail[] = existingProject
      ? existingProject.bankDetails
      : [];

    const project = {
      name: "Project 3",
      address: "Address Updated",
      city: "Karachi",
      province: "Sindh",
      country: "Pakistan",
      longitude: 4.14678,
      latitude: 2.36745,
      email: "project3@zameen.com",
      phone: "+923007651326",
      url: "https://www.zameendevelopments.com",
      logo:
        "http://gdj.graphicdesignjunction.com/wp-content/uploads/2012/07/business-logo-design-2.jpg",
      completionDate: new Date("2021-02-19T05:20:07.269Z"),
      bankDetails: existingBankDetails,
    };

    await testExpressApp().put(`/api/project/update/${projectId}`).send(project).expect(204);
  });

  it("Should delete existing project", async () => {
    const existingProject = await prisma.project.findFirst({
      where: { name: "Project 2" },
    });

    const projectId: number = existingProject ? existingProject.id : 0;

    await testExpressApp().delete(`/api/project/delete/${projectId}`).expect(204);
  });

  it("Should get Project details with id", async () => {
    const existingProject = await prisma.project.findFirst({
      where: { name: "Project 2" },
    });
    const projectId: number = existingProject ? existingProject.id : 0;

    const { body } = await testExpressApp().get(`/api/project/detail/${projectId}`).expect(200);
    expect(body).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      completionDate: expect.any(String),
      bankDetails: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          projectId: expect.any(Number),
        }),
      ]),
    });
  });
});
