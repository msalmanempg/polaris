import { AgreementService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";

export const checkAvailability = [
  async (request: Request, response: Response): Promise<void> => {
    const service = request.injector.get(AgreementService);
    const agreementNumber = request.params.agreementNumber;

    const data = await service.validateAgreementNumber(agreementNumber);
    const available = data.count.agreementNumber > 0 ? false : true;
    response.status(200);
    response.json(available);
    response.end();
  },
] as RequestHandler[];
