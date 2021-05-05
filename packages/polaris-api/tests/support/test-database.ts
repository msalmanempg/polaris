import { Model, prisma } from "@polaris/prisma";

const clearDatabase = async (): Promise<number[]> => {
  console.log("Clearing database");

  return Promise.all(
    Object.values(Model).map(
      (modelName: string): Promise<number> => prisma.$executeRaw(`DELETE FROM ${modelName};`)
    )
  );
};

const disconnectDatabase = async (): Promise<any> => {
  console.log("Disconnecting database client");
  return prisma.$disconnect();
};

export { clearDatabase, disconnectDatabase };
