import { fetchData } from "./fetchData";

export async function deleteProject(projectId) {
    try {
        const response = await fetchData(`/API/projeto/${projectId}`, {
            method: 'DELETE'
        })
        return response
    } catch (error) {
        throw new Error(error.message || "Erro ao excluir o projeto!")
    }
}
