"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var path_1 = require("path");
var url_1 = require("url");
var __dirname = (0, url_1.fileURLToPath)(new URL('.', import.meta.url));
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    build: {
        lib: {
            entry: (0, path_1.resolve)(__dirname, 'src/index.tsx'),
            name: 'ui-components',
            formats: ['es', 'umd'],
            fileName: function (format) { return "index.".concat(format === 'es' ? 'mjs' : 'js'); },
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
