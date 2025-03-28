module.exports = {
  root: true,
  extends: [
    '@edunexia/eslint-config',
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json", "apps/*/tsconfig.json", "packages/*/tsconfig.json"],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  }
}; 