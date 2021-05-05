import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import { config } from "polaris-api/config";
import routes from "polaris-api/routes";
import { appSession, getKeyCloak, logger } from "polaris-api/utils";
import { setupGlobalAwsS3Client } from "polaris-api/utils/storage/aws-s3-client-factory";
import "reflect-metadata";
import { diMiddleware } from "./utils/diMiddleware";

const createExpressApp = (): Application => {
  !fs.existsSync(config.get("tempDirectory")) && fs.mkdirSync(config.get("tempDirectory"));
  !fs.existsSync(config.get("assetsDirectory")) && fs.mkdirSync(config.get("assetsDirectory"));
  const keyCloack = getKeyCloak();
  const app: express.Application = express();
  const accessFormt =
    "[:date[clf]]: :method :remote-addr - :url - :status :res[content-length] - :response-time ms";

  if (config.get("enableCompression")) {
    app.use(compression());
  }

  setupGlobalAwsS3Client(
    {
      bucket: config.get("aws").s3Bucket,
      bucketRegion: config.get("aws").s3bucketRegion,
      defaultACL: config.get("aws").defaultACL,
      accessKeyId: config.get("aws").accessKeyId,
      secretAccessKey: config.get("aws").secretAccessKey,
      appFolder: config.get("aws").appFolder,
    },
    logger
  );

  app.use(appSession);
  app.use(keyCloack.middleware());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    morgan(accessFormt, {
      stream: {
        write: (meta: any) => {
          logger.info(meta);
        },
      },
    })
  );

  app.use(diMiddleware);
  app.use(express.static(path.join(__dirname, "build")));
  app.use("/static/", express.static(config.get("assetsDirectory")));
  app.get(new RegExp("^((?!/api).)*$"), function (request, response) {
    response.sendFile(path.join(__dirname, "build", "index.html"));
  });
  app.use("/api", routes);

  process.on("uncaughtException", (err) => {
    logger.error(err);
  });
  process.on("uncaughtException", (ex) => {
    logger.error(ex);
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    process.exit(1);
  });

  return app;
};

export { createExpressApp };
