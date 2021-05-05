const path = require("path");

module.exports = {
  root: true,
  ignorePatterns: ["projects/**/*"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: [
          path.resolve(__dirname, "tsconfig.json"),
          path.resolve(__dirname, "e2e/tsconfig.json"),
        ],
      },
      extends: [
        "plugin:@angular-eslint/ng-cli-compat",
        "plugin:@angular-eslint/ng-cli-compat--formatting-add-on",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:import/typescript",
      ],
      rules: {
        "@typescript-eslint/quotes": ["error", "double"],
        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix: "app",
            style: "kebab-case",
          },
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
          },
        ],
      },
    },
    {
      files: ["*.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
    {
      files: ["*.js"],
      extends: [path.resolve(__dirname, "../../linters/eslint-basic-es6")],
      rules: {},
    },
  ],
};
