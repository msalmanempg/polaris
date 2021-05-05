import { ProjectService, UnitService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { exportExcelFile } from "polaris-api/utils";
import { ExcelColumn } from "polaris-api/types/excelColumn";

export const exportUnits = [
  async (request: Request, response: Response) => {
    const projectId: number = request.params.id ? Number(request.params.id) : 0;
    const projectService: ProjectService = request.injector.get(ProjectService);

    const project = await projectService.getProjectDetail(projectId);
    const meta = project?.meta ? project.meta : {};

    const unitService: UnitService = request.injector.get(UnitService);
    const data = projectId ? await unitService.projectUnits(projectId) : undefined;

    /* eslint-disable unicorn/no-array-reduce */
    const recentlyUpdatedUnit = data
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        data.reduce((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b))
      : undefined;
    /* eslint-enable unicorn/no-array-reduce */

    let filePath;
    const inventory = meta.hasOwnProperty("inventory")
      ? meta.inventory
      : { path: undefined, createdAt: undefined };
    /**
     * Creating file only if inventory file of project doesn't exist.
     * OR
     * Inventory Updation Date is greater then file creation date.
     * Which means some updation over invesntory was done which is not reflected in old file,
     * Hence create new.
     */
    if (project && inventory.path && recentlyUpdatedUnit) {
      filePath =
        new Date(recentlyUpdatedUnit.updatedAt) > new Date(inventory.createdAt)
          ? (await fileCreation(data, projectId, project, projectService)).Location
          : inventory.path;
    } else {
      filePath = (await fileCreation(data, projectId, project, projectService)).Location;
    }

    response.status(200);
    response.json(filePath);
    response.end();
  },
] as RequestHandler[];

const fileCreation = async (
  data: any,
  projectId: number,
  project: any,
  projectService: ProjectService
): Promise<any> => {
  const headers: ExcelColumn[] = [
    { header: "ID", key: "id" },
    { header: "Unit No.", key: "unitNumber" },
    { header: "Type", key: "type" },
    { header: "Net Area (Sq. Feet)", key: "netArea" },
    { header: "Gross Area (Sq. Feet)", key: "grossArea" },
    { header: "Base Price", key: "basePrice" },
    { header: "Published Price", key: "publishedPrice" },
    { header: "Bed", key: "bed" },
    { header: "Location", key: "location" },
    { header: "Completion Date", key: "completionDate", width: 15 },
  ];

  const filePath = await exportExcelFile(headers, data);
  const inventory = { path: filePath.Location, createdAt: new Date() };
  project.meta = { ...project.meta, inventory: inventory };
  // We don't need to send bank details while updating project meta, nested relation would cause prisma to invoke an error
  project.bankDetails = [];
  await projectService.update(project, projectId);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return filePath;
};
