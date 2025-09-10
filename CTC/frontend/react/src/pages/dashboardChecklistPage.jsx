import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData.jsx";
import authService from "../utils/auth/authService.jsx";
import ChecklistCard from "../components/checklistCard.jsx";
import Header from "../components/Header.jsx";
import CreateChecklistModal from "../components/createChecklistModal.jsx";
import '../css/dashboardChecklistPage.css';

export default function DashboardChecklistPage() {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/')
    }
    const fetchChecklists = async () => {
      try {
        const data = await fetchData('/API/checklists')
        setChecklists(data.checklists || [])
      } catch (error) {
        console.error("Error ao buscar checklists: ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchChecklists()
  }, [navigate]);

  const abrirChecklist = (id) => {
    navigate(`/checklist/${id}`);
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div style={{display: 'flex', width: '100%', maxWidth: 1200, justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <h1 className="dashboard-title">Checklists</h1>
          <div>
            <button className="primary-btn" onClick={() => setShowModal(true)}>+ Nova Checklist</button>
          </div>
        </div>

        {loading ? <p style={{color:'#ddd'}}>Carregando checklists...</p> : null}

        <div className="dashboard-cards">
          {checklists.map(item => (
            <ChecklistCard
              key={item.id_checklist}
              id={item.id_checklist}
              nome={item.nome}
              descricao={item.descricao}
              dataCriacao={item.criado_em}
              criador={item.criador_nome || item.criado_por}
              btnAbrir={() => abrirChecklist(item.id_checklist)}
            />
          ))}

          {checklists.length === 0 && !loading && (
            <div className="empty-state">
              <p>Nenhuma checklist encontrada. Crie a primeira!</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CreateChecklistModal
          onClose={() => setShowModal(false)}
          onCreated={(newId) => {
            setShowModal(false);
            navigate(`/checklist/${newId}/setup`);
          }}
        />
      )}
    </>
  );
}
