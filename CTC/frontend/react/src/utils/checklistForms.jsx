
export async function createChecklist(data) {
    try {
        const VITE_API_URL = 'http://localhost:5000';
        const API_URL = VITE_API_URL;
        const response = await fetch(`${API_URL}/API/checklist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao criar checklist");
        }

        const responseData = await response.json();
        console.log("Checklist criada: ", responseData);
        return responseData;

    } catch (error) {
        console.error("Falha ao criar checklist: ", error);
        throw error;
    }
}
