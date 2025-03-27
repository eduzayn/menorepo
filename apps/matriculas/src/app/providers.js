'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = Providers;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var react_query_devtools_1 = require("@tanstack/react-query-devtools");
var react_1 = require("react");
var sonner_1 = require("sonner");
function Providers(_a) {
    var children = _a.children;
    var queryClient = (0, react_1.useState)(function () { return new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                retry: 1,
            },
        },
    }); })[0];
    return ((0, jsx_runtime_1.jsxs)(react_query_1.QueryClientProvider, { client: queryClient, children: [children, (0, jsx_runtime_1.jsx)(sonner_1.Toaster, { richColors: true, position: "top-right" }), (0, jsx_runtime_1.jsx)(react_query_devtools_1.ReactQueryDevtools, { initialIsOpen: false })] }));
}
