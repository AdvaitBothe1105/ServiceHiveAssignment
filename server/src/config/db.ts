import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", error instanceof Error ? { message: error.message, stack: error.stack } : { error });
    throw error;
  }
};
