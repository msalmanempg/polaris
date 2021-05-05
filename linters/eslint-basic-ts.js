const { basicTSRules } = require("./eslint-rules");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: ["@typescript-eslint", "import", "lodash", "promise", "sonarjs", "unicorn"],
  extends: [
    "plugin:lodash/recommended",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  rules: basicTSRules,
};
