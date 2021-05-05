import { Project, ProjectBankDetail, ProjectService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { createProjectValidator } from "polaris-api/utils/validators";

export const updateProject = [
  createProjectValidator,
  async (request: Request, response: Response): Promise<void> => {
    const projectId: number | undefined = request.params.id ? Number(request.params.id) : undefined;
    const projectService: ProjectService = request.injector.get(ProjectService);
    const requestData = matchedData(request, { includeOptionals: true }) as Project;
    const bankDetails = request.body.bankDetails
      ? (isJSON(request.body.bankDetails) as ProjectBankDetail[])
      : [];
    for (const bank of bankDetails) await projectService.bankDetailUpdate(bank, projectId);

    const data = projectId ? await projectService.update(requestData, projectId) : undefined;

    response.status(204);
    response.json(data);
    response.end();
  },
] as RequestHandler[];

const isJSON = (data: any): any => {
  let isParsed: any;

  try {
    isParsed = JSON.parse(data);
  } catch {
    isParsed = data;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return isParsed;
};
