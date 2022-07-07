import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["./src/jestSetup.ts"],
  testEnvironment: "jsdom",
};

export default config;
