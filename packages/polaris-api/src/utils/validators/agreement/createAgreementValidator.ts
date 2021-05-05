import { body, check } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createAgreementValidator = validate([
  body("status", "Agreement Status must not be Draft.").exists().not().equals("draft"),
  ...[body("agreementNumber"), body("status")].map((x) =>
    x.exists().notEmpty().isString().trim().customSanitizer(removeConsecutiveSpaces)
  ),
  ...[
    body("leadId"),
    body("publishedPrice"),
    body("bookingPrice"),
    body("posessionValue"),
    body("unitId"),
  ].map((x) => x.exists().notEmpty().isInt().toInt()),
  ...[
    body("bookingDate"),
    body("notarisedDate"),
    body("agreementDate"),
    body("installmentStartDate"),
    body("installmentEndDate"),
  ].map((x) => x.exists().notEmpty().isISO8601()),
  body("salesPerson", "Sales Person information is Required.").exists().isArray({ min: 1 }),
  check("salesPerson.*.sortLevel").exists().notEmpty().isInt().toInt(),
  ...[
    check("salesPerson.*.designation"),
    check("salesPerson.*.fullName"),
    check("salesPerson.*.govtId"),
    check("salesPerson.*.phoneNumber"),
  ].map((x) => x.exists().notEmpty().isString().trim().customSanitizer(removeConsecutiveSpaces)),
  check("salesPerson.*.email").exists().notEmpty().isEmail(),
  body("discountValue").optional().isInt().toInt(),
]);
