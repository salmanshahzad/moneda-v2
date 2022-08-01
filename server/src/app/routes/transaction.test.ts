import request from "supertest";

import app from "../../config/app";
import Transaction from "../models/transaction";
import User from "../models/user";
import createTestUser from "../utils/createTestUser";

const ENDPOINT = "/api/transaction";

describe("POST", () => {
  let username: string;
  let categories: { id: number }[];
  let cookies: string[];

  beforeAll(async () => {
    const { cookie, user } = await createTestUser();
    username = user.username;
    // @ts-expect-error id is populated by TypeORM
    categories = user.categories;
    cookies = cookie;
  });

  it("returns 401 if a user is not signed in", async () => {
    const response = await request(app.callback()).post(ENDPOINT);
    expect(response.statusCode).toBe(401);
  });

  it("returns 422 if the request body is invalid", async () => {
    const response = await request(app.callback())
      .post(ENDPOINT)
      .set("Cookie", cookies)
      .send({
        amount: 0,
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 422 if the category id does not exist", async () => {
    const maxCategoryId = categories.reduce(
      (max, category) => Math.max(max, category.id),
      0
    );
    const response = await request(app.callback())
      .post(ENDPOINT)
      .set("Cookie", cookies)
      .send({
        amount: 1,
        categoryId: maxCategoryId + 1,
        date: "1999-02-02",
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors).toBeDefined();
  });

  it("returns 201 if the request body is valid", async () => {
    const response = await request(app.callback())
      .post(ENDPOINT)
      .set("Cookie", cookies)
      .send({
        amount: 1,
        categoryId: categories[0]!.id,
        date: "1999-02-02",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.transaction).toBeDefined();

    await Transaction.delete({ id: response.body.transaction.id });
  });

  afterAll(async () => {
    await User.delete({ username });
  });
});
