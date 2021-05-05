import { AgreementService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";

export const getDetails = [
  async (request: Request, response: Response): Promise<void> => {
    const service = request.injector.get(AgreementService);
    const agreementId = Number(request.params.id);

    const data = await service.getAgreementdetail(agreementId);

    response.status(200);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
