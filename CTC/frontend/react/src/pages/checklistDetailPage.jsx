import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { fetchData } from "../utils/fetchData.jsx";
import { BackBtn } from "../components/backBtn.jsx";
import CreateNaoConformidadeModal from "../components/CreateNaoConformidadeModal.jsx";
import ManageNaoConformidadeModal from "../components/ManageNaoConformidadeModal.jsx";
import authService from "../utils/auth/authService.jsx";
import "../css/checklistDetailPage.css";

export default function ChecklistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const VITE_API_URL = 'http://localhost:5000';
  const API_URL = VITE_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNaoConformidadeModal, setShowNaoConformidadeModal] = useState(false);
  const [selectedCriterioId, setSelectedCriterioId] = useState(null);
  const [avaliacaoId, setAvaliacaoId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showManageNaoConformidadeModal, setShowManageNaoConformidadeModal] = useState(false);
  const [selectedNaoConformidade, setSelectedNaoConformidade] = useState(null);

  // form criterio
  const [criterioDescricao, setCriterioDescricao] = useState("");

  // form projeto
  const [projetoFormData, setProjetoFormData] = useState({
    nome: "",
    descricao: "",
    responsavel_nome: "",
    responsavel_email: "",
    gestor_email: ""
  });

  const handleProjetoFormChange = (e) => {
    const { name, value } = e.target;
    setProjetoFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchChecklistData = async () => {
    try {
      const url = `/API/checklist/${id}${avaliacaoId ? `?id_avaliacao=${avaliacaoId}` : ''}`;
      const responseData = await fetchData(url);
      setData(responseData);
      setLoading(false);
      setAvaliacaoId(responseData.id_avaliacao);
    } catch (error) {
      console.error("Erro ao buscar dados da checklist: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklistData();
  }, [id, avaliacaoId]);

  const handleStartAvaliacao = async (projetoId) => {
    const userId = authService.getUserId();
    if (!userId) {
      return alert("Não foi possível iniciar a avaliação. Usuário não autenticado.");
    }
    if (!projetoId) {
      return alert("Não foi possível iniciar a avaliação. Projeto inválido.");
    }
    try {
      const avaliacao = await fetchData('/API/avaliacao', {
        method: 'POST',
        body: JSON.stringify({
          id_auditor: Number(userId),
          id_projeto: Number(projetoId),
          id_checklist: Number(id)
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      setAvaliacaoId(avaliacao.id_avaliacao);
      alert("Avaliação iniciada com sucesso!");
    } catch (error) {
      console.error("Erro ao iniciar avaliação:", error);
      alert("Erro ao iniciar avaliação.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir essa checklist e todos os dados relacionados?")) return;
    const res = await fetch(`${API_URL}/API/checklist/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Checklist removida.");
      navigate("/dashboardChecklist");
    } else {
      alert("Erro ao deletar checklist");
    }
  };

  const handleAddCriterio = async (e) => {
    e.preventDefault();
    if (!criterioDescricao) return alert("Descreva o critério");
    const res = await fetch(`${API_URL}/API/criterio`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao: criterioDescricao,
        classificacao: "N/A",
        id_checklist: Number(id)
      })
    });
    if (res.status === 201) {
      alert("Critério criado");
      fetchChecklistData();
      setCriterioDescricao("");
    } else {
      alert("Erro ao criar critério");
    }
  };

  const handleUpdateCriterio = async (criterioId, newClassificacao) => {
    if (!avaliacaoId) { return alert("Nenhuma avaliação ativa. Clique em 'Avaliar' em um dos projetos para começar."); }
    const oldData = data;
    const newData = {
      ...data,
      criterios: data.criterios.map(c =>
        c.id_criterio === criterioId ? { ...c, classificacao_resposta: newClassificacao } : c
      )
    };
    setData(newData);
    try {
      const res = await fetch(`${API_URL}/API/resposta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_avaliacao: avaliacaoId,
          id_criterio: criterioId,
          classificacao: newClassificacao,
        }),
      });
      if (!res.ok) {
        setData(oldData);
        alert("Erro ao atualizar critério");
      }
    } catch (error) {
      setData(oldData);
      console.error("Erro ao atualizar critério:", error);
      alert("Erro ao atualizar critério");
    }
  };

  const handleAddProjeto = async (e) => {
    e.preventDefault();
    if (!projetoFormData.nome) return alert("Informe o nome do projeto");
    const res = await fetch(`${API_URL}/API/projeto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...projetoFormData, id_checklist: Number(id) })
    });
    if (res.ok) {
      alert("Projeto criado com sucesso!");
      fetchChecklistData();
      setProjetoFormData({ nome: "", descricao: "", responsavel_nome: "", responsavel_email: "", gestor_email: "" });
      setShowCreateForm(false);
    } else {
      alert("Erro ao criar projeto");
    }
  };

  const handleUpdateProjeto = async (e) => {
    e.preventDefault();
    if (!editingProjectId) return alert("ID do projeto não encontrado.");
    const res = await fetch(`${API_URL}/API/projeto/${editingProjectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projetoFormData),
    });
    if (res.ok) {
      alert("Projeto atualizado com sucesso!");
      fetchChecklistData();
      setIsEditing(false);
      setEditingProjectId(null);
    } else {
      alert("Erro ao atualizar projeto.");
    }
  };

  const handleDeleteProjeto = async (projetoId) => {
    if (!projetoId) return alert("Nenhum projeto para excluir!");
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    const response = await fetch(`${API_URL}/API/projeto/${projetoId}`, { method: "DELETE" });
    if (response.ok) {
      alert("Projeto excluido com sucesso!");
      fetchChecklistData();
    } else {
      alert("Erro ao excluir projeto!");
    }
  };

  const handleEditClick = (projeto) => {
    setProjetoFormData({
      nome: projeto.nome,
      descricao: projeto.descricao,
      responsavel_nome: projeto.responsavel_nome,
      responsavel_email: projeto.responsavel_email,
      gestor_email: projeto.gestor_email,
    });
    setEditingProjectId(projeto.id_projeto);
    setIsEditing(true);
    setShowCreateForm(false);
  };

  const handleCloseManageModal = () => {
    setShowManageNaoConformidadeModal(false);
    setSelectedNaoConformidade(null);
    fetchChecklistData();
  };

  if (loading) return (<><Header /><div className="container"><p>Carregando...</p></div></>);
  if (!data) return (<><Header /><div className="container"><p>Erro ao carregar dados.</p></div></>);

  const checklist = data.checklist;
  const criterios = data.criterios || [];
  const projetos = data.projetos || [];
  const aderencia = data.aderencia;
  const nao_conformidades = data.nao_conformidades || [];

  const renderProjetoForm = (submitHandler, isUpdate = false) => (
    <div className="add-projeto-form">
      <h4>{isUpdate ? "Editar projeto" : "Adicionar novo projeto"}</h4>
      <form className="form-block" onSubmit={submitHandler}>
        <input name="nome" placeholder="Nome do projeto" value={projetoFormData.nome} onChange={handleProjetoFormChange} required />
        <textarea name="descricao" placeholder="Descrição" value={projetoFormData.descricao} onChange={handleProjetoFormChange} />
        <div className="form-row">
          <input name="responsavel_nome" placeholder="Responsável nome" value={projetoFormData.responsavel_nome} onChange={handleProjetoFormChange} />
          <input name="responsavel_email" type="email" placeholder="Responsável email" value={projetoFormData.responsavel_email} onChange={handleProjetoFormChange} />
        </div>
        <input name="gestor_email" type="email" placeholder="Gestor email" value={projetoFormData.gestor_email} onChange={handleProjetoFormChange} />
        <div className="form-actions">
          {isUpdate && <button type="button" className="secondary-btn" onClick={() => setIsEditing(false)}>Cancelar</button>}
          <button className="primary-btn" type="submit">{isUpdate ? "Atualizar Projeto" : "Criar Projeto"}</button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <Header />
      <main className="detail-container">
        <div className="detail-header">
          <h1>{checklist.nome}</h1>
          <div className="header-actions">
            <BackBtn to="/dashboardChecklist" />
            <button className="danger-btn" onClick={handleDelete}>Excluir Checklist</button>
          </div>
        </div>
        <div className="detail-content">
          <section className="detail-section info-section">
            <div className="info-header">
              <h3>Informações da Checklist</h3>
            </div>
            <p><strong>Descrição:</strong> {checklist.descricao}</p>
            <p><strong>Criador (id):</strong> {checklist.criado_por}</p>
            <p><strong>Data criação:</strong> {new Date(checklist.criado_em).toLocaleDateString()}</p>
            {aderencia !== null && (
              <p>
                <strong>Aderência:</strong>
                <span className={`aderencia-valor ${aderencia >= 0.7 ? 'success' : 'danger'}`}>
                  {(aderencia * 100).toFixed(2)}%
                </span>
              </p>
            )}
          </section>
          <section className="detail-section criterios-section">
            <h3>Critérios</h3>
            {criterios.length === 0 ? <p>Nenhum critério cadastrado.</p> : (
              <div className="table-wrapper">
                <table className="criterios-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th className="radio-option">SIM</th>
                      <th className="radio-option">NÃO</th>
                      <th className="radio-option">N/A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criterios.length === 0 ? (
                      <tr>
                        <td colSpan="6">Nenhum critério cadastrado.</td>
                      </tr>
                    ) : (criterios.map(c => {
                      const existingNc = nao_conformidades.find(nc => nc.id_criterio === c.id_criterio);
                      const isNcButtonDisabled = c.classificacao_resposta !== 'NAO' || !avaliacaoId || existingNc;
                      return (
                        <tr key={c.id_criterio}>
                          <td>{c.id_criterio}</td>
                          <td>{c.descricao}</td>
                          <td className="radio-cell">
                            <input
                              id={`sim-${c.id_criterio}`}
                              type="radio"
                              name={`criterio-${c.id_criterio}`}
                              checked={c.classificacao_resposta === 'SIM'}
                              onChange={() => handleUpdateCriterio(c.id_criterio, 'SIM')}
                            />
                            <label htmlFor={`sim-${c.id_criterio}`}>SIM</label>
                          </td>
                          <td className="action-cell">
                            <button
                              className="add-nc-btn"
                              onClick={() => {
                                if (!avaliacaoId) { return alert("Nenhuma avaliação ativa. Clique em 'Avaliar' em um dos projetos para começar."); }
                                setSelectedCriterioId(c.id_criterio);
                                setShowNaoConformidadeModal(true);
                              }}
                              disabled={isNcButtonDisabled}
                            >
                              NÃO
                            </button>
                          </td>
                          <td className="radio-cell">
                            <input
                              id={`na-${c.id_criterio}`}
                              type="radio"
                              name={`criterio-${c.id_criterio}`}
                              checked={c.classificacao_resposta === 'N/A'}
                              onChange={() => handleUpdateCriterio(c.id_criterio, 'N/A')}
                            />
                            <label htmlFor={`na-${c.id_criterio}`}>N/A</label>
                          </td>
                        </tr>
                      )
                    }
                  ))}
                  </tbody>
                </table>
              </div>
            )}
            <form className="form-inline" onSubmit={handleAddCriterio}>
              <input type="text" placeholder="Descrição do novo critério" value={criterioDescricao} onChange={(e) => setCriterioDescricao(e.target.value)} />
              <button className="primary-btn" type="submit">Adicionar Critério</button>
            </form>
          </section>
          <section className="detail-section projetos-section">
            <div className="info-header">
              <h3>Projetos</h3>
              <button
                className="primary-btn"
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setIsEditing(false);
                }}
              >
                {showCreateForm ? "Fechar Formulário" : "Criar Projeto"}
              </button>
            </div>
            {showCreateForm && renderProjetoForm(handleAddProjeto, false)}
            {isEditing && renderProjetoForm(handleUpdateProjeto, true)}
            {projetos.length > 0 ? (
              <div className="projetos-grid">
                {projetos.map(p => (
                  <div className="projeto-card" key={p.id_projeto}>
                    <div className="projeto-actions">
                      <button className="secondary-btn" onClick={() => handleEditClick(p)}>Editar</button>
                      <button className="danger-btn" onClick={() => handleDeleteProjeto(p.id_projeto)}>Excluir</button>
                      <button
                        className="primary-btn"
                        onClick={() => handleStartAvaliacao(p.id_projeto)}
                      >
                        Avaliar
                      </button>
                    </div>
                    <h4>{p.nome}</h4>
                    <p>{p.descricao}</p>
                    <p className="responsavel-info"><small>{p.responsavel_nome} • {p.responsavel_email}</small></p>
                    <p className="responsavel-info"><small>Gestor: {p.gestor_email}</small></p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p>Nenhum projeto associado a esta checklist.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      {showNaoConformidadeModal && (
        <CreateNaoConformidadeModal
          idCriterio={selectedCriterioId}
          idAvaliacao={avaliacaoId}
          onClose={() => setShowNaoConformidadeModal(false)}
          onCreated={() => {
            setShowNaoConformidadeModal(false);
            fetchChecklistData();
          }}
        />
      )}
      {showManageNaoConformidadeModal && (
        <ManageNaoConformidadeModal
          ncData={selectedNaoConformidade}
          onClose={handleCloseManageModal}
        />
      )}
    </>
  );
}
