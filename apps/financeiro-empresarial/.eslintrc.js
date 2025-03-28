/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@edunexia/eslint-config/vite"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    // App-specific overrides
  },
}; 