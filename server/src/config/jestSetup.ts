import db from "./db";

beforeAll(async () => {
  await db.initialize();
  for (const entity of db.entityMetadatas) {
    await db.getRepository(entity.name).clear();
  }
});

afterAll(async () => {
  await db.destroy();
});
