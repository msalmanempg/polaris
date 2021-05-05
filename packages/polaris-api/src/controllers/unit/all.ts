import { UnitService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { getUnitsValidator } from "polaris-api/utils/validators/unit/getUnitsValidator";

export const allUnits = [
  getUnitsValidator,
  async (request: Request, response: Response) => {
    const pageOffset: number | undefined = request.query.pageOffset
      ? Number.parseInt(request.query.pageOffset.toString())
      : undefined;
    const pageSize: number | undefined = request.query.pageSize
      ? Number.parseInt(request.query.pageSize.toString())
      : undefined;
    const projectId: number | undefined = request.query.projectId
      ? Number.parseInt(request.query.projectId.toString())
      : undefined;

    const { status, includeStats } = request.query;

    const service = request.injector.get(UnitService);

    const units = await service.all(pageOffset, pageSize, projectId, status);
    const stats = includeStats ? await service.getUnitsStats(projectId) : undefined;
    const result = Array.isArray(units) ? units : { ...units, stats };

    response.status(200);
    response.json(result);

    response.end();
  },
] as RequestHandler[];
