import request from "supertest";

import app from "../../config/app";
import User from "../models/user";
import createTestUser from "../utils/createTestUser";

const ENDPOINT = "/api/user";

describe("GET", () => {
  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).get(ENDPOINT);
    expect(response.statusCode).toBe(401);
  });

  it("returns 200 if a user is signed in", async () => {
    const { cookie, user } = await createTestUser();
    const response = await request(app.callback())
      .get(ENDPOINT)
      .set("Cookie", cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(user);
  });
});

describe("POST", () => {
  it("returns 422 if the request body is invalid", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username: "",
    });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 201 if the request body is valid", async () => {
    const username = "usertest";
    const password = "password";

    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password,
      confirmPassword: password,
    });
    expect(response.statusCode).toBe(201);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body.user).toBeDefined();

    await User.delete({ username });
  });

  it("returns 422 if the username already exists", async () => {
    const username = "usertest";
    const password = "password";

    await User.save({
      username,
      password,
    });

    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password,
      confirmPassword: password,
    });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username });
  });
});
