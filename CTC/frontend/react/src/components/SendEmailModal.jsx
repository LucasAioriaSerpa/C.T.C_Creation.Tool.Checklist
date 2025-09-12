import React, { useState, useEffect } from 'react';
import '../css/SendEmailModal.css';

const SendEmailModal = ({ onClose, ncData, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (ncData) {
      const subjectText = `Não Conformidade no Critério ${ncData.id_criterio}`;
      const bodyText = `
    Foi identificada uma não conformidade na avaliação da checklist.

    Detalhes:
    - Critério ID: ${ncData.id_criterio}
    - Descrição: ${ncData.descricao}
    - Prazo para correção: ${new Date(ncData.prazo).toLocaleDateString('pt-BR')}
    - Status: ${ncData.status}
      `;
      setSubject(subjectText);
      setBody(bodyText.trim());
    }
  }, [ncData]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient) {
      alert('Por favor, insira o e-mail do destinatário.');
      return;
    }

    const VITE_API_URL = 'http://localhost:5000';
    const API_URL = VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/API/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipiente: recipient,
          assunto: subject,
          message: body,
        }),
      });

      if (res.ok) {
        alert('E-mail enviado com sucesso!');
        if (onSend) {
          onSend();
        }
        onClose();
      } else {
        const errorData = await res.json();
        alert(`Erro ao enviar e-mail: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('Ocorreu um erro ao tentar enviar o e-mail. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Enviar E-mail de Não Conformidade</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSend} className="email-form">
          <div className="form-group">
            <label htmlFor="recipient">Destinatário</label>
            <input
              type="email"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Assunto</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Corpo do E-mail</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="10"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="primary-btn">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEmailModal;
