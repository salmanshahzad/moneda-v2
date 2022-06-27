import path from "path";

import Koa from "koa";
import serve from "koa-static";

const app = new Koa();

app.use(serve(path.join(__dirname, "..", "..", "..", "client", "dist")));

export default app;
