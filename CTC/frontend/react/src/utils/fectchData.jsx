
export async function fetchData(endPoint) {
    try {
        const API_URL = import.meta.env.VITE_API_URL
        const response = await fetch(`${API_URL}${endPoint}`)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error ao enviar os dados')
        }
        return await response.json()
    } catch (error) {
        console.error(`Falha ao receber os dados de ${endPoint}: `, error)
        throw error
    }
}
