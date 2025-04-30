
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { BrowserRouter as Router } from 'react-router-dom'
import React, { Suspense } from 'react';
import App from './App.tsx';
import './index.css'
import './styles/luxury-styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <Router>
        <Suspense fallback={<div>Loading...</div>}><App /></Suspense>
      </Router>
    </HeroUIProvider>
  </React.StrictMode>,
)
