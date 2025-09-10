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

  // form criterio
  const [criterioDescricao, setCriterioDescricao] = useState("");
  const [criterioClassificacao, setCriterioClassificacao] = useState("");

  // form projeto
  const [projetoNome, setProjetoNome] = useState("");
  const [projetoDescricao, setProjetoDescricao] = useState("");
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelEmail, setResponsavelEmail] = useState("");
  const [gestorEmail, setGestorEmail] = useState("");

  useEffect(() => {
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
        classificacao: criterioClassificacao,
        id_checklist: Number(id)
      })
    });
    if (res.status === 201) {
      alert("Critério criado");
      const updated = await (await fetch(`${API_URL}/API/checklist/${id}`)).json();
      setData(updated);
      setCriterioDescricao("");
      setCriterioClassificacao("");
    } else {
      alert("Erro ao criar critério");
    }
  };

  const handleAddProjeto = async (e) => {
    e.preventDefault();
    if (!projetoNome) return alert("Informe o nome do projeto");
    const res = await fetch(`${API_URL}/API/projeto`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        nome: projetoNome,
        descricao: projetoDescricao,
        responsavel_nome: responsavelNome,
        responsavel_email: responsavelEmail,
        gestor_email: gestorEmail
      })
    });
    if (res.status === 201) {
      alert("Projeto criado");
      const updated = await (await fetch(`${API_URL}/API/checklist/${id}`)).json();
      setData(updated);
      setProjetoNome(""); setProjetoDescricao(""); setResponsavelNome(""); setResponsavelEmail(""); setGestorEmail("");
    } else {
      alert("Erro ao criar projeto");
    }
  };

  if (loading) return (<><Header /><div className="container"><p>Carregando...</p></div></>);
  if (!data) return (<><Header /><div className="container"><p>Erro ao carregar dados.</p></div></>);

  const checklist = data.checklist;
  const criterios = data.criterios || [];
  const projetos = data.projetos || [];

  return (
    <>
      <Header />
      <div className="detail-container">
        <div className="detail-header">
          <h1>{checklist.nome}</h1>
          <BackBtn to="/dashboardChecklist" />
          <div>
            <button className="danger-btn" onClick={handleDelete}>Excluir Checklist</button>
          </div>
        </div>

        <section className="detail-section">
          <h3>Informações da Checklist</h3>
          <p><strong>Descrição:</strong> {checklist.descricao}</p>
          <p><strong>Criador (id):</strong> {checklist.criado_por}</p>
          <p><strong>Data criação:</strong> {checklist.criado_em}</p>
        </section>

        <section className="detail-section">
          <h3>Critérios</h3>
          {criterios.length === 0 && <p>Nenhum critério cadastrado.</p>}
          <ul className="criterios-list">
            {criterios.map(c => (
              <li key={c.id_criterio}>
                <strong>{c.classificacao || "—"}</strong> — {c.descricao}
              </li>
            ))}
          </ul>

          <form className="form-inline" onSubmit={handleAddCriterio}>
            <input placeholder="Descrição do critério" value={criterioDescricao} onChange={(e)=>setCriterioDescricao(e.target.value)} />
            <input placeholder="Classificação" value={criterioClassificacao} onChange={(e)=>setCriterioClassificacao(e.target.value)} />
            <button className="primary-btn" type="submit">Adicionar Critério</button>
          </form>
        </section>

        <section className="detail-section">
          <h3>Projetos (Tabela projeto)</h3>
          {projetos.length === 0 && <p>Nenhum projeto cadastrado.</p>}
          <div className="projetos-grid">
            {projetos.map(p => (
              <div className="projeto-card" key={p.id_projeto}>
                <h4>{p.nome}</h4>
                <p>{p.descricao}</p>
                <p><small>{p.responsavel_nome} • {p.responsavel_email}</small></p>
              </div>
            ))}
          </div>

          <h4>Adicionar projeto</h4>
          <form className="form-block" onSubmit={handleAddProjeto}>
            <input placeholder="Nome do projeto" value={projetoNome} onChange={(e)=>setProjetoNome(e.target.value)} required />
            <textarea placeholder="Descrição" value={projetoDescricao} onChange={(e)=>setProjetoDescricao(e.target.value)} />
            <input placeholder="Responsável nome" value={responsavelNome} onChange={(e)=>setResponsavelNome(e.target.value)} />
            <input placeholder="Responsável email" value={responsavelEmail} onChange={(e)=>setResponsavelEmail(e.target.value)} />
            <input placeholder="Gestor email" value={gestorEmail} onChange={(e)=>setGestorEmail(e.target.value)} />
            <div style={{display:'flex', gap:10, marginTop:8}}>
              <button className="primary-btn" type="submit">Criar Projeto</button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
