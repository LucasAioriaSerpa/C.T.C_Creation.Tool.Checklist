import './css/App.css'
import React, { Suspense, lazy, useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/errorBoundary'

const HomePage                = lazy(() => import('./pages/homePage'))
const LoginPage               = lazy(() => import('./pages/LoginPage'))
const SignUpPage              = lazy(() => import('./pages/SignUpPage'))
const DashboardChecklistPage  = lazy(() => import('./pages/dashboardChecklistPage'))
const ChecklistDetailPage     = lazy(() => import('./pages/checklistDetailPage'))
const ChecklistSetupPage      = lazy(() => import('./pages/checklistSetupPage'))

function App() {
  const [backendData, setBackendData] = useState({message: '', author: '', timestamp: '', status: ''})
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL
  useEffect(() => {
    fetch(`${API_URL}/API/status`)
      .then(response => response.json())
      .then(data => {
        setBackendData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error requisition fetch:', error)
        setBackendData({
          message: 'Erro ao conectar com a API',
          authro: 'frontend REACT',
          timestamp: new Date().toISOString(),
          status: 'Error'
        })
        setLoading(false)
      })
  }, [API_URL])

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={
          <div className="loading">
            <h1>Carregando...</h1>
            <h3>Aguarde um momento</h3>
            <div className='teste-conexao-backend'>
              <h1>Testando a conexão com variaveis de ambiente</h1>
              {loading ? (
                <p>Aguardando resposta do backend...</p>
              ) : (
                <>
                  <p><strong>Status da conexão:</strong>  {backendData.status}    </p>
                  <p><strong>Mensagem:</strong>           {backendData.message}   </p>
                  <p><strong>Autor:</strong>              {backendData.author}    </p>
                  <p><strong>Timestamp:</strong>          {backendData.timestamp} </p>
                </>
              )}
            </div>
          </div>
        }>
          <Routes>
            <Route path="/"                    element={<HomePage />} />
            <Route path="/login"               element={<LoginPage />} />
            <Route path="/signup"              element={<SignUpPage />} />
            <Route path="/dashboardChecklist"  element={<DashboardChecklistPage />} />
            <Route path="/checklist/:id"       element={<ChecklistDetailPage />} />
            <Route path="/checklist/:id/setup" element={<ChecklistSetupPage />} />
            <Route path="*"                    element={<h1>404 - Página não encontrada!</h1>}/>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App
