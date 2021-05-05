const { testRules } = require("./eslint-rules");

module.exports = {
  plugins: ["chai-expect", "chai-friendly", "mocha", "jest"],
  extends: [
    "./eslint-basic-es6",
    "plugin:chai-expect/recommended",
    "plugin:chai-friendly/recommended",
    "plugin:mocha/recommended",
    "plugin:jest/recommended",
  ],
  env: {
    node: true,
    browser: false,
    jasmine: true,
    mocha: true,
    protractor: true,
    "shared-node-browser": true,
  },
  rules: testRules,
};
