import { CustomerService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { Customer } from "@polaris/domain";
import { createCustomerValidator } from "polaris-api/utils/validators";

export const createCustomer = [
  createCustomerValidator,
  async (request: Request, response: Response): Promise<void> => {
    const service = request.injector.get(CustomerService);
    const requestData = matchedData(request, { includeOptionals: true }) as Customer;
    const data = await service.create(requestData);

    response.status(201);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
