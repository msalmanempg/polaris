import { body } from "express-validator";
import { removeConsecutiveSpaces, validate } from "polaris-api/utils";

export const createDraftAgreementValidator = validate([
  body("agreementNumber")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .customSanitizer(removeConsecutiveSpaces),
  body("unitId").exists().isInt().toInt(),
  body("data").optional(),
]);
