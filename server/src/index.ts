import { Server } from "http";
import util from "util";

import app from "./config/app";
import db from "./config/db";
import env from "./config/env";
import logger from "./config/logger";

async function start(): Promise<void> {
  try {
    await db.initialize();
    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
    process.once("SIGINT", () => shutdown(server));
    process.once("SIGTERM", () => shutdown(server));
  } catch (err) {
    logger.error("Error starting server", err);
    process.exit(1);
  }
}

async function shutdown(server: Server): Promise<void> {
  logger.info("Shutting down server");
  try {
    await util.promisify(server.close.bind(server))();
    await db.destroy();
    logger.info("Shut down server");
  } catch (err) {
    logger.error("Error shutting down server", err);
    process.exit(1);
  }
}

start();
