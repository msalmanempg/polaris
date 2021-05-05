const { browserES5Rules } = require("./eslint-rules");

module.exports = {
  plugins: ["es5"],
  extends: ["eslint:recommended", "plugin:es5/no-es2016", "airbnb-base/legacy", "prettier"],
  env: {
    es6: false,
    browser: true,
    jquery: true,
  },
  rules: browserES5Rules,
};
