import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import "../css/criteriosPage.css";

export default function ProjectAndCriteriaPage() {
  const { id } = useParams(); // id da checklist criada
  const VITE_API_URL = 'http://localhost:5000';
  const API_URL = VITE_API_URL;
  const navigate = useNavigate();

  // Projeto
  const [projeto, setProjeto] = useState({
    nome: "",
    descricao: "",
    responsavel_nome: "",
    responsavel_email: "",
    gestor_email: ""
  });

  // Critérios
  const [criterios, setCriterios] = useState([]);
  const [criterioTemp, setCriterioTemp] = useState({ descricao: "", classificacao: "" });

  const handleProjetoChange = (e) => {
    setProjeto({ ...projeto, [e.target.name]: e.target.value });
  };

  const handleCriterioChange = (e) => {
    setCriterioTemp({ ...criterioTemp, [e.target.name]: e.target.value });
  };

  const adicionarCriterio = () => {
    if (criterioTemp.descricao && criterioTemp.classificacao) {
      setCriterios([...criterios, criterioTemp]);
      setCriterioTemp({ descricao: "", classificacao: "" });
    }
  };

  const salvarTudo = async () => {
    // Salvar projeto
    await fetch(`${API_URL}/API/projeto/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projeto)
    });

    // Salvar critérios
    for (let c of criterios) {
      await fetch(`${API_URL}/API/criterio/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...c, id_checklist: id })
      });
    }

    navigate(`/checklist/${id}`);
  };

  return (
    <>
      <Header />
      <div className="project-criteria-container">

        <div className="form-section">
          <h2>Projeto</h2>
          <input type="text" name="nome" placeholder="Nome do Projeto" value={projeto.nome} onChange={handleProjetoChange} required />
          <textarea name="descricao" placeholder="Descrição" value={projeto.descricao} onChange={handleProjetoChange} required />
          <input type="text" name="responsavel_nome" placeholder="Responsável" value={projeto.responsavel_nome} onChange={handleProjetoChange} required />
          <input type="email" name="responsavel_email" placeholder="Email do Responsável" value={projeto.responsavel_email} onChange={handleProjetoChange} required />
          <input type="email" name="gestor_email" placeholder="Email do Gestor" value={projeto.gestor_email} onChange={handleProjetoChange} required />
        </div>

        <div className="form-section">
          <h2>Critérios</h2>
          <div className="criterio-form">
            <input type="text" name="descricao" placeholder="Descrição" value={criterioTemp.descricao} onChange={handleCriterioChange} />
            <select name="classificacao" value={criterioTemp.classificacao} onChange={handleCriterioChange}>
              <option value="">Classificação</option>
              <option value="obrigatório">Obrigatório</option>
              <option value="opcional">Opcional</option>
            </select>
            <button type="button" onClick={adicionarCriterio}>Adicionar</button>
          </div>

          <ul className="criterio-lista">
            {criterios.map((c, i) => (
              <li key={i}>{c.descricao} - {c.classificacao}</li>
            ))}
          </ul>
        </div>

        <button className="btn-salvar" onClick={salvarTudo}>Salvar e Finalizar</button>
      </div>
    </>
  );
}
