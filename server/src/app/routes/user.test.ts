import request from "supertest";

import app from "../../config/app";
import db from "../../config/db";
import User from "../models/user";

const ENDPOINT = "/api/user";

describe("GET", () => {
  beforeAll(async () => {
    await db.initialize();
    await User.clear();
  });

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).get(ENDPOINT);
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await db.destroy();
  });
});

describe("POST", () => {
  beforeAll(async () => {
    await db.initialize();
    await User.clear();
  });

  it("returns 422 if the request body is invalid", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username: "",
    });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 201 if the request body is valid", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username: "username",
      password: "password",
      confirmPassword: "password",
    });
    expect(response.statusCode).toBe(201);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it("returns 422 if the username already exists", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username: "username",
      password: "password",
      confirmPassword: "password",
    });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  afterAll(async () => {
    await db.destroy();
  });
});
