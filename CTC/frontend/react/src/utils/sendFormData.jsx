
export async function SendFormData(formData) {
    try {
        const API_URL = import.meta.env.VITE_API_URL
        const requestBody = JSON.stringify(formData)
        const response = await fetch(`${API_URL}/API/sendFormData`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: requestBody,
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error ao enviar os dados')
        }
        const responseData = await response.json()
        console.log('Dados enviados: ', responseData)
        return responseData
    } catch (error) {
        console.error('Falha ao enviar os dados: ', error)
        throw error
    }
}
