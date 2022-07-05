import request from "supertest";

import app from "../../config/app";
import User from "../models/user";

const ENDPOINT = "/api/user";

describe("GET", () => {
  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).get(ENDPOINT);
    expect(response.statusCode).toBe(401);
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

    await User.create({
      username,
      password,
    }).save();

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
