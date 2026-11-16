import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { initConfig } from './lib/config'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

// 初始化配置
initConfig()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
