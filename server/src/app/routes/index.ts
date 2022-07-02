import Router from "@koa/router";

import healthcheckRouter from "./healthcheck";

const router = new Router({ prefix: "/api" });

router.use(healthcheckRouter.routes(), healthcheckRouter.allowedMethods());

export default router;
