// JS rules. These are also applied to TypeScript
const jsRules = {
  // Require === in comparisons but allow (x == null) to check both null and undefined
  eqeqeq: ["error", "allow-null"],
  // Node builtins and external dependencies in their own import group first,
  // imports are grouped according to the eslint defaults and then sorted alphabetically
  "import/order": [
    "error",
    {
      alphabetize: {
        order: "asc",
      },
      "newlines-between": "always-and-inside-groups",
    },
  ],
  "import/extensions": ["error"],
  "import/no-unused-modules": [
    "error",
    {
      unusedExports: true,
    },
  ],
  "import/no-default-export": "error",
  // Prevents using the magic arguments var
  "fp/no-arguments": "error",
  // Loops are rarely needed and most often map, filter, or reduce would be correct
  "fp/no-loops": "error",
  // Prevent accidental mutation with Object.assign
  "fp/no-mutating-assign": "error",
  // Prefer function declarations
  "func-style": ["error", "declaration"],
  // enforce consistent sane spacing
  "padding-line-between-statements": [
    "error",
    { blankLine: "always", prev: "*", next: "function" },
    { blankLine: "always", prev: "function", next: "*" },
    { blankLine: "always", prev: "throw", next: "*" },
    { blankLine: "always", prev: "*", next: "return" },
    { blankLine: "always", prev: "*", next: "if" },
    { blankLine: "always", prev: "if", next: "*" },
    {
      blankLine: "always",
      prev: "*",
      next: ["multiline-const", "multiline-let"],
    },
  ],
}

// TypeScript rules
const tsRules = {
  // Using this rule over tsconfig noUnusedLocals and noUnusedParameters allows
  // development time building code with unused vars but committing such code will not work
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      // Allow unused rest siblings for destructuring
      ignoreRestSiblings: true,
    },
  ],
  // Require using "import type" where possible
  "@typescript-eslint/consistent-type-imports": ["error"],
  // Require return types for functions except for "expressions"
  "@typescript-eslint/explicit-function-return-type": ["error"],
  // Disabled in favor of @typescript-eslint/return-await
  "no-return-await": "off",
  // Force using return await inside try/catch, otherwise rejected promises are not caught
  "@typescript-eslint/return-await": ["error", "in-try-catch"],
  // Require explicit accessibility modifiers on class properties and methods.
  "@typescript-eslint/explicit-member-accessibility": ["error"],
  // Typescript already takes care of these, and with this rule type-only imports like type-fest don't work
  "import/no-unresolved": "off",
  ...jsRules,
}

module.exports = {
  extends: [
    "prettier", // eslint-config-prettier used to disable rules conflicting with prettier
  ],
  overrides: [
    // == JSON ==
    {
      files: ["**/*.json"],
      extends: ["plugin:json/recommended", "prettier"],
    },

    // == TypeScript ==
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
      ],
      plugins: ["fp"],
      rules: {
        ...tsRules,
      },
    },
  ],
  rules: {
    // If there is a need for common rules over different file types
  },
}
