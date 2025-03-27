import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApiProvider } from '@edunexia/api-client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider
      supabaseUrl={import.meta.env.VITE_SUPABASE_URL}
      supabaseKey={import.meta.env.VITE_SUPABASE_ANON_KEY}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiProvider>
  </React.StrictMode>,
) 