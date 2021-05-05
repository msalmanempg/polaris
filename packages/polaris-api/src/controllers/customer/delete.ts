import { CustomerService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";

export const deleteCustomer = [
  async (request: Request, response: Response): Promise<void> => {
    const customerId: number | undefined = request.params.id
      ? Number(request.params.id)
      : undefined;
    const service = request.injector.get(CustomerService);
    const data = customerId ? await service.delete(customerId) : undefined;

    response.status(204);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
