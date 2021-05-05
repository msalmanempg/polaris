const path = require("path");

module.exports = {
  root: true,
  extends: [path.resolve(__dirname, "../../linters/eslint-node-ts")],
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.json"),
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/ban-ts-ignore": 0,
    "import/extensions": 0,
    "lodash/prefer-constant": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/no-unsafe-call": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "all",
        vars: "all",
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "security/detect-non-literal-fs-filename": 0,
  },
  overrides: [
    {
      files: ["**/*.spec.ts"],
      extends: [path.resolve(__dirname, "../../linters/eslint-test-ts")],
      rules: {
        "security/detect-object-injection": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/no-unsafe-assignment": 0,
        "@typescript-eslint/no-unsafe-member-access": 0,
        "@typescript-eslint/no-unsafe-call": 0,
        // causes false positives because of requestFactory
        "jest/expect-expect": 0,
        // causes false positives because of jest-each
        "jest/no-standalone-expect": 0,
      },
    },
  ],
};
