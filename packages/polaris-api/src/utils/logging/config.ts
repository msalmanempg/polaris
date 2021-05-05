import * as winston from "winston";

const DevLoggerConfig: winston.LoggerOptions = {
  level: "debug",
  format: winston.format.json(),
  defaultMeta: undefined,
  transports: [new winston.transports.Console({ format: winston.format.simple() })],
};

const ProdLoggerConfig: winston.LoggerOptions = {
  level: "error",
  format: winston.format.json(),
  defaultMeta: { service: "polaris-api", lang: "nodejs", version: "1.0.1", ip: "" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
};

export { DevLoggerConfig, ProdLoggerConfig };
