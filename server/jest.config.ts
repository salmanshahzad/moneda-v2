import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["./src/config/jestSetup.ts"],
  testEnvironment: "node",
};

export default config;
