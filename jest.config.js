/**
 * @type {import('ts-jest/dist/types').InitialOptionsTsJest}
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRunner: "jest-jasmine2",
  silent: false,
  verbose: true,
  setupFiles: ["<rootDir>/testing/setup.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "lib/**/*.ts",
    "!lib/**/*.d.ts",
    "!lib/**/testing/**",
    "!lib/**/index.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
