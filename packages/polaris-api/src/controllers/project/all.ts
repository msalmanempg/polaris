import { Request, RequestHandler, Response } from "express";
import { ProjectService } from "@polaris/domain";

export const allProjects = [
  async (request: Request, response: Response) => {
    const pageOffset: number | undefined = request.query.pageOffset
      ? Number.parseInt(request.query.pageOffset.toString())
      : undefined;
    const pageSize: number | undefined = request.query.pageSize
      ? Number.parseInt(request.query.pageSize.toString())
      : undefined;
    const service = request.injector.get(ProjectService);
    const data = await service.all(pageOffset, pageSize);

    response.status(200);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
