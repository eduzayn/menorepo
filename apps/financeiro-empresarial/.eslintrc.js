/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@edunexia/eslint-config/vite"], // ou react.js para libs, next.js para Next.js
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    // Sobrescrições específicas do módulo, se necessário
  },
}; 