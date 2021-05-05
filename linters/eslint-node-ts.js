const { nodeTSRules } = require("./eslint-rules");

module.exports = {
  env: {
    node: true,
    browser: false,
  },
  plugins: ["security"],
  extends: ["./eslint-basic-ts", "plugin:security/recommended"],
  rules: nodeTSRules,
};
