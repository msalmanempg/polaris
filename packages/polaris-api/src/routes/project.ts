import { Router } from "express";
import {
  allProjects,
  createProject,
  deleteProject,
  updateProject,
  getProjectDetails,
} from "polaris-api/controllers/project";
import { asyncHandler } from "polaris-api/utils";

const router: Router = Router();

router.get("/", asyncHandler(allProjects));
router.get("/detail/:id", asyncHandler(getProjectDetails));
router.post("/add", asyncHandler(createProject));
router.put("/update/:id", asyncHandler(updateProject));
router.delete("/delete/:id", asyncHandler(deleteProject));

export default router;
