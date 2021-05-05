import { Router } from "express";
import { asyncHandler } from "polaris-api/utils";
import {
  allCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "polaris-api/controllers/customer";

const router: Router = Router();

router.get("/", asyncHandler(allCustomers));
router.post("/add", asyncHandler(createCustomer));
router.put("/update/:id", asyncHandler(updateCustomer));
router.delete("/delete/:id", asyncHandler(deleteCustomer));

export default router;
