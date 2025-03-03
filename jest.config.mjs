import jestConfig from "next/jest.js";

const createJestConfig = jestConfig({
  dir: "./",
});

/** @type {import ("jest").Config} */
const config = {
  collectCoverage: false,
  moduleNameMapper: {
    "^utils/(.*)$": "<rootDir>/utils/$1",
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ['<rootDir>/__e2e__'], 
};

export default createJestConfig(config);
