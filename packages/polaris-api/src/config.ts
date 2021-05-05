import convict from "convict";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".envrc") });

convict.addFormat({
  name: "OptionalString",
  validate: (value) => !value || typeof value === "string",
});

const config = convict({
  appDirectory: {
    doc: "Application Root Directory",
    format: "String",
    default: __dirname,
  },
  host: {
    doc: "Hostname/IP the service should bind on.",
    format: "String",
    default: "0.0.0.0",
    env: "HOST",
  },
  port: {
    doc: "Port number for the HTTP server to listen on.",
    format: "port",
    default: 3000,
    env: "PORT",
  },
  secret: {
    doc: "Secret to encrypt cookies with.",
    format: "*",
    default: "test",
    env: "APP_SECRET",
    sensitive: true,
  },
  enableCompression: {
    doc: "Whether to enable GZIP compression of response bodies or not.",
    format: "Boolean",
    default: true,
    env: "APP_ENABLE_COMPRESSION",
  },
  environment: {
    name: {
      doc: "Name of the environment we're running in.",
      format: "String",
      default: "unknown",
      env: "APP_ENVIRONMENT",
    },
  },
  assetsDirectory: {
    doc: "Local Assets Directory",
    format: "String",
    default: path.join(__dirname, "static"),
    env: "ASSETS_DIRECTORY",
  },
  tempDirectory: {
    doc: "Temporary Directory for file buffers etc",
    format: "String",
    default: path.join(__dirname, "tmp"),
    env: "TEMP_DIRECTORY",
  },
  keycloak: {
    realm: {
      doc: "Name of the keycloak realm to use.",
      format: "String",
      default: "propforce",
      env: "KEYCLOAK_REALM",
    },
    clientID: {
      doc: "ID of the client to authenticate with.",
      format: "String",
      default: "affiliates",
      env: "KEYCLOAK_CLIENT_ID",
    },
    clientSecret: {
      doc: "Secret key to authenticate as a client with.",
      format: "String",
      default: "",
      env: "KEYCLOAK_CLIENT_SECRET",
      sensitive: true,
    },
    authServerURL: {
      doc: "URL of the Keycloak server to use (note: ends in /auth).",
      format: "String",
      default: "",
      env: "KEYCLOAK_AUTH_SERVER_URL",
    },
  },
  aws: {
    accessKeyId: {
      doc: "AWS access Key ID",
      format: "String",
      default: "",
      env: "AWS_ACCESS_KEY_ID",
    },
    secretAccessKey: {
      doc: "AWS secret access key",
      format: "String",
      default: "",
      env: "AWS_SECRET_ACCESS_KEY",
    },
    s3Bucket: {
      doc: "AWS S3 bucket",
      format: "String",
      default: "",
      env: "AWS_S3_BUCKET",
    },
    defaultACL: {
      doc: "The default access control to set for each object.",
      format: String,
      default: "private",
      env: "S3_ACL",
    },
    s3bucketRegion: {
      doc: "Name of the AWS region the S3 bucket is in.",
      format: "String",
      default: "eu-west-1",
      env: "AWS_REGION",
    },
    appFolder: {
      doc: "The folder used to store all the subfolders and files inside the bucket.",
      format: String,
      default: "",
      env: "S3_APP_FOLDER",
    },
  },
});

const loadConfig = (): void => {
  config.validate({ allowed: "strict" });
};

export { config, loadConfig };
