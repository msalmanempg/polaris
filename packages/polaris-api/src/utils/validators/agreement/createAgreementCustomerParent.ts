import { body, check, ValidationChain } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createAgreementCustomerParentValidator = validate([
  body("customers", "Customer Information is Required").exists().isArray({ min: 1 }),
  ...[
    check("customers.*.fullName"),
    check("customers.*.govtId"),
    check("customers.*.govtIdType"),
    check("customers.*.relationType"),
    check("customers.*.guardianName"),
    check("customers.*.nationality"),
    check("customers.*.passportNumber").optional(),
    check("customers.*.dateOfBirth"),
    check("customers.*.gender"),
    check("customers.*.customerAttachments.*.fileName"),
    check("customers.*.customerAttachments.*.type"),
  ].map((x) => x.exists().isString().trim().customSanitizer(removeConsecutiveSpaces)),
]);

export const createAgreementCustomerValidator = validate([
  body("agreementId").exists().isInt().toInt(),
  body("agreementCustomers", "Customer Information is Required").exists().isArray({ min: 1 }),
  ...[
    check("agreementCustomers.*.type"),
    check("agreementCustomers.*.address"),
    check("agreementCustomers.*.email").isEmail(),
    check("agreementCustomers.*.primaryPhoneNumber"),
    check("agreementCustomers.*.secondaryPhoneNumber").optional(),
  ].map((x) => x.exists().isString().trim().customSanitizer(removeConsecutiveSpaces)),
  check("agreementCustomers.*.customerId").exists().isInt().toInt(),
]);
