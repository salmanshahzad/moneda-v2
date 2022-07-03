import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/server/src/config/jestSetup.ts"],
  testEnvironment: "node",
};

export default config;
