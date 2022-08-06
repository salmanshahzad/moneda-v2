import argon2 from "argon2";
import * as twoFactor from "node-2fa";
import request from "supertest";

import app from "../../config/app";
import User from "../models/user";

const ENDPOINT = "/api/session";

describe("POST", () => {
  const username = "sessiontest";
  const password = "password";

  beforeAll(async () => {
    await User.save({
      username,
      password: await argon2.hash(password),
    });
  });

  it("returns 422 if the credentials are not sent", async () => {
    const response = await request(app.callback()).post(ENDPOINT);
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 401 if the username is incorrect", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username: "user",
      password,
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 401 if the password is incorrect", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password: "pass",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 200 if the credentials are correct", async () => {
    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it("returns isTwoFactorEnabled if a token is not sent", async () => {
    await User.update({ username }, { isTwoFactorEnabled: true });

    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).not.toBeDefined();
    expect(response.body.user).toEqual({ isTwoFactorEnabled: true });
  });

  it("returns 401 if the 2FA token is invalid", async () => {
    jest
      .spyOn(twoFactor, "verifyToken")
      .mockImplementationOnce(() => ({ delta: -1 }));

    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password,
      token: "token",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 200 if the 2FA token is valid", async () => {
    jest
      .spyOn(twoFactor, "verifyToken")
      .mockImplementationOnce(() => ({ delta: 0 }));

    const response = await request(app.callback()).post(ENDPOINT).send({
      username,
      password,
      token: "token",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  afterAll(async () => {
    await User.delete({ username });
  });
});

describe("DELETE", () => {
  it("returns 204", async () => {
    const response = await request(app.callback()).delete(ENDPOINT);
    expect(response.statusCode).toBe(204);
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
