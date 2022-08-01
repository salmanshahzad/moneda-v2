import request from "supertest";

import app from "../../config/app";
import { createUser } from "./user";

export interface TestUser {
  cookie: string[];
  user: Awaited<ReturnType<typeof createUser>>;
  password: string;
}

async function createTestUser(): Promise<TestUser> {
  const username = Math.random().toString();
  const password = Math.random().toString();
  await createUser(username, password);

  const response = await request(app.callback()).post("/api/session").send({
    username,
    password,
  });

  return {
    cookie: response.header["set-cookie"],
    user: response.body.user,
    password,
  };
}

export default createTestUser;
