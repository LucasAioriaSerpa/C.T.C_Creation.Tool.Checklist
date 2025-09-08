import './css/App.css'
import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/errorBoundary'
const HomePage    = lazy(() => import('./pages/homePage'))
const LoginPage   = lazy(() => import('./pages/loginPage'))
const SignUpPage  = lazy(() => import('./pages/signUpPage'))
const DashboardChecklistPage  = lazy(() => import('./pages/dashboardChecklistPage'))

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={
          <div className="loading">
            <h1>Carregando...</h1>
            <h3>Aguarde um momento</h3>
          </div>
        }>
          <Routes>
            <Route path="/"       element={<HomePage />} />
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboardChecklist" element={<DashboardChecklistPage />} />
            <Route path="*"       element={<h1>404 - Página não encontrada!</h1>}/>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App
