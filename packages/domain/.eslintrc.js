const path = require("path");

module.exports = {
  root: true,
  extends: [path.resolve(__dirname, "../../linters/eslint-node-ts")],
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.app.json"),
  },
  ignorePatterns: [".eslintrc.js"],
  overrides: [
    {
      files: ["tests/**/*", "*.spec.ts"],
      extends: [path.resolve(__dirname, "../../linters/eslint-test-ts")],
      parserOptions: {
        project: path.resolve(__dirname, "tsconfig.spec.json"),
      },
      rules: {
        "jest/no-identical-title": "warn",
      },
    },
  ],
};
