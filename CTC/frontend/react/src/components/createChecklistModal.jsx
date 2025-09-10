import React, { useState } from "react";
import "../css/createChecklistModal.css";
import { createChecklist } from "../utils/checklistForms.jsx";
import authService from "../utils/auth/authService.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateChecklistModal({ onClose, onCreated }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = authService.getUserId()
        if (!userId) {
            alert("Erro: ID do usuário não encontrado. Por favor, faça login novamente!")
            navigate('/')
            return
        }
        if (!nome) {
            alert("Por favor, preencha o nome da checklist!")
            return
        }
        setLoading(true)
        try {
            const data = await createChecklist({
                nome,
                descricao,
                criado_por: Number(userId)
            })
            onCreated(data.id_checklist)
            onClose()
        } catch (error) {
            alert(error.message || "Erro ao criar checklist")
        } finally {
            setLoading(false)
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
