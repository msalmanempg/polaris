const { testRulesTS } = require("./eslint-rules");

module.exports = {
  plugins: ["jest"],
  extends: ["./eslint-basic-ts", "plugin:jest/recommended"],
  env: {
    node: true,
    browser: false,
    jasmine: true,
    protractor: true,
    "shared-node-browser": true,
  },
  rules: testRulesTS,
};
