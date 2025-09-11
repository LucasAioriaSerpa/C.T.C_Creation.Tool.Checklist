import React from "react";
import "../css/header.css";
import { useNavigate } from "react-router-dom";
import authService from "../utils/auth/authService";

export default function Header() {
  const navigate = useNavigate()
  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>Checklist Manager</h1>
        <div className="user-menu">
          <span>Olá, {authService.getUserNome()}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}