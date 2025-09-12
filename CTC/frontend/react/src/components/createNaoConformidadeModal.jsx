import React, { useState } from "react";
import { fetchData } from "../utils/fetchData";
import '../css/createChecklistModal.css';

export default function CreateNaoConformidadeModal({ idCriterio, idAvaliacao, onClose, onCreated }) {
    const [prazo, setPrazo] = useState("");
    const [loading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
    if (!idAvaliacao || !idCriterio) {
        alert("Por favor, preencha todos os campos.");
        console.log("idAvaliacao ou idCriterio não fornecido:", { idAvaliacao, idCriterio });
        return;
    }
    const payload = {
        id_avaliacao: idAvaliacao,
        id_criterio: idCriterio,
        prazo: prazo
    };
    console.log("Enviando dados:", payload);
    try {
        const createdNc = await fetchData('/API/naoconformidade', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        alert("Não conformidade registrada com sucesso!");
        onCreated(createdNc);
        onClose();
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na comunicação com o servidor.");
    }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h2>Registrar Não Conformidade</h2>
                <form onSubmit={handleSubmit}>
                    <p>Para o Critério: <strong>{idCriterio}</strong></p>
                    <label>Prazo de Resolução</label>
                    <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} required />
                    <div className="modal-actions">
                        <button type="button" className="secondary-btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
