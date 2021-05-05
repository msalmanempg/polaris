const { nodeRules } = require("./eslint-rules");

module.exports = {
  env: {
    node: true,
    browser: false,
  },
  plugins: ["node", "security"],
  extends: ["./eslint-basic-es6", "plugin:node/recommended", "plugin:security/recommended"],
  rules: nodeRules,
};
