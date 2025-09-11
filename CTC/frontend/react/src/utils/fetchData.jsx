const API_URL = import.meta.env.VITE_API_URL

export const fetchData = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Falha ao receber os dados de ${endpoint}: ${errorData.message}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
};
