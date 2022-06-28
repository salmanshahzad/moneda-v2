import Router from "@koa/router";

const router = new Router({ prefix: "/healthcheck" });

router.get("/", (ctx) => {
  ctx.body = {
    timestamp: Date.now(),
    uptime: Math.floor(process.uptime()),
  };
});

export default router;
