module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      compiler: "ttypescript",
    },
  },
  maxWorkers: 2,
  setupFilesAfterEnv: ["./tests/setup.ts"],
  collectCoverageFrom: ["src/{!(index),}.ts", "src/**/{!(index),}.ts"],
  coverageReporters: [["lcov", { projectRoot: "../../" }], "text-summary"],
};
