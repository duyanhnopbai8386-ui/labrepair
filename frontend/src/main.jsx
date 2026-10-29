import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppClient from './AppClient.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppClient />
  </StrictMode>,
)
