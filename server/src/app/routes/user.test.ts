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

describe("PUT /username", () => {
  const endpoint = `${ENDPOINT}/username`;

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).put(endpoint);
    expect(response.statusCode).toBe(401);
  });

  it("returns 422 if the request body is invalid", async () => {
    const { cookie, user } = await createTestUser();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        username: "",
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username: user.username });
  });

  it("returns 401 if the password is incorrect", async () => {
    const { cookie, user } = await createTestUser();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        username: "foo",
        password: "foo",
      });
    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username: user.username });
  });

  it("returns 422 if the username already exists", async () => {
    const { cookie, user, password } = await createTestUser();
    const { user: user2 } = await createTestUser();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        username: user2.username,
        password,
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username: user.username });
    await User.delete({ username: user2.username });
  });

  it("returns 204 if the request body is valid", async () => {
    const { cookie, password } = await createTestUser();
    const newUsername = Math.random().toString();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        username: newUsername,
        password,
      });
    expect(response.statusCode).toBe(204);

    await User.delete({ username: newUsername });
  });
});

describe("PUT /password", () => {
  const endpoint = `${ENDPOINT}/password`;

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).put(endpoint);
    expect(response.statusCode).toBe(401);
  });

  it("returns 422 if the request body is invalid", async () => {
    const { cookie, user } = await createTestUser();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        password: "",
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username: user.username });
  });

  it("returns 401 if the password is incorrect", async () => {
    const { cookie, user } = await createTestUser();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        oldPassword: "foo",
        password: "foo",
        confirmPassword: "foo",
      });
    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username: user.username });
  });

  it("returns 204 if the request body is valid", async () => {
    const { cookie, user, password } = await createTestUser();
    const newPassword = Math.random().toString();

    const response = await request(app.callback())
      .put(endpoint)
      .set("Cookie", cookie)
      .send({
        oldPassword: password,
        password: newPassword,
        confirmPassword: newPassword,
      });
    expect(response.statusCode).toBe(204);

    await User.delete({ username: user.username });
  });
});

describe("DELETE", () => {
  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).delete(ENDPOINT);
    expect(response.statusCode).toBe(401);
  });

  it("returns 401 if the password is incorrect", async () => {
    const { cookie, user } = await createTestUser();

    const response = await request(app.callback())
      .delete(ENDPOINT)
      .set("Cookie", cookie)
      .send({
        password: "foo",
      });
    expect(response.statusCode).toBe(401);
    expect(response.body.errors).toBeDefined();

    await User.delete({ username: user.username });
  });

  it("returns 204 if the password is correct", async () => {
    const { cookie, user, password } = await createTestUser();

    const response = await request(app.callback())
      .delete(ENDPOINT)
      .set("Cookie", cookie)
      .send({
        password,
      });
    expect(response.statusCode).toBe(204);

    await User.delete({ username: user.username });
  });
});
