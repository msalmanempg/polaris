import { Request, Response, Router } from "express";
import keyCloak from "keycloak-connect";
import { getKeyCloak } from "polaris-api/utils";
import AuthRoutes from "./auth";
import ChoreRoutes from "./chore";
import CustomerRoutes from "./customer";
import ProjectRoutes from "./project";
import UnitRoutes from "./unit";
import AgreementRoutes from "./agreement";

const router: Router = Router();
const keycloak: keyCloak.Keycloak = getKeyCloak();

router.get("/health-check", (_: Request, res: Response) => {
  res.send("ok");
});

router.use("/auth", AuthRoutes);
router.use("/agreement", AgreementRoutes);
router.use("/customer", CustomerRoutes);
router.use("/project", ProjectRoutes);
router.use("/unit", UnitRoutes);
router.use("/chore", keycloak.protect("admin"), ChoreRoutes);

export default router;
