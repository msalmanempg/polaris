import { PrismaClient, Project, ProjectBankDetail } from "@polaris/prisma";
import { ReflectiveInjector } from "injection-js";
import { mockDeep, MockProxy } from "jest-mock-extended";

import { ProjectService } from "..";

describe("ProjectService", () => {
  let injector: ReflectiveInjector;
  let service: ProjectService;
  let prisma: MockProxy<PrismaClient>;

  const projectsMock: Project[] = [
    {
      id: 1,
      name: "project 1",
      address: "Main",
      city: "Lahore",
      province: "Punjab",
      country: "Pakistan",
      longitude: 75.45,
      latitude: 75.45,
      email: "project1@projects.com",
      phone: "+923211234567",
      url: "http://project.url.com",
      completionDate: new Date("2021-02-19T05:20:07.269Z"),
      logo: "http://project.url.com/logo",
      meta: {},
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-19T05:20:07.269Z"),
    },
  ];

  const bankDetailsMock: ProjectBankDetail[] = [
    {
      id: 1,
      bankName: "Allied Bank",
      accountTitle: "Project 1 Account",
      accountNumber: "00000000000000000",
      iban: "PK067AB0000000000000000",
      swiftCode: "0932",
      branchAddress: "mm alam",
      branchCode: "00722",
      projectId: 1,
      meta: {},
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-19T05:20:07.269Z"),
    },
  ];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      ProjectService,
      {
        provide: PrismaClient,
        useValue: mockDeep<PrismaClient>(),
      },
    ]);
    service = injector.get(ProjectService) as ProjectService;
    prisma = injector.get(PrismaClient) as MockProxy<PrismaClient>;
  });

  it("should create a service instance", () => {
    expect(service).toBeInstanceOf(ProjectService);
  });

  it("should create project", async () => {
    const projectMock: Project = projectsMock[0];
    const bankMock: ProjectBankDetail[] = bankDetailsMock;

    prisma.project.create.mockResolvedValue(projectMock);

    const project = await service.create(projectMock, bankMock);

    expect(project).toEqual(projectMock);
  });

  it("should get projects", async () => {
    prisma.project.findMany.mockResolvedValue(projectsMock);

    const projects = await service.all();
    expect(projects).toEqual(projectsMock);
  });

  it("should update project", async () => {
    const projectMock: Project = projectsMock[0];
    prisma.project.update.mockResolvedValue(projectMock);

    const updatedProject = await service.update(projectMock, projectMock.id);
    expect(updatedProject).toEqual(projectMock);
  });

  it("should delete project", async () => {
    const projectMock: Project = projectsMock[0];
    prisma.project.delete.mockResolvedValue(projectMock);

    const deletedProject = await service.delete(projectMock.id);
    expect(deletedProject).toEqual(projectMock);
  });

  it("should get project details", async () => {
    const projectMock: Project = projectsMock[0];
    prisma.project.findUnique.mockResolvedValue(projectMock);

    const updatedProject = await service.getProjectDetail(projectMock.id);
    expect(updatedProject).toEqual(projectMock);
  });

  it("should update project bank details", async () => {
    const bankMock: ProjectBankDetail = bankDetailsMock[0];

    prisma.projectBankDetail.update.mockResolvedValue(bankMock);
    const updatedBank = await service.bankDetailUpdate(bankMock, bankMock.projectId);
    expect(updatedBank).toEqual(bankMock);

    const rawBank = {
      bankName: "Allied Bank",
      accountTitle: "Project 1 Account",
      accountNumber: "00000000000000000",
      iban: "PK067AB0000000000000000",
      swiftCode: "0932",
      branchAddress: "mm alam road",
      branchCode: "00722",
      createdAt: new Date("2021-02-19T05:20:07.269Z"),
      updatedAt: new Date("2021-02-19T05:20:07.269Z"),
    };

    const newBank = await service.bankDetailUpdate(rawBank, 1);
    expect(newBank).toEqual(newBank);
  });
});
