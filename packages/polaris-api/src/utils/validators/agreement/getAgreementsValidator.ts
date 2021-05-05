import { query } from "express-validator";
import { validate } from "polaris-api/utils";

export const getAgreementsValidator = validate([
  query("pageOffset").optional().isInt().toInt(),
  query("pageSize").optional().isInt().toInt(),
  query("status").optional({ nullable: true }).isString(),
  query("includeStats").optional().isBoolean().toBoolean(),
]);
