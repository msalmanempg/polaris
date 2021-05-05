import { Project, ProjectBankDetail, ProjectService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { createProjectValidator } from "polaris-api/utils/validators";

export const createProject = [
  createProjectValidator,
  async (request: Request, response: Response): Promise<void> => {
    const projectService: ProjectService = request.injector.get(ProjectService);
    const requestData = matchedData(request, { includeOptionals: true }) as Project;
    const bankDetails = request.body.bankDetails
      ? (isJSON(request.body.bankDetails) as ProjectBankDetail[])
      : [];
    const data = await projectService.create(requestData, bankDetails);
    response.status(201);
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
