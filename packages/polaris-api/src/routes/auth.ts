import keyCloak from "keycloak-connect";
import { Router } from "express";
import { login, logout } from "polaris-api/controllers/auth";
import { asyncHandler, getKeyCloak } from "polaris-api/utils";

const router: Router = Router();
const keycloak: keyCloak.Keycloak = getKeyCloak();

router.post("/login", asyncHandler(login));
router.get("/logout", asyncHandler([keycloak.protect(), logout]));

export default router;
