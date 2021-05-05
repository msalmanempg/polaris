import { DraftAgreementService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";

export const getDraftDetails = [
  async (request: Request, response: Response): Promise<void> => {
    const service = request.injector.get(DraftAgreementService);
    const draftId = Number(request.params.id);
    const data = await service.getDetails(draftId);

    response.status(200);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
