module.exports = {
  extends: [
    "./react.js",
    "plugin:@next/next/recommended",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
}