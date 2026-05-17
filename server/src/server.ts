import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { connectDb } from "./config/db";

const start = async (): Promise<void> => {
  try {
    await connectDb();
    app.listen(env.PORT, () => {
      logger.info("SignalOps server listening", { port: env.PORT });
    });
  } catch (error) {
    logger.error("Server startup failed", error instanceof Error ? { message: error.message, stack: error.stack } : { error });
    process.exit(1);
  }
};

void start();
