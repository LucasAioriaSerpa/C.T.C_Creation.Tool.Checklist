import React, { useState } from "react";
import { fetchData } from "../utils/fetchData";
import '../css/createChecklistModal.css'; // Reutilize o CSS

export default function ManageNaoConformidadeModal({ ncData, onClose}) {
    const [loading, setLoading] = useState(false);
    const [descricao] = useState(ncData.descricao);
    const [prazo, setPrazo] = useState(ncData.prazo);
    const [status, setStatus] = useState(ncData.status);
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            prazo,
            status,
        };
        try {
            const res = await fetchData(`/API/naoconformidade/${ncData.id_nao_conformidade}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                onClose();
            } else {
                alert(`Erro ao atualizar: ${data.message}`);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na comunicação com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmail = async () => {
        setLoading(true);
        const gestorEmail = 'email-do-gestor-do-projeto@exemplo.com'; // **Substitua com o email do gestor**
        const subject = `Não Conformidade no Critério ${ncData.id_criterio}`;
        const body = `
            Olá,
            Uma não conformidade foi identificada na avaliação da checklist.
            Descrição: ${descricao}
            Prazo: ${prazo}
            Status: ${status}
            Por favor, tome as medidas necessárias.
            Atenciosamente,
            Equipe de Auditoria
        `;
        try {
            const res = await fetchData('/API/email/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: gestorEmail, subject, body }),
            });
            const data = await res.json();
            alert(data.message);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            alert("Erro ao enviar email.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h2>Gerenciar Não Conformidade</h2>
                <form onSubmit={handleUpdate}>
                    <p>ID da Não Conformidade: <strong>{ncData.id_nao_conformidade}</strong></p>
                    <label>Descrição</label>
                    <textarea value={descricao} disabled />
                    <label>Prazo de Resolução</label>
                    <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} required />
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="pendente">Pendente</option>
                        <option value="em-progresso">Em Progresso</option>
                        <option value="concluido">Concluído</option>
                    </select>
                    <div className="modal-actions">
                        <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="button" className="secondary-btn" onClick={handleEmail} disabled={loading}>
                            Enviar Email
                        </button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
