import { Router } from "express";
import { migrate } from "polaris-api/controllers/chore";
import { asyncHandler } from "polaris-api/utils";

const router: Router = Router();

router.get("/migrate", asyncHandler(migrate));

export default router;
