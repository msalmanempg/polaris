import { body, check } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createAgreementCompanyValidator = validate([
  body("company", "Company information is Required.")
    .if(check("customers.*.type").equals("company"))
    .exists(),
  body("customers", "Company Representator information Required.").isArray({ min: 1 }),
  check("company.id").if(body("company").exists()).optional().toInt(),
  ...[
    check("company.name"),
    check("company.ntn"),
    check("company.registrationNumber"),
    check("company.address"),
    check("company.city"),
    check("company.contactNumber"),
  ].map((x) =>
    x
      .if(body("company").exists())
      .exists()
      .isString()
      .trim()
      .customSanitizer(removeConsecutiveSpaces)
  ),
  check("company.email").if(body("company").exists()).isEmail(),
]);
