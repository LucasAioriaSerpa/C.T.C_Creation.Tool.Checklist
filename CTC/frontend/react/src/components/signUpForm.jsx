import '../css/signUpForm.css'
import React, { useState } from 'react'
import { SendFormData } from '../utils/sendFormData'
import { UseForm } from '../hooks/useForm'

export function SignUpForm() {
    const [formData, handleChange, resetForm] = UseForm({
        nome: '',
        email: '',
        password: ''
    })
    const [loading, setLoading]     = useState(false)
    const [error, setError]         = useState(null)
    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const response = await SendFormData(formData)
            console.log('Resposta do servidor: ', response)
            alert('Cadastro realizado!')
            resetForm
        } catch (error) {
            setError(error.message)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form className='form-signUp' onSubmit={handleSubmit}>
            {error && <div className='error-message'>{error}</div>}
            <input type="text"
                name="nome"
                id="nome_input"
                placeholder='insira o seu nome'
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
            />
            <input type="text"
                name='email'
                id='email_input'
                placeholder='insira o seu email'
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
            />
            <input type="password"
                name="password"
                id="password_input"
                placeholder='****'
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
            />
            <input type="submit"
                value={
                    loading ? ' Enviando...' : 'Enviar'
                }
                disabled={loading}
            />
        </form>
    )
}
