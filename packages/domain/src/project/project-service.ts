import { Prisma, PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { PaginatedProject, Project, ProjectBankDetail } from "./types";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Lists all projects
   * @param { Number } pageOffset page offset
   * @param { Number } pageSize page size
   * @returns { Promise<PaginatedProject | Project[]> } Promise containing list of all projects paginated or not based on query parameters provided.
   */
  async all(pageOffset?: number, pageSize?: number): Promise<Project[] | PaginatedProject> {
    return pageSize
      ? {
          count: await this.prisma.project.count(),
          pageSize: pageSize,
          pageOffset: pageOffset,
          results: await this.prisma.project.findMany({
            skip: pageOffset,
            take: pageSize,
            orderBy: {
              name: "asc",
            },
            include: {
              bankDetails: true,
              units: true,
            },
          }),
        }
      : await this.prisma.project.findMany({ include: { bankDetails: true } });
  }

  /**
   * Get project Details
   * @param { Number } projectId project Id
   * @returns { Promise<Project> } Promise containing project against the projectId provided.
   */
  async getProjectDetail(projectId?: number): Promise<Project | null> {
    return await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { bankDetails: true },
    });
  }

  /**
   * Creates a new project
   * @param { Project } project project data
   * @param { ProjectBankDetail } bankDetails bank data
   * @returns { Promise<Project> } Promise containing newly created project object.
   */
  public async create(project: Project, bankDetails: ProjectBankDetail[] | []): Promise<Project> {
    const projectData: Prisma.ProjectCreateInput = {
      ...project,
      bankDetails: { createMany: { data: bankDetails } },
    };
    return this.prisma.project.create({ data: projectData, include: { bankDetails: true } });
  }

  /**
   * Updates an existing project
   * @param { Project } project project data
   * @param { number } projectId project id
   * @returns { Promise<Project> } Promise containing updated project object.
   */
  public async update(project: Project, projectId: number): Promise<Project> {
    const projectData: Prisma.ProjectUpdateInput = {
      ...project,
      bankDetails: {
        updateMany: project.bankDetails as Prisma.ProjectBankDetailUpdateManyWithWhereWithoutProjectInput[],
      },
    };

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...projectData,
      },
      include: { bankDetails: true },
    });
  }

  public async bankDetailUpdate(
    bankDetail: ProjectBankDetail,
    projectId: number | undefined | null
  ): Promise<ProjectBankDetail | void> {
    if (bankDetail.hasOwnProperty("id")) {
      return this.prisma.projectBankDetail.update({
        where: { id: bankDetail.id },
        data: bankDetail,
      });
    } else {
      const bankData: Prisma.ProjectBankDetailUncheckedCreateInput = {
        ...bankDetail,
        projectId: projectId,
      };
      return this.prisma.projectBankDetail.create({ data: bankData });
    }
  }
  /**
   * Deletes an existing project
   * @param { number } projectId project id
   * @returns { Promise<Project | void> } Promise containing deleted project object.
   */
  public async delete(projectId: number): Promise<Project | void> {
    return this.prisma.project.delete({ where: { id: projectId } });
  }
}
