import { Router } from "express";
import { allUnits, exportUnits, importUnit, getUnitDetails } from "polaris-api/controllers/unit";
import { asyncHandler } from "polaris-api/utils";

const router: Router = Router();
router.get("/", asyncHandler(allUnits));
router.post("/import", asyncHandler(importUnit));
router.get("/export/:id", asyncHandler(exportUnits));
router.get("/detail/:id", asyncHandler(getUnitDetails));

export default router;
