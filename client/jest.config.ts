import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  preset: "ts-jest",
  setupFiles: ["./src/jestSetup.ts"],
  testEnvironment: "jsdom",
};

export default config;
