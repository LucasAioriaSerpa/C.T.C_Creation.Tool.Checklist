import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function ChecklistSetupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div style={{maxWidth:1100, margin:'20px auto', padding:16}}>
        <h2>Configurar Checklist #{id}</h2>
        <p>Nesta tela você pode:</p>
        <ul>
          <li>Cadastrar um projeto (será salvo na tabela <code>projeto</code>).</li>
          <li>Adicionar critérios para a checklist (você pode fazer isso também na página de detalhe).</li>
        </ul>

        <button className="primary-btn" onClick={() => navigate(`/checklist/${id}`)}>Ir para detalhes da checklist</button>
      </div>
    </>
  );
}
