import { DraftAgreement, DraftAgreementService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { createDraftAgreementValidator } from "polaris-api/utils/validators";

export const createDraftAgreement = [
  createDraftAgreementValidator,
  async (request: Request, response: Response): Promise<void> => {
    const service = request.injector.get(DraftAgreementService);
    const requestData = matchedData(request, { includeOptionals: true }) as DraftAgreement;

    const data = await service.create(requestData);

    response.status(201);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
