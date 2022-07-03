import Router from "@koa/router";

import logger from "../../config/logger";
import healthcheckRouter from "./healthcheck";
import sessionRouter from "./session";
import userRouter from "./user";

const router = new Router({ prefix: "/api" });

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error((err as Error).stack);
    ctx.status = 500;
  }
});

router.use(healthcheckRouter.allowedMethods(), healthcheckRouter.routes());
router.use(sessionRouter.allowedMethods(), sessionRouter.routes());
router.use(userRouter.allowedMethods(), userRouter.routes());

export default router;
