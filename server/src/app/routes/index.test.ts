import request from "supertest";

import app from "../../config/app";

const ENDPOINT = "/api/healthcheck";

describe("index", () => {
  it("returns 500 on server errors", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await request(app.callback()).get(ENDPOINT);
    expect(response.statusCode).toBe(500);
  });
});
