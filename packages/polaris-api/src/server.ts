import { createExpressApp } from "polaris-api/app";
import { config } from "polaris-api/config";
import { logger } from "polaris-api/utils";

const app = createExpressApp();

app.listen(config.get("port"), config.get("host"), () => {
  logger.info(` host: ${config.get("host")}, port: ${config.get("port")}`);
});
