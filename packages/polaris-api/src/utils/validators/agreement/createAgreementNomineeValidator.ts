import { body, check, ValidationChain } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createAgreementNomineeValidator = validate([
  body("nominees", "Nominee data is Required.").exists().isArray({ min: 1 }),
  ...[
    check("nominees.*.govtId"),
    check("nominees.*.govtIdType"),
    check("nominees.*.nomineeFor"),
    check("nominees.*.fullName"),
    check("nominees.*.contactNumber"),
    check("nominees.*.email").isEmail(),
    check("nominees.*.relationship"),
    check("nominees.*.nomineeAttachments.*.fileName"),
    check("nominees.*.nomineeAttachments.*.type"),
  ].map((x) => x.exists().isString().trim().customSanitizer(removeConsecutiveSpaces)),
]);
