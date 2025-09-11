import { fetchData } from "./fetchData";

export async function UpdateProject(projectId, updatedData) {
    try {
        const response = await fetchData(`/API/projeto/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: { 'Content-Type': 'application/json' }
        })
        return response
    } catch (error) {
        throw new Error(error.message || "Erro ao editar o projeto!")
    }
}
