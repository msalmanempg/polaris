import { body } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createCustomerValidator = validate([
  ...[
    body("fullName"),
    body("govtId"),
    body("govtIdType"),
    body("relationType"),
    body("guardianName"),
    body("nationality"),
    body("passportNumber"),
    body("dateOfBirth"),
    body("gender"),
  ].map((x) => x.exists().notEmpty().isString().trim().customSanitizer(removeConsecutiveSpaces)),
]);
