import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './styles/luxury-styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <Router>
        <App />
      </Router>
    </HeroUIProvider>
  </React.StrictMode>,
)
