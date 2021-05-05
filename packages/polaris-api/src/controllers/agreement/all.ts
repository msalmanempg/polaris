import { AgreementService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { getAgreementsValidator } from "polaris-api/utils/validators/agreement/getAgreementsValidator";

export const allAgreements = [
  getAgreementsValidator,
  async (request: Request, response: Response) => {
    const pageOffset: number | undefined =
      request.query.pageOffset !== null && request.query.pageOffset !== undefined
        ? Number.parseInt(request.query.pageOffset.toString())
        : undefined;
    const pageSize: number | undefined = request.query.pageSize
      ? Number.parseInt(request.query.pageSize.toString())
      : undefined;
    const projectId: number | undefined = request.query.projectId
      ? Number.parseInt(request.query.projectId.toString())
      : undefined;
    const unitId: number | undefined = request.query.unitId
      ? Number.parseInt(request.query.unitId.toString())
      : undefined;

    const { customerGovtId, status, includeStats } = request.query;

    const service = request.injector.get(AgreementService);

    const agreements = await service.all(
      pageOffset,
      pageSize,
      projectId,
      unitId,
      customerGovtId,
      status
    );

    const stats = includeStats
      ? await service.getAgreementsStats(projectId, unitId, customerGovtId)
      : undefined;

    response.status(200);
    response.json({ ...agreements, stats });
    response.end();
  },
] as RequestHandler[];
