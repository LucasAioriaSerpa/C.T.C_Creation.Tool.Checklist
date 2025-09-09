
export async function SendData(endPoint, data) {
    try {
        const API_URL = import.meta.env.VITE_API_URL
        const requestBody = JSON.stringify(data)
        const response = await fetch(`${API_URL}${endPoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Erro ao enviar os dados!')
        }
        const responseData = await response.json()
        console.log(`Dados enviados para ${endPoint}`, responseData)
        return responseData
    } catch (error) {
        console.error(`Falha ao enviar os dados para ${endPoint}: `, error)
        throw error
    }
}
