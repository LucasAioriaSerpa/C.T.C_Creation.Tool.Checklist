import React, { useState } from "react";
import "../css/createChecklistModal.css";
import { createChecklist } from "../utils/checklistForms.jsx";

export default function CreateChecklistModal({ onClose, onCreated }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [criadoPor, setCriadoPor] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome || !criadoPor) {
            alert("Preencha nome e o ID do criador (criado_por)");
            return;
        }

        setLoading(true);
        try {
            const data = await createChecklist({
                nome,
                descricao,
                criado_por: Number(criadoPor)
            });

            onCreated(data.id_checklist); 
            onClose(); 

        } catch (error) {
            alert(error.message || "Erro ao criar checklist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h2>Criar nova Checklist</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome</label>
                    <input value={nome} onChange={(e) => setNome(e.target.value)} required />

                    <label>Descrição</label>
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

                    <label>ID do Criador (criado_por)</label>
                    <input type="number" value={criadoPor} onChange={(e) => setCriadoPor(e.target.value)} placeholder="ex: 1" required />

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? "Criando..." : "Criar e configurar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
