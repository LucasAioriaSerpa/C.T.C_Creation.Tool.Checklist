import '../css/loginForm.css'
import React, { useState } from "react";
import authService from "../utils/auth/authService";
import { UseForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
    const navigate = useNavigate()
    const [formData, handleChange, resetForm] = UseForm({
        'db-table': 'auditor',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState(null)
    const HandleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await authService.login(formData.email, formData.password)
            alert('Login bem sucedido!')
            resetForm()
            navigate('/dashboardChecklist')
        } catch (error) {
            setError(error.message)
            alert(`Erro: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form className='form-login' onSubmit={HandleSubmit}>
            {error && <div className='error-message'>{error}</div>}
            <input type="text"
                name='email'
                id='email_input'
                placeholder='Insira seu email aqui!'
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
            />
            <input type="password"
                name='password'
                id='password_input'
                placeholder='****'
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
            />
            <input type="submit"
                value={
                    loading ? 'Entrando...' : 'Entrar'
                }
                disabled={loading}
            />
        </form>
    )
}
