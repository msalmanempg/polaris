import { body } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createProjectValidator = validate([
  ...[
    body("name"),
    body("address"),
    body("city"),
    body("province"),
    body("country"),
    body("url"),
    body("bank_details.*.bankName"),
    body("bank_details.*.accountTitle"),
    body("bank_details.*.iban"),
  ].map((x) => x.exists().notEmpty().isString().trim().customSanitizer(removeConsecutiveSpaces)),
  body("logo").exists().isString(),
  body("email").exists().isEmail(),
  body("phone").exists().trim(),
  body("longitude").exists().isFloat().toFloat(),
  body("latitude").exists().isFloat().toFloat(),
  body("completionDate").optional().isISO8601(),
  body("bank_details").optional().isArray(),
  body("bank_details.*.bankName")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .customSanitizer(removeConsecutiveSpaces),
]);
