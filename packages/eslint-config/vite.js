module.exports = {
  extends: [
    "./react.js",
  ],
  rules: {
    // Vite-specific rules can be added here
    "import/no-unresolved": [
      "error", 
      { "ignore": ["^virtual:", "^\\?", "\\?inline", "\\?raw", "\\?url"] }
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
} 