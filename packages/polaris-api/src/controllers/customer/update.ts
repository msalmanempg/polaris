import { CustomerService } from "@polaris/domain";
import { Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { Customer } from "@polaris/domain";
import { createCustomerValidator } from "polaris-api/utils/validators";

export const updateCustomer = [
  createCustomerValidator,
  async (request: Request, response: Response): Promise<void> => {
    const customerId: number | undefined = request.params.id
      ? Number(request.params.id)
      : undefined;
    const service = request.injector.get(CustomerService);
    const requestData = matchedData(request, { includeOptionals: true }) as Customer;
    const data = customerId ? await service.update(requestData, customerId) : undefined;

    response.status(204);
    response.json(data);
    response.end();
  },
] as RequestHandler[];
