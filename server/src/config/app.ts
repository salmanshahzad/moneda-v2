import path from "path";

import Koa from "koa";
import serve from "koa-static";

import router from "../app/routes";

const app = new Koa();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(path.join(__dirname, "..", "..", "..", "client", "dist")));

export default app;
