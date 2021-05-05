import { Router } from "express";
import {
  allAgreements,
  checkAvailability,
  createAgreement,
  createDraftAgreement,
  getDetails,
  getDraftDetails,
  hybridAll,
} from "polaris-api/controllers/agreement";
import { asyncHandler } from "polaris-api/utils";

const router: Router = Router();
router.get("/", asyncHandler(hybridAll));
router.get("/all", asyncHandler(allAgreements));
router.post("/add", asyncHandler(createAgreement));
router.get("/check_agreement_number/:agreementNumber", asyncHandler(checkAvailability));
router.get("/detail/:id", asyncHandler(getDetails));
router.post("/draft", asyncHandler(createDraftAgreement));
router.get("/draft/detail/:id", asyncHandler(getDraftDetails));

export default router;
