import "dotenv/config";
import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_PORT: port(),
  DB_USER: str(),
  PORT: port(),
});

export default env;
