import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { connectDb } from "./config/db";

const host = "0.0.0.0";

const start = async (): Promise<void> => {
  try {
    await connectDb();
    app.listen(env.PORT, host, () => {
      logger.info("SignalOps server listening", { port: env.PORT, host });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Server startup failed:", message);
    logger.error(
      "Server startup failed",
      error instanceof Error ? { message: error.message, stack: error.stack } : { error }
    );
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

void start();
