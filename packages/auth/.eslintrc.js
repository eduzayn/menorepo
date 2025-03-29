/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@edunexia/eslint-config/vite"], // ou react.js para libs, next.js para Next.js
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.json"],
      },
    },
  },
  rules: {
    // Sobrescrições específicas do módulo, se necessário
    "@typescript-eslint/no-explicit-any": "off", // Desabilitar temporariamente
    "@typescript-eslint/no-unused-vars": "warn"
  },
}; 