import { CustomerAttachment, Prisma, PrismaClient } from "@polaris/prisma";
import { Injectable } from "injection-js";
import { AttachmentDTO } from "../common";
import { Customer } from "./types";

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Returns all customers
   * @returns { Promise<Customer[]> } Promise containing an array of all customers.
   */
  public async all(): Promise<Customer[]> {
    return await this.prisma.customer.findMany({ orderBy: { fullName: "asc" } });
  }

  /**
   * Creates a new customer
   * @param { Customer } customer customer data
   * @returns { Promise<Customer> } Promise containing newly created customer object.
   */
  public async create(customer: Customer): Promise<Customer> {
    const customerData: Prisma.CustomerCreateInput = { ...customer };
    return await this.prisma.customer.create({ data: customerData });
  }

  /**
   * Updates an existing custoemr
   * @param { Customer } customer customer data
   * @param { number } customerId customer id
   * @returns { Promise<Customer> } Promise containing updated customer object.
   */
  public async update(customer: Customer, customerId: number): Promise<Customer> {
    const customerData: Prisma.CustomerCreateInput = { ...customer };
    return await this.prisma.customer.update({ where: { id: customerId }, data: customerData });
  }

  /**
   * Deletes an existing customer
   * @param { number } customerId customer id
   * @returns { Promise<Customer | void> } Promise containing deleted customer object.
   */
  public async delete(customerId: number): Promise<Customer | void> {
    return await this.prisma.customer.delete({ where: { id: customerId } });
  }

  /**
   * Create Multiple Users
   * @param { Customer[] } customers Array of customers data
   * @return { Promise<Customer[]> } Promise containing list of newly created or existing customers
   */
  public async createMany(customers: Customer[]): Promise<Customer[]> {
    const allCustomers = [];
    for (const customer of customers) {
      allCustomers.push(
        this.prisma.customer.upsert({
          where: {
            Customer_govtId_govtIdType_unique_constraint: {
              govtIdType: customer.govtIdType,
              govtId: customer.govtId,
            },
          },
          update: { ...customer, id: undefined },
          create: { ...customer, id: undefined },
        })
      );
    }
    return this.prisma.$transaction(allCustomers);
  }

  /**
   * Create or update a customer
   * @param { Customer } customerData customer data
   * @return { Promise<Customer> } Promise containing newly created or updated customer
   */
  public async upsert(customer: Customer): Promise<Customer> {
    return this.prisma.customer.upsert({
      where: {
        Customer_govtId_govtIdType_unique_constraint: {
          govtIdType: customer.govtIdType,
          govtId: customer.govtId,
        },
      },
      update: { ...customer, id: undefined },
      create: { ...customer, id: undefined },
    });
  }

  /**
   * Save customers' attachments
   * @param { number } customerId customer Id
   * @param { number } agreementId agreement Id
   * @param { Attachment } attachment customer attachment
   * @return { Promise<CustomerAttachment> } Promise containing a CustomerAttachment
   */
  public async saveAttachment(
    customerId: number,
    attachment: AttachmentDTO
  ): Promise<CustomerAttachment> {
    return this.prisma.customerAttachment.create({
      data: {
        Customer: {
          connect: {
            id: customerId,
          },
        },
        Attachment: {
          create: {
            name: attachment.fileName,
            key: attachment.key as string,
          },
        },
      },
    });
  }
}
