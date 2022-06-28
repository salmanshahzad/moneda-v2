import Router from "@koa/router";

import healthcheckRouter from "./healthcheck";

const router = new Router();

router.use(healthcheckRouter.routes(), healthcheckRouter.allowedMethods());

export default router;
