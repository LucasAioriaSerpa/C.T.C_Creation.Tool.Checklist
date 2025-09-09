import React from "react";
import "../css/checklistCard.css";

export default function ChecklistCard({ id, nome, descricao, dataCriacao, criador, btnAbrir }) {
  return (
    <div className="checklist-card">
        <h2 className="checklist-title">{nome}</h2>

        <div className="checklist-field">
        <p className="checklist-label">Descrição:</p>
        <p className="checklist-value">{descricao || "—"}</p>
        </div>

        <div className="checklist-row">
        <div className="checklist-field">
            <p className="checklist-label">Data Criação:</p>
            <p className="checklist-value">{dataCriacao || "—"}</p>
        </div>

        <div className="checklist-field">
            <p className="checklist-label">Criador:</p>
            <p className="checklist-value">{criador || "—"}</p>
        </div>
        </div>

        <button className="checklist-button" onClick={btnAbrir}>Abrir</button>
    </div>
  );
}
