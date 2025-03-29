import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ApiProvider } from './contexts/ApiContext';
import { ReactQueryProvider } from './providers/ReactQueryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <ApiProvider>
          <App />
        </ApiProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
); 