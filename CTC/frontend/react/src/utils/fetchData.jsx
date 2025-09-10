import authService from "./auth/authService"

const API_URL = import.meta.env.VITE_API_URL

export async function fetchData(endPoint) {
    const URL = `${API_URL}${endPoint}`
    const token = authService.getToken()
    const headers = {
        'Content-Type': 'application/json'
    }
    if (token) { headers['Authorization'] = `Bearer ${token}` }
    const response = await fetch(URL)
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Falha ao receber os dados de ${endPoint}: ${errorText}`)
    }
    try {
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error(`Falha ao parsear JSON de ${endPoint}: ${error.message}`)
    }
}
