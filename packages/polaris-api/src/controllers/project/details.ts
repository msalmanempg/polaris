import { Request, RequestHandler, Response } from "express";
import { ProjectService } from "@polaris/domain";

export const getProjectDetails = [
  async (request: Request, response: Response) => {
    const projectId = Number(request.params.id);
    const service = request.injector.get(ProjectService);
    const data = await service.getProjectDetail(projectId);

    response.status(200);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
