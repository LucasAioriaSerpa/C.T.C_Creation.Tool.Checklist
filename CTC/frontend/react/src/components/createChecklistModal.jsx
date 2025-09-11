import React, { useState } from "react";
import "../css/createChecklistModal.css";
import { createChecklist } from "../utils/checklistForms.jsx";
import authService from "../utils/auth/authService.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateChecklistModal({ onClose, onCreated }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [nomeProjeto, setNomeProjeto] = useState("");
    const [descricaoProjeto, setDescricaoProjeto] = useState("");
    const [responsavelNome, setResponsavelNome] = useState("");
    const [responsavelEmail, setResponsavelEmail] = useState("");
    const [gestorEmail, setGestorEmail] = useState("");
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
                criado_por: Number(userId),
                projeto: {
                    nome: nomeProjeto,
                    descricao: descricaoProjeto,
                    responsavel_nome: responsavelNome,
                    responsavel_email: responsavelEmail,
                    gestor_email: gestorEmail
                }
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
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)} required
                    />
                    <label>Descrição</label>
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    <div className="add-projeto-form">
                        <h4>Adicionar novo projeto</h4>
                        <div className="projeto-form-row">
                            <input
                                name="nome_projeto"
                                placeholder="Nome do projeto"
                                value={nomeProjeto}
                                onChange={(e) => setNomeProjeto(e.target.value)} required
                            />
                            <textarea
                                name="descricaoProjeto"
                                placeholder="Descrição do projeto"
                                value={descricaoProjeto}
                                onChange={(e) => setDescricaoProjeto(e.target.value)}
                            />
                            <div className="form-row">
                                <input
                                    name="responsavel_nome"
                                    placeholder="Responsável nome"
                                    value={responsavelNome}
                                    onChange={(e) => setResponsavelNome(e.target.value)} required
                                />
                                <input
                                    name="responsavel_email"
                                    type="email"
                                    placeholder="Responsável email"
                                    value={responsavelEmail}
                                    onChange={(e) => setResponsavelEmail(e.target.value)} required
                                />
                            </div>
                            <input
                                name="gestor_email"
                                type="email"
                                placeholder="Gestor email"
                                value={gestorEmail}
                                onChange={(e) => setGestorEmail(e.target.value)} required
                            />
                        </div>
                    </div>

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
