module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "./node_modules/@stripe/ui-extension-tools/eslintrc.ui-extension.js",
  ],
  plugins: ["node", "prettier", "spellcheck"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    requireConfigFile: false,
  },
  ignorePatterns: ["node_modules/**/*"],
  rules: {
    "spellcheck/spell-checker": [
      "warn",
      {
        comments: true,
        skipWords: [
          "ondemand",
          "webhook",
          "webhooks",
          "fs",
          "dotenv",
          "cors",
          "ecma",
          "paircode",
          "endregion",
          "misconfigured",
          "usd",
          "devchat",
          "commonjs",
          "axios",
          "markdoc",
        ],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        semi: true,
      },
    ],
    "@typescript-eslint/ban-ts-comment": ["off"],
  },
};