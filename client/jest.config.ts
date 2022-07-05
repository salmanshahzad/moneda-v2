import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
};

export default config;
