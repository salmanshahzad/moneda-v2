import path from "path";

import Koa from "koa";
import serve from "koa-static";

import db from "./config/db";
import env from "./config/env";

const app = new Koa();

app.use(serve(path.join(__dirname, "..", "..", "client", "dist")));

db.initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Moneda server listening on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing database", err);
    process.exit(1);
  });
