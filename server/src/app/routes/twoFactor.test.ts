import * as twoFactor from "node-2fa";
import request from "supertest";

import app from "../../config/app";
import User from "../models/user";
import createTestUser from "../utils/createTestUser";

const ENDPOINT = "/api/two-factor";

describe("POST", () => {
  let cookies: string[];
  let username: string;

  beforeAll(async () => {
    const { cookie, user } = await createTestUser();
    cookies = cookie;
    username = user.username;
  });

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).post(ENDPOINT);
    expect(response.statusCode).toBe(401);
  });

  it("returns 204 if the 2FA is already enabled", async () => {
    await User.update({ username }, { isTwoFactorEnabled: true });

    const response = await request(app.callback())
      .post(ENDPOINT)
      .set("Cookie", cookies);
    expect(response.statusCode).toBe(204);

    await User.update({ username }, { isTwoFactorEnabled: false });
  });

  it("returns 200 if 2FA is not enabled", async () => {
    const response = await request(app.callback())
      .post(ENDPOINT)
      .set("Cookie", cookies);
    expect(response.statusCode).toBe(200);
    expect(response.body.secret).toBeDefined();
  });

  afterAll(async () => {
    await User.delete({ username });
  });
});

describe("POST /verify", () => {
  const endpoint = `${ENDPOINT}/verify`;
  let cookies: string[];
  let username: string;

  beforeAll(async () => {
    const { cookie, user } = await createTestUser();
    cookies = cookie;
    username = user.username;
  });

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).post(endpoint);
    expect(response.statusCode).toBe(401);
  });

  it("returns 422 if the request body is invalid", async () => {
    const response = await request(app.callback())
      .post(endpoint)
      .set("Cookie", cookies)
      .send({
        token: "",
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 422 if the token is invalid", async () => {
    jest
      .spyOn(twoFactor, "verifyToken")
      .mockImplementationOnce(() => ({ delta: -1 }));

    const response = await request(app.callback())
      .post(endpoint)
      .set("Cookie", cookies)
      .send({
        token: "foo",
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 204 if the token is valid", async () => {
    jest
      .spyOn(twoFactor, "verifyToken")
      .mockImplementationOnce(() => ({ delta: 0 }));

    const response = await request(app.callback())
      .post(endpoint)
      .set("Cookie", cookies)
      .send({
        token: "foo",
      });
    expect(response.statusCode).toBe(204);
  });

  afterAll(async () => {
    await User.delete({ username });
  });
});

describe("DELETE", () => {
  let cookies: string[];
  let username: string;

  beforeAll(async () => {
    const { cookie, user } = await createTestUser();
    cookies = cookie;
    username = user.username;
  });

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).delete(ENDPOINT);
    expect(response.statusCode).toBe(401);
  });

  it("returns 204 if a user is signed in", async () => {
    const response = await request(app.callback())
      .delete(ENDPOINT)
      .set("Cookie", cookies);
    expect(response.statusCode).toBe(204);
  });

  afterAll(async () => {
    await User.delete({ username });
  });
});
