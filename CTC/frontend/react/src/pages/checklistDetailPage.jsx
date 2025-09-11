import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { BackBtn } from "../components/backBtn.jsx";
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

  const fetchData = () => {
    fetch(`${API_URL}/API/checklist/${id}`)
      .then(r => r.json())
      .then(resp => {
        setData(resp);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [API_URL, id]);

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
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        descricao: criterioDescricao,
        classificacao: "N/A", // Default value
        id_checklist: Number(id)
      })
    });
    if (res.status === 201) {
      alert("Critério criado");
      fetchData(); // Refresh data
      setCriterioDescricao("");
    } else {
      alert("Erro ao criar critério");
    }
  };

  const handleUpdateCriterio = async (criterioId, newClassificacao) => {
    const res = await fetch(`${API_URL}/API/criterio/${criterioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classificacao: newClassificacao }),
    });

    if (res.ok) {
      // alert("Critério atualizado");
      fetchData(); // Refresh data to show the change
    } else {
      alert("Erro ao atualizar critério");
    }
  };

  const handleAddProjeto = async (e) => {
    e.preventDefault();
    if (!projetoFormData.nome) return alert("Informe o nome do projeto");
    const res = await fetch(`${API_URL}/API/projeto`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ...projetoFormData, id_checklist: Number(id) })
    });
    if (res.status === 201) {
      alert("Projeto criado com sucesso!");
      fetchData(); // Refresh
      setProjetoFormData({ nome: "", descricao: "", responsavel_nome: "", responsavel_email: "", gestor_email: "" });
    } else {
      alert("Erro ao criar projeto");
    }
  };

  const handleUpdateProjeto = async (e) => {
    e.preventDefault();
    const projetoId = data.projetos[0]?.id_projeto;
    if (!projetoId) return alert("ID do projeto não encontrado.");

    const res = await fetch(`${API_URL}/API/projeto/${projetoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projetoFormData),
    });

    if (res.ok) {
      alert("Projeto atualizado com sucesso!");
      fetchData();
      setIsEditing(false);
    } else {
      alert("Erro ao atualizar projeto.");
    }
  };

  const handleEditClick = () => {
    const projeto = data.projetos[0];
    if (projeto) {
      setProjetoFormData({
        nome: projeto.nome,
        descricao: projeto.descricao,
        responsavel_nome: projeto.responsavel_nome,
        responsavel_email: projeto.responsavel_email,
        gestor_email: projeto.gestor_email,
      });
      setIsEditing(true);
    }
  };


  if (loading) return (<><Header /><div className="container"><p>Carregando...</p></div></>);
  if (!data) return (<><Header /><div className="container"><p>Erro ao carregar dados.</p></div></>);

  const checklist = data.checklist;
  const criterios = data.criterios || [];
  const projetos = data.projetos || [];

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
          {/* Seção de Informações da Checklist */}
          <section className="detail-section info-section">
            <div className="info-header">
              <h3>Informações da Checklist</h3>
            </div>
            <p><strong>Descrição:</strong> {checklist.descricao}</p>
            <p><strong>Criador (id):</strong> {checklist.criado_por}</p>
            <p><strong>Data criação:</strong> {new Date(checklist.criado_em).toLocaleDateString()}</p>
          </section>

          {/* Seção de Critérios */}
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
                    {criterios.map(c => (
                      <tr key={c.id_criterio}>
                        <td>{c.id_criterio}</td>
                        <td>{c.descricao}</td>
                        <td className="radio-cell">
                          <input id={`sim-${c.id_criterio}`} type="radio" name={`criterio-${c.id_criterio}`} checked={c.classificacao === 'SIM'} onChange={() => handleUpdateCriterio(c.id_criterio, 'SIM')} />
                          <label htmlFor={`sim-${c.id_criterio}`}>SIM</label>
                        </td>
                        <td className="radio-cell">
                          <input id={`nao-${c.id_criterio}`} type="radio" name={`criterio-${c.id_criterio}`} checked={c.classificacao === 'NAO'} onChange={() => handleUpdateCriterio(c.id_criterio, 'NAO')} />
                          <label htmlFor={`nao-${c.id_criterio}`}>NÃO</label>
                        </td>
                        <td className="radio-cell">
                          <input id={`na-${c.id_criterio}`} type="radio" name={`criterio-${c.id_criterio}`} checked={c.classificacao === 'N/A'} onChange={() => handleUpdateCriterio(c.id_criterio, 'N/A')} />
                          <label htmlFor={`na-${c.id_criterio}`}>N/A</label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <form className="form-inline" onSubmit={handleAddCriterio}>
              <input placeholder="Descrição do novo critério" value={criterioDescricao} onChange={(e) => setCriterioDescricao(e.target.value)} />
              <button className="primary-btn" type="submit">Adicionar Critério</button>
            </form>
          </section>

          {/* Seção de Projetos */}
          <section className="detail-section projetos-section">
            <div className="info-header">
              <h3>Projeto</h3>
              {projetos.length > 0 && !isEditing && (
                <button className="primary-btn" onClick={handleEditClick}>Editar Projeto</button>
              )}
            </div>
            {projetos.length > 0 ? (
              isEditing ? (
                renderProjetoForm(handleUpdateProjeto, true)
              ) : (
                <div className="projetos-grid">
                  {projetos.map(p => (
                    <div className="projeto-card" key={p.id_projeto}>
                      <h4>{p.nome}</h4>
                      <p>{p.descricao}</p>
                      <p className="responsavel-info"><small>{p.responsavel_nome} • {p.responsavel_email}</small></p>
                      <p className="responsavel-info"><small>Gestor: {p.gestor_email}</small></p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              showCreateForm ? (
                renderProjetoForm(handleAddProjeto, false)
              ) : (
                <div className="text-center">
                  <p>Nenhum projeto associado a esta checklist.</p>
                  <button className="primary-btn" onClick={() => setShowCreateForm(true)}>Criar Novo Projeto</button>
                </div>
              )
            )}
          </section>
        </div>
      </main>
    </>
  );
}
