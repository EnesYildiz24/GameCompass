import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const GameCompassVektorSystem: React.FC = () => {
  const { theme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mermaidChart = `
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ Frontend
    participant Backend as ⚙️ Backend
    participant MongoDB as 🗄️ MongoDB
    participant ChromaDB as 🔍 ChromaDB
    participant Ollama as 🤖 Ollama

    User->>Frontend: "puzzle spiele"
    Frontend->>Backend: POST /api/chatpopup/interact
    Backend->>MongoDB: Speichere Chat
    Backend->>ChromaDB: Suche ähnliche Spiele
    ChromaDB-->>Backend: Spiel-IDs
    Backend->>MongoDB: Lade Spiel-Details
    MongoDB-->>Backend: Spiel-Daten
    Backend->>Ollama: Generiere Antwort
    Ollama-->>Backend: AI-Response
    Backend-->>Frontend: Chat + Spiele-Liste
    Frontend->>User: Zeigt Chat + Empfehlungen
  `;

  return (
    <div className="service-detail-container">
      <h1><span>🗄️</span> <span className="gradient-text">GameCompass Vektor-System</span></h1>
      <p className="subtitle">ChromaDB Integration für intelligente Similarity-Search und Empfehlungen</p>

      <div className="section">
        <h2>🔍 Was ist ChromaDB?</h2>
        <p>ChromaDB ist eine Vektor-Datenbank für semantische Suche:</p>
        <ul className="relationships-list">
          <li>✅ Wandelt Text in mathematische Vektoren um</li>
          <li>✅ Findet ähnliche Inhalte durch Vektor-Ähnlichkeit</li>
          <li>✅ Funktioniert auch bei Tippfehlern und Synonymen</li>
          <li>✅ Alternative zu klassischer SQL-Suche</li>
        </ul>
      </div>

      <div className="section">
        <h2>🧮 Wie funktioniert Vektor-Suche?</h2>
        <p><strong>Vergleich: Klassische vs. Vektor-Suche</strong></p>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Suchtyp</th>
                <th>Eingabe</th>
                <th>Ergebnis</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Klassische Suche</td>
                <td>"puzzle spiele"</td>
                <td>✅ Findet exakte Treffer</td>
                <td>Funktioniert</td>
              </tr>
              <tr>
                <td>Klassische Suche</td>
                <td>"puzzel spiele"</td>
                <td>❌ Findet NICHTS</td>
                <td>Tippfehler = Problem</td>
              </tr>
              <tr>
                <td>Vektor-Suche</td>
                <td>"puzzle spiele"</td>
                <td style={{ whiteSpace: 'nowrap' }}>✅ Vektor [0.8, 0.3, 0.9, ...]</td>
                <td>Funktioniert</td>
              </tr>
              <tr>
                <td>Vektor-Suche</td>
                <td>"puzzel spiele"</td>
                <td style={{ whiteSpace: 'nowrap' }}>✅ Vektor [0.7, 0.4, 0.8, ...]</td>
                <td>Tippfehler = Kein Problem!</td>
              </tr>
              <tr>
                <td>Vektor-Suche</td>
                <td>"logic games"</td>
                <td style={{ whiteSpace: 'nowrap' }}>✅ Vektor [0.6, 0.2, 0.9, ...]</td>
                <td>Versteht Kontext!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>💡 Vektor-Magie in Aktion</h2>
        <blockquote>
          <p><strong>🔍 Schritt-für-Schritt Prozess</strong></p>
          <p><strong>🧮 ChromaDB wandelt um zu:</strong> [0.7, 0.4, 0.8, 0.1, 0.9, ...]</p>
          <p><strong>🔍 Findet ähnliche Vektoren:</strong> Portal 2, Tetris, The Witness</p>
          <p><strong>🎯 Ergebnis:</strong> Perfekte Puzzle-Spiele trotz Tippfehler!</p>
        </blockquote>
      </div>

      <div className="section">
        <h2>🔄 System-Workflow</h2>
        
        <h3>Phase 1: Daten-Setup 🏗️</h3>
        <ol>
          <li>Spiele aus RAWG API → MongoDB</li>
          <li>Genres mit Aliases → MongoDB</li>
          <li>Spiele-Texte → ChromaDB Vektoren</li>
        </ol>

        <h3>Phase 2: User-Anfrage 💬</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '20px 0', padding: '20px', backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.05)' : 'rgba(92, 135, 145, 0.05)', borderRadius: '12px' }}>
          
          {/* User Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: theme === 'dark' ? '#f19115' : '#5c8791',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            💬 "puzzel spiele"
          </div>

          {/* Flow Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>↓</span>
              <span style={{ 
                padding: '8px 12px', 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Interest Detection</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>↓</span>
              <span style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f3e5f5', 
                color: '#7b1fa2',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Query Enhancement</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>↓</span>
              <span style={{ 
                padding: '8px 12px', 
                backgroundColor: '#e8f5e8', 
                color: '#388e3c',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>ChromaDB Suche</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>↓</span>
              <span style={{ 
                padding: '8px 12px', 
                backgroundColor: '#fff3e0', 
                color: '#f57c00',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>MongoDB Lookup</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>↓</span>
              <span style={{ 
                padding: '8px 12px', 
                backgroundColor: '#fce4ec', 
                color: '#c2185b',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Ollama Antwort</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>↓</span>
              <span style={{ 
                padding: '8px 12px', 
                backgroundColor: theme === 'dark' ? 'rgba(139, 195, 74, 0.2)' : '#f1f8e9', 
                color: '#689f38',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>🎯 Empfehlungen</span>
            </div>
          </div>
        </div>

        <h3>Phase 3: Technischer Ablauf ⚙️</h3>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Schritt</th>
                <th>Komponente</th>
                <th>Funktion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1️⃣</td>
                <td>MongoDB</td>
                <td>Speichert strukturierte Daten</td>
              </tr>
              <tr>
                <td>2️⃣</td>
                <td>ChromaDB</td>
                <td>Macht semantische Suche</td>
              </tr>
              <tr>
                <td>3️⃣</td>
                <td>Ollama</td>
                <td>Generiert natürliche Antworten</td>
              </tr>
              <tr>
                <td>4️⃣</td>
                <td>System</td>
                <td>Kombiniert alles für Empfehlungen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🛠️ Technologie-Stack</h2>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Zweck</th>
                <th>Rolle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MongoDB</td>
                <td>Strukturierte Spiel-Daten + Konfiguration</td>
                <td>🗄️ Daten-Speicher</td>
              </tr>
              <tr>
                <td>ChromaDB</td>
                <td>Vektor-Embeddings für semantische Suche</td>
                <td>🔍 Intelligente Suche</td>
              </tr>
              <tr>
                <td>Ollama</td>
                <td>LLM für natürliche Gespräche</td>
                <td>🤖 KI-Gespräche</td>
              </tr>
              <tr>
                <td>Express</td>
                <td>API-Backend für Orchestrierung</td>
                <td>⚙️ Backend-Logic</td>
              </tr>
              <tr>
                <td>React</td>
                <td>Frontend für User-Interface</td>
                <td>🖥️ Benutzer-Interface</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>📊 Warum diese Architektur?</h2>
        <blockquote>
          <p><strong>Problem:</strong> Klassische Textsuche ist zu starr</p>
          <p><strong>Lösung:</strong> Vektor-Suche versteht Bedeutung und Kontext</p>
          <p><strong>Ergebnis:</strong> Intelligente Spielempfehlungen auch bei unklaren Anfragen</p>
        </blockquote>
        <p>Das System kombiniert strukturierte Daten (MongoDB) mit semantischer KI (ChromaDB) für optimale Gaming-Beratung! 🚀</p>
      </div>

      <div className="section">
        <h2>📊 Datenfluss-Übersicht</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
          
          {/* Schritt 1: setupPrompts.ts */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
            borderRadius: '12px',
            border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: theme === 'dark' ? '#f19115' : '#5c8791',
                color: theme === 'dark' ? '#2d2e35' : '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                marginRight: '15px'
              }}>
                1
              </div>
              <h3 style={{ margin: '0', color: theme === 'dark' ? '#f19115' : '#5c8791' }}>
                setupPrompts.ts → MongoDB
              </h3>
            </div>
            <div style={{ paddingLeft: '55px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ marginRight: '10px', color: '#8bc34a' }}>├──</span>
                <span>Erstellt Genres mit Aliases</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px', color: '#8bc34a' }}>└──</span>
                <span>Erstellt ChatPrompts für Chatbot</span>
              </div>
            </div>
          </div>

          {/* Schritt 2: RAWG API Import */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(139, 195, 74, 0.1)' : 'rgba(139, 195, 74, 0.1)',
            borderRadius: '12px',
            border: `2px solid #8bc34a`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#8bc34a',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                marginRight: '15px'
              }}>
                2
              </div>
              <h3 style={{ margin: '0', color: '#8bc34a' }}>
                RAWG API Import → MongoDB
              </h3>
            </div>
            <div style={{ paddingLeft: '55px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px', color: '#ff9800' }}>└──</span>
                <span>Lädt Spiele-Daten</span>
              </div>
            </div>
          </div>

          {/* Schritt 3: syncToChroma.ts */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.1)',
            borderRadius: '12px',
            border: `2px solid #9c27b0`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#9c27b0',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                marginRight: '15px'
              }}>
                3
              </div>
              <h3 style={{ margin: '0', color: '#9c27b0' }}>
                syncToChroma.ts → ChromaDB
              </h3>
            </div>
            <div style={{ paddingLeft: '55px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ marginRight: '10px', color: '#2196f3' }}>├──</span>
                <span>Lädt Spiele aus MongoDB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px', color: '#2196f3' }}>└──</span>
                <span>Erstellt Vektor-Dokumente in ChromaDB</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🌐 GameCompass Chatbot Architektur</h2>
        <h3>Sequenzdiagramm</h3>
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
                🌐 GameCompass Chatbot Architektur
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