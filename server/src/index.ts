import path from "path";

import Koa from "koa";
import serve from "koa-static";

const app = new Koa();

app.use(serve(path.join(__dirname, "..", "..", "client", "dist")));

app.listen(process.env["PORT"] ?? 1024);
