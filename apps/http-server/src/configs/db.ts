import { prismaClient } from "@repo/db/client";

export const connectToDB = async () => {
  try {
    await prismaClient.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};
