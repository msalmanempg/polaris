import { CustomerService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";

export const allCustomers = [
  async (request: Request, response: Response): Promise<void> => {
    const service = request.injector.get(CustomerService);
    const data = await service.all();

    response.status(200);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
