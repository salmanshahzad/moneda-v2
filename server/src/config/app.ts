import path from "path";

import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import serve from "koa-static";
import session from "koa-session";

import env from "../config/env";
import router from "../app/routes";

const app = new Koa();

app.keys = [env.SESSION_SECRET];

app.use(bodyParser());
app.use(cors({ credentials: true }));
app.use(session(app));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(path.join(__dirname, "..", "..", "..", "client", "dist")));

export default app;
