const { basicRules } = require("./eslint-rules");

module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
  },
  plugins: ["lodash", "promise", "sonarjs", "unicorn"],
  extends: [
    "eslint:recommended",
    "plugin:lodash/recommended",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "airbnb-base",
    "prettier",
  ],
  rules: basicRules,
};
