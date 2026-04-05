import React from 'react'
import ReactDOM from 'react-dom/client'
import { LoanCalculator } from './components/LoanCalculator'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoanCalculator />
  </React.StrictMode>,
)
