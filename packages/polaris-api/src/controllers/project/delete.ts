import { ProjectService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";

export const deleteProject = [
  async (request: Request, response: Response): Promise<void> => {
    const projectId: number | undefined = request.params.id ? Number(request.params.id) : undefined;
    const projectService: ProjectService = request.injector.get(ProjectService);

    const data = projectId ? await projectService.delete(projectId) : undefined;

    response.status(204);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
