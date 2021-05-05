import * as winston from "winston";

import { DevLoggerConfig, ProdLoggerConfig } from "./config";

const logger = winston.createLogger(
  process.env.NODE_ENV !== "production" ? DevLoggerConfig : ProdLoggerConfig
);

type Logger = winston.Logger;

export { logger };
export type { Logger };
