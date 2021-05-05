const basicRules = {
  // Page Objects use getters for element selectors
  // Angular components templates need data to be defined in templates
  "class-methods-use-this": "off",
  eqeqeq: ["error", "smart"],
  "lines-around-directive": "off", // Deprecate
  "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
  "no-use-before-define": ["error", { functions: false }],
  "one-var": ["error", "never"], // Separate declaration of const/let for readability
  "vars-on-top": "off", // We should not use vars - no-var
  "import/no-dynamic-require": "off", // Already enforced by global-require
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "parent", "sibling", "index"],
      alphabetize: { order: "asc", caseInsensitive: true },
      "newlines-between": "always-and-inside-groups",
    },
  ],
  "import/prefer-default-export": "off", // Sometimes it makes more sense to keep named imports
  "lodash/chain-style": "off", // Use composition instead of chaining
  "lodash/import-scope": "off", // Throws errors in typescript
  "lodash/prefer-constant": "off", // No need to enforce it
  "lodash/prefer-is-nil": "off", // Check using == null
  "lodash/prefer-lodash-chain": "off", // Use composition instead of chaining
  "lodash/prefer-lodash-method": "off", // Prefer using native methods instead of lodash
  "lodash/prop-shorthand": "off",
  "lodash/unwrap": "off", // Prefer composition instead of chaining
  "promise/always-return": "off", // Prefer using async/await
  "promise/catch-or-return": "off", // Prefer using async/await
  "promise/prefer-await-to-then": "error",
  "security/detect-object-injection": "off", // Has many false positives
  "sonarjs/no-duplicate-string": "off", // Prefer other ways to prevent duplication
  "sonarjs/no-useless-catch": "off", // Already enforced by ESLint
  "unicorn/no-for-loop": "off", // for-of is not allowed in airbnb guide
  "unicorn/no-nested-ternary": "off", // no-nested-ternary
  "unicorn/no-process-exit": "off", // Already enforced by ESLint
  "unicorn/prefer-exponentiation-operator": "off", // no-restricted-properties
  "unicorn/prevent-abbreviations": "off", // It's annoying cause when abbreviations are needed
  "unicorn/regex-shorthand": "off", // Can have false positives
  "unicorn/filename-case": "off", // Temporarly turn off as it's making other warnings hard to see
};
const basicTSRules = {
  ...basicRules,
  "@typescript-eslint/ban-ts-ignore": "off", // In some cases it's not worth the effort to add types
  "@typescript-eslint/no-use-before-define": "off",
  "import/order": "off", // It is very slow on typescript files
  "no-use-before-define": "off",
  "lodash/prefer-lodash-typecheck": "off", // using typescript
  "lodash/prefer-includes": "off", // duplicate of @typescript-eslint/prefer-includes
  "unicorn/prefer-includes": "off", // duplicate of @typescript-eslint/prefer-includes
};

const nodeRules = {
  "lodash/import-scope": "off", // Throws errors in typescript
  "node/no-deprecated-api": "off", // Already enforced by unicorn/no-new-buffer
  "node/no-extraneous-import": "off", // Already enforced by eslint-plugin-import
  "node/no-extraneous-require": "off", // Already enforced by eslint-plugin-import
  "node/no-missing-require": "off", // Already enforced by eslint-plugin-import
  "node/no-unsupported-features/es-syntax": "off", // We should upgrade node
  "security/detect-object-injection": "off", // Has many false positives
};
const nodeTSRules = {
  ...nodeRules,
};

const testRules = {
  "lodash/import-scope": "off", // Throws errors in typescript
  "max-classes-per-file": "off", // Test files can contain helper classes
  "mocha/no-mocha-arrows": "off", // We don't use the mocha context that often
  "mocha/no-setup-in-describe": "off", // Allow dynamically generated tests
  "mocha/no-sibling-hooks": "off", // Useful to allow TestBed setup be async
  "node/no-unpublished-require": "off", // Test dependencies can be part of devDependencies
  "security/detect-object-injection": "off", // Has many false positives
  "unicorn/consistent-function-scoping": "off", // Test files can define dummy arrow functions for input properties
};
const testRulesTS = {
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/unbound-method": "off",
  "jest/no-try-expect": "off", // AppError needs snapshot matching
  ...testRules,
};

const browserES5Rules = {
  "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
  "no-use-before-define": ["error", { functions: false }],
};

module.exports = {
  basicRules,
  basicTSRules,
  nodeRules,
  nodeTSRules,
  testRules,
  testRulesTS,
  browserES5Rules,
};
