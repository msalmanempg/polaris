module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      compiler: "ttypescript",
    },
  },
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  maxWorkers: 2,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.ts"],
  modulePathIgnorePatterns: ["/__tests__/__data__/"],
  collectCoverageFrom: ["src/{!(index),}.ts", "src/**/{!(index),}.ts"],
  coverageReporters: [["lcov", { projectRoot: "../../" }], "text-summary"],
};
