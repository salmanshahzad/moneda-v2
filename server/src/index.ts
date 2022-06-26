import path from "path";

import Koa from "koa";
import serve from "koa-static";

import env from "./config/env";

const app = new Koa();

app.use(serve(path.join(__dirname, "..", "..", "client", "dist")));

app.listen(env.PORT);
