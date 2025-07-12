import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const KiChatModelle: React.FC = () => {
  const { theme } = useTheme();
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const textChatChart = `
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ Frontend
    participant Backend as ⚙️ Backend
    participant ChromaDB as 🔍 ChromaDB
    participant MongoDB as 🗄️ MongoDB
    participant AI as 🤖 AI Provider

    User->>Frontend: "such puzzle spiele"
    Frontend->>Backend: POST /api/chat
    Backend->>ChromaDB: Suche ähnliche Spiele
    ChromaDB-->>Backend: Spiel-IDs
    Backend->>MongoDB: Lade Spiel-Details
    MongoDB-->>Backend: Spiel-Daten
    Backend->>AI: Generiere Antwort (falls nötig)
    AI-->>Backend: KI-Antwort
    Backend-->>Frontend: Chat + Spiele-Liste
    Frontend->>User: Zeigt Empfehlungen
  `;

  const audioChatChart = `
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ AudioChat
    participant Speech as 🎤 Speech API
    participant Backend as ⚙️ Backend
    participant ChromaDB as 🔍 ChromaDB
    participant MongoDB as 🗄️ MongoDB
    participant AI as 🤖 AI Provider
    participant TTS as 🔊 ElevenLabs

    User->>Frontend: Klick Audio Button
    Frontend->>Speech: Starte Aufnahme
    User->>Speech: Spricht "such action spiele"
    Speech-->>Frontend: Text erkannt
    Frontend->>Backend: POST /api/chat
    Backend->>ChromaDB: Suche Spiele
    ChromaDB-->>Backend: Spiel-IDs
    Backend->>MongoDB: Lade Details
    MongoDB-->>Backend: Spiel-Daten
    Backend->>AI: Generiere Antwort
    AI-->>Backend: Text-Antwort
    Backend-->>Frontend: Chat + Spiele
    Frontend->>TTS: Text zu Sprache
    TTS-->>Frontend: Audio-Datei
    Frontend->>User: Spielt Audio ab
  `;

  const providerSwitchChart = `
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ Frontend
    participant Backend as ⚙️ Backend
    participant Ollama as 🐳 Ollama

    User->>Frontend: Wählt Provider
    Frontend->>Backend: POST /api/chat/provider
    Backend->>Ollama: Teste Provider
    Ollama-->>Backend: Verfügbar?
    Backend-->>Frontend: Erfolg/Fehler
    Frontend->>User: Provider gewechselt
  `;

  const openPopup = (popupType: string) => {
    setActivePopup(popupType);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const renderDiagram = (chart: string, title: string, popupType: string) => (
    <div 
      onClick={() => openPopup(popupType)}
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
      <Mermaid chart={chart} theme={theme} />
      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
        🔍 Klicken zum Vergrößern
      </p>
    </div>
  );

  const renderPopup = (chart: string, title: string, popupType: string) => (
    activePopup === popupType && (
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
        onClick={closePopup}
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
            onClick={closePopup}
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
              {title}
            </h2>
            <div style={{ 
              transform: 'scale(1.2)', 
              transformOrigin: 'center',
              minHeight: '600px',
            }}>
              <Mermaid chart={chart} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="service-detail-container">
      <h1><span>🤖</span> <span className="gradient-text">Chat-Systeme & Sprachintegration in GameCompass</span></h1>
      <p className="subtitle">Detaillierte Sequenzdiagramme für Text-Chat, Audio-Chat und KI-Provider-Management</p>
      
      <div className="section">
        <h2>💬 Text Chat System</h2>
        <p>Das Text-Chat-System ermöglicht es Benutzern, über Texteingaben nach Spielen zu suchen und personalisierte Empfehlungen zu erhalten.</p>
        {renderDiagram(textChatChart, '💬 Text Chat System', 'textChat')}
        
        <div className="subsection">
          <h3>🔄 Ablauf des Text-Chats:</h3>
          <ul className="relationships-list">
            <li>Benutzer gibt Suchanfrage ein (z.B. "such puzzle spiele")</li>
            <li>Frontend sendet Anfrage an Backend via POST /api/chat</li>
            <li>Backend durchsucht ChromaDB nach ähnlichen Spielen</li>
            <li>Spiel-Details werden aus MongoDB geladen</li>
            <li>KI-Provider generiert bei Bedarf eine personalisierte Antwort</li>
            <li>Frontend zeigt Empfehlungen und Chat-Antwort an</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🎤 Audio Chat System</h2>
        <p>Das Audio-Chat-System erweitert die Funktionalität um Spracheingabe und -ausgabe für eine natürlichere Benutzerinteraktion.</p>
        {renderDiagram(audioChatChart, '🎤 Audio Chat System', 'audioChat')}
        
        <div className="subsection">
          <h3>🔄 Ablauf des Audio-Chats:</h3>
          <ul className="relationships-list">
            <li>Benutzer klickt Audio-Button und spricht Anfrage</li>
            <li>Speech API wandelt Sprache in Text um</li>
            <li>Gleicher Suchprozess wie beim Text-Chat</li>
            <li>KI-Antwort wird über ElevenLabs in Sprache umgewandelt</li>
            <li>Audio-Antwort wird dem Benutzer abgespielt</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🔄 KI-Provider Wechsel</h2>
        <p>Das System ermöglicht flexiblen Wechsel zwischen verschiedenen KI-Providern für optimale Antwortqualität.</p>
        {renderDiagram(providerSwitchChart, '🔄 KI-Provider Wechsel', 'providerSwitch')}
        
        <div className="subsection">
          <h3>⚙️ Provider-Wechsel-Ablauf:</h3>
          <ul className="relationships-list">
            <li>Benutzer wählt neuen KI-Provider aus</li>
            <li>Frontend sendet Provider-Wechsel-Anfrage an Backend</li>
            <li>Backend testet Verfügbarkeit des gewählten Providers</li>
            <li>System bestätigt erfolgreichen Wechsel oder meldet Fehler</li>
            <li>Nachfolgende Chat-Anfragen verwenden den neuen Provider</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🎯 System-Features</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 Intelligente Suche</h4>
            <ul>
              <li>Vektor-basierte Ähnlichkeitssuche in ChromaDB</li>
              <li>Semantisches Verständnis von Gaming-Begriffen</li>
              <li>Kontextuelle Spielempfehlungen</li>
            </ul>
          </div>
          
          <div className="method-card">
            <h4>🎤 Sprach-Integration</h4>
            <ul>
              <li>Speech-to-Text Erkennung</li>
              <li>ElevenLabs Text-to-Speech Synthese</li>
              <li>Natürliche Sprachinteraktion</li>
            </ul>
          </div>
          
          <div className="method-card">
            <h4>🤖 Multi-Provider Support</h4>
            <ul>
              <li>Flexible KI-Provider-Auswahl</li>
              <li>Fallback-Mechanismen</li>
              <li>Performance-optimierte Antworten</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Render all popups */}
      {renderPopup(textChatChart, '💬 Text Chat System', 'textChat')}
      {renderPopup(audioChatChart, '🎤 Audio Chat System', 'audioChat')}
      {renderPopup(providerSwitchChart, '🔄 KI-Provider Wechsel', 'providerSwitch')}
    </div>
  );
}; 