module.exports = {
  root: true,
  extends: ["@edunexia/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  }
}; 