import request from "supertest";

import app from "../../config/app";

const ENDPOINT = "/api/healthcheck";

describe("GET", () => {
  it("returns 200", async () => {
    const response = await request(app.callback()).get(ENDPOINT);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("uptime");
  });
});
