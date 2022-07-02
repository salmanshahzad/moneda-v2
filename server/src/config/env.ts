import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config({
  path: process.env["NODE_ENV"] === "test" ? ".env.test" : ".env",
});

const env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_PORT: port(),
  DB_USER: str(),
  PORT: port(),
  SESSION_SECRET: str(),
});

export default env;
