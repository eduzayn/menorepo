import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ApiProvider } from './contexts/ApiContext';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(ReactQueryProvider, { children: _jsx(ApiProvider, { children: _jsx(App, {}) }) }) }) }));
