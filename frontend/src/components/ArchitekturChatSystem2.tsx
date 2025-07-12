import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const ArchitekturChatSystem2: React.FC = () => {
  const { theme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mermaidChart = `
sequenceDiagram
    participant Frontend
    participant Backend
    participant MongoDB
    participant Ollama
    participant ElevenLabs

    %% Text-Chat
    note over Frontend,ElevenLabs: Text-Chat
    Frontend->>Backend: Sendet Text-Nachricht
    Backend->>MongoDB: Speichert Nachricht
    Backend->>Ollama: Fragt LLM
    Ollama-->>Backend: LLM Antwort
    Backend->>MongoDB: Speichert Antwort
    Backend-->>Frontend: Zeigt Antwort

    %% Sprach-Chat
    note over Frontend,ElevenLabs: Sprach-Chat
    Frontend->>Backend: Sendet Sprachaufnahme
    Backend->>MongoDB: Speichert Nachricht
    Backend->>Ollama: Fragt LLM
    Ollama-->>Backend: LLM Antwort
    Backend->>MongoDB: Speichert Antwort
    Backend-->>Frontend: Sendet Text
    Frontend->>ElevenLabs: Text zu Sprache
    ElevenLabs-->>Frontend: Spielt Audio

    %% Historie
    note over Frontend,ElevenLabs: Chat-Historie
    Frontend->>Backend: Fragt Chat-Historie
    Backend->>MongoDB: Lädt Verlauf
    MongoDB-->>Backend: Sendet Verlauf
    Backend-->>Frontend: Zeigt Historie
  `;

  return (
    <div className="service-detail-container">
      <h1><span>🏗️</span> <span className="gradient-text">GameCompass Chatbot Architektur</span></h1>
      <p className="subtitle">Detaillierte Sequenzdiagramm-Darstellung der Chatbot-Architektur</p>
      
      <div className="section">
        <h2>📋 Sequenzdiagramm</h2>
        <div 
          onClick={() => setIsPopupOpen(true)}
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '2px solid transparent',
            borderRadius: '8px',
            padding: '10px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`;
            e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '2px solid transparent';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Klicken zum Vergrößern"
        >
          <Mermaid chart={mermaidChart} theme={theme} />
          <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
            🔍 Klicken zum Vergrößern
          </p>
        </div>
      </div>

      <div className="section">
        <h2>🧩 Komponenten</h2>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Frontend</strong></td>
                <td>React/Vite Anwendung mit Text- und Spracheingabe</td>
              </tr>
              <tr>
                <td><strong>Backend</strong></td>
                <td>Express.js Server für API-Endpunkte</td>
              </tr>
              <tr>
                <td><strong>MongoDB</strong></td>
                <td>Speichert Chat-Verläufe und Nachrichten</td>
              </tr>
              <tr>
                <td><strong>Ollama</strong></td>
                <td>LLM für KI-Antworten</td>
              </tr>
              <tr>
                <td><strong>ElevenLabs</strong></td>
                <td>Text-to-Speech Konvertierung</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🌐 API-Endpunkte</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>📤 POST /api/chat</h4>
            <p>Sendet Chat-Nachrichten und verarbeitet sowohl Text- als auch Spracheingaben</p>
          </div>
          
          <div className="method-card">
            <h4>📜 GET /api/chat/history/[sessionId]</h4>
            <p>Lädt die vollständige Chat-Historie für eine bestimmte Session</p>
          </div>
          
          <div className="method-card">
            <h4>🗑️ DELETE /api/chat/history/[sessionId]</h4>
            <p>Löscht die Chat-Historie einer Session vollständig</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Chat-Modi</h2>
        <div className="subsection">
          <h3>💬 Text-Chat</h3>
          <ul className="relationships-list">
            <li>Frontend sendet Textnachricht an Backend</li>
            <li>Backend speichert Nachricht in MongoDB</li>
            <li>Backend fragt Ollama LLM nach Antwort</li>
            <li>LLM-Antwort wird gespeichert und an Frontend zurückgesendet</li>
            <li>Frontend zeigt Antwort im Chat-Interface an</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>🎤 Sprach-Chat</h3>
          <ul className="relationships-list">
            <li>Frontend sendet Sprachaufnahme an Backend</li>
            <li>Backend konvertiert Sprache zu Text und speichert in MongoDB</li>
            <li>Backend fragt Ollama LLM nach Antwort</li>
            <li>LLM-Antwort wird gespeichert und als Text an Frontend gesendet</li>
            <li>Frontend sendet Text an ElevenLabs für Text-to-Speech</li>
            <li>ElevenLabs konvertiert Text zu Audio und Frontend spielt es ab</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>📋 Chat-Historie</h3>
          <ul className="relationships-list">
            <li>Frontend fragt Chat-Historie vom Backend an</li>
            <li>Backend lädt Verlauf aus MongoDB</li>
            <li>MongoDB sendet kompletten Chatverlauf zurück</li>
            <li>Backend leitet Historie an Frontend weiter</li>
            <li>Frontend zeigt vollständige Historie im Interface an</li>
          </ul>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setIsPopupOpen(false)}
        >
          <div 
            style={{
              position: 'relative',
              width: '90vw',
              height: '80vh',
              backgroundColor: theme === 'dark' ? '#2d2e35' : '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              overflow: 'auto',
              border: `3px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                backgroundColor: theme === 'dark' ? '#f19115' : '#5c8791',
                color: theme === 'dark' ? '#2d2e35' : '#ffffff',
                border: 'none',
                borderRadius: '50%',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ff6b35' : '#4a6b75';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#f19115' : '#5c8791';
              }}
            >
              ✕
            </button>

            {/* Popup Content */}
            <div style={{ paddingTop: '20px' }}>
              <h2 style={{ 
                color: theme === 'dark' ? '#f19115' : '#5c8791',
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '24px',
              }}>
                🏗️ GameCompass Chatbot Architektur
              </h2>
              <div style={{ 
                transform: 'scale(1.2)', 
                transformOrigin: 'center',
                minHeight: '600px',
              }}>
                <Mermaid chart={mermaidChart} theme={theme} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 