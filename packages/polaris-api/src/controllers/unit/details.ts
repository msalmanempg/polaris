import { Request, RequestHandler, Response } from "express";
import { UnitService } from "@polaris/domain";

export const getUnitDetails = [
  async (request: Request, response: Response) => {
    const unitId = Number(request.params.id);
    const service = request.injector.get(UnitService);
    const data = await service.getUnitDetail(unitId);

    response.status(200);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
