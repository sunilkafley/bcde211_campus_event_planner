import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './pwa/register_service_worker'
import { HashRouter } from 'react-router-dom'

/*
  React.StrictMode is a development-only tool that helps you catch potential 
  problems in your React code early. It doesn’t render anything visible in the 
  UI—it just adds extra checks and warnings.
*/
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
