import { PrismaClient } from "@prisma/client";

const datasource =
  process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  log: [{ emit: "stdout", level: "error" }],
  datasources: {
    db: {
      url: datasource ?? "",
    },
  },
});

export { prisma };
