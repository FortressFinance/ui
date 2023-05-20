/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "./jest-environment-jsdom.js",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/public/$1",
  },
}

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: ["/node_modules/(?!wagmi)/"],
})
