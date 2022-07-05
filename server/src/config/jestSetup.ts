import db from "./db";

beforeAll(async () => {
  await db.initialize();
});

afterAll(async () => {
  await db.destroy();
});
