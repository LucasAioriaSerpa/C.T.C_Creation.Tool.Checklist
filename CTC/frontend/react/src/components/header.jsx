import React from "react";
import "../css/header.css";

export default function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>Checklist Manager</h1>
        <div className="user-menu">
          <span>Olá, Usuário</span>
        </div>
      </div>
    </header>
  );
}