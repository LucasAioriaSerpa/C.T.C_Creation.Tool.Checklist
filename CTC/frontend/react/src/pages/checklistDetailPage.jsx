import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { fetchData } from "../utils/fetchData.jsx";
import { BackBtn } from "../components/backBtn.jsx";
import CreateNaoConformidadeModal from "../components/CreateNaoConformidadeModal.jsx";
import ManageNaoConformidadeModal from "../components/ManageNaoConformidadeModal.jsx";
import SendEmailModal from "../components/SendEmailModal.jsx";
import "../css/checklistDetailPage.css";

export default function ChecklistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const VITE_API_URL = 'http://localhost:5000';
  const API_URL = VITE_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [setShowCreateForm] = useState(false);
  const [showNaoConformidadeModal, setShowNaoConformidadeModal] = useState(false);
  const [selectedCriterioId, setSelectedCriterioId] = useState(null);
  const [avaliacaoId, setAvaliacaoId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showManageNaoConformidadeModal, setShowManageNaoConformidadeModal] = useState(false);
  const [selectedNaoConformidade, setSelectedNaoConformidade] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

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
    if (!avaliacaoId) { return alert("Inicie uma avaliação para alterar os critérios."); }
    if (!data?.criterios) { return alert("Dados da checklist não carregados."); }
    if (!['SIM', 'NAO', 'N/A'].includes(newClassificacao)) { return alert("Classificação inválida."); }
    const nao_conformidades_seguro = data.nao_conformidades ?? [];
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
        return alert("Erro ao atualizar critério");
      }
      if (newClassificacao === 'NAO') {
        const existingNc = nao_conformidades_seguro.find(nc => nc.id_criterio === criterioId);
        if (existingNc) {
          setSelectedNaoConformidade(existingNc);
          setShowManageNaoConformidadeModal(true);
        } else {
          setSelectedCriterioId(criterioId);
          setShowNaoConformidadeModal(true);
        }
      }
      fetchChecklistData();
    } catch (error) {
      setData(oldData);
      console.error("Erro ao atualizar critério:", error);
      alert("Erro de conexão! verifique se o servidor está rodando!");
    }
  };

  const handleUpdateProjeto = async (e) => {
    e.preventDefault();
    if (!editingProjectId) return alert("ID do projeto não encontrado.");
    const res = await fetch(`${API_URL}/API/projeto/${editingProjectId}`, {
      method: "PUT",
      body: JSON.stringify(projetoFormData),
      headers: { "Content-Type": "application/json" },
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
            {data.ultima_avaliacao && (
              <p>
                <strong>Última Avaliação:</strong> {new Date(data.ultima_avaliacao).toLocaleDateString()}
              </p>
            )}
            {aderencia !== null && (
              <p>
                <strong>Aderência: </strong>
                <span className={`aderencia-valor-${aderencia >= 0.7 ? 'success' : 'danger'}`}>
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
                          <td className="radio-cell">
                            <input
                              id={`nao-${c.id_criterio}`}
                              type="radio"
                              name={`criterio-${c.id_criterio}`}
                              checked={c.classificacao_resposta === 'NAO'}
                              onChange={() => handleUpdateCriterio(c.id_criterio, 'NAO')}
                            />
                            <label htmlFor={`nao-${c.id_criterio}`}>NÃO</label>
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
          <section className="detail-section nao-conformidade-section">
            <h3>Não Conformidades Registradas</h3>
            {data.nao_conformidades && data.nao_conformidades.length > 0 ? (
              <div className="nc-grid">
                {data.nao_conformidades.map(nc => (
                  <div key={nc.id_nao_conformidade} className="nc-card">
                    <h4>Critério ID: {nc.id_criterio}</h4>
                    <p><strong>Descrição:</strong> {nc.descricao}</p>
                    <p><strong>Prazo:</strong> {new Date(nc.prazo).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {nc.status}</p>
                    <button
                      className="secondary-btn"
                      onClick={() => {
                        setSelectedNaoConformidade(nc);
                        setShowManageNaoConformidadeModal(true);
                      }}
                    >
                      Gerenciar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma não conformidade registrada nesta avaliação.</p>
            )}
          </section>
          <section className="detail-section projetos-section">
            <div className="info-header">
              <h3>Projetos</h3>
            </div>
            {isEditing && renderProjetoForm(handleUpdateProjeto, true)}
            {projetos.length > 0 ? (
              <div className="projetos-grid">
                {projetos.map(p => (
                  <div className="projeto-card" key={p.id_projeto}>
                    <div className="projeto-actions">
                      <button className="secondary-btn" onClick={() => handleEditClick(p)}>Editar</button>
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
          onCreated={(newNc) => {
            setShowNaoConformidadeModal(false);
            setSelectedNaoConformidade(newNc);
            setShowEmailModal(true);
          }}
        />
      )}
      {showManageNaoConformidadeModal && (
        <ManageNaoConformidadeModal
          ncData={selectedNaoConformidade}
          onClose={handleCloseManageModal}
          onOpenEmailModal={(nc) => {
            setShowManageNaoConformidadeModal(false);
            setSelectedNaoConformidade(nc);
            setShowEmailModal(true);
          }}
        />
      )}
      {showEmailModal && (
        <SendEmailModal
          ncData={selectedNaoConformidade}
          onClose={() => setShowEmailModal(false)}
          onSend={() => {
            fetchChecklistData();
          }}
        />
      )}
    </>
  );
}
