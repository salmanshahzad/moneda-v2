import path from "path";

import { DataSource } from "typeorm";

import env from "./env";

const dataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: !env.isProd,
  logging: true,
  entities: [path.join(__dirname, "..", "app", "models", "*.{js,ts}")],
});

export default dataSource;
