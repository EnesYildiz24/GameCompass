import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ArchitectureModellProps {
  onNavigate: (page: string) => void;
}

export const ArchitectureModell: React.FC<ArchitectureModellProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [showDiagramPopup, setShowDiagramPopup] = React.useState(false);

  const architectureLayers = [
    {
      name: "Frontend Layer",
      tech: "React + TypeScript + Vite",
      purpose: "🎨 Benutzeroberfläche & Interaktion",
      color: "#61dafb",
      icon: "🖥️"
    },
    {
      name: "Backend Layer", 
      tech: "Node.js + Express.js",
      purpose: "⚙️ API-Server & Geschäftslogik",
      color: "#68a063",
      icon: "🔧"
    },
    {
      name: "Data Layer",
      tech: "MongoDB + ChromaDB", 
      purpose: "📊 Datenspeicherung & Vektorsuche",
      color: "#4db33d",
      icon: "🗄️"
    },
    {
      name: "Payment Layer",
      tech: "Stripe Connect",
      purpose: "💳 Zahlungsabwicklung & Marketplace", 
      color: "#635bff",
      icon: "💰"
    },
    {
      name: "AI/ML Layer",
      tech: "Ollama + ElevenLabs",
      purpose: "🤖 Chatbot & Sprachsynthese",
      color: "#ff6b35", 
      icon: "🧠"
    },
    {
      name: "Security Layer",
      tech: "JWT + OAuth 2.0 + Passport.js",
      purpose: "🔐 Authentifizierung & Autorisierung",
      color: "#9c27b0",
      icon: "🛡️"
    }
  ];

  return (
    <div className="service-detail-container">
      <h1><span>🏗️</span> <span className="gradient-text">GameCompass – Architekturübersicht</span></h1>
      <p className="subtitle">Willkommen zur Architektur-Dokumentation des GameCompass-Projekts.</p>
      
      <div className="section">
        <p>Hier werden alle relevanten Modelle, Diagramme und Konzepte gesammelt, die die interne Struktur und Funktionsweise des Systems dokumentieren.</p>
      </div>

      <div className="section">
        <h2>📋 Inhaltsübersicht</h2>
        
        <div className="subsection">
          <h3>1️⃣ Domänen- & Datenmodell</h3>
          <ul className="relationships-list">
            <li>Beschreibung der Kern-Entitäten und Beziehungen</li>
            <li>Entity-Relationship-Diagramme (ERD)</li>
            <li>Mongoose-Schemas</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>2️⃣ API-Design</h3>
          <ul className="relationships-list">
            <li>Endpunkte für User, Cart, Bestellung, Offer, Bewertung etc.</li>
            <li>REST- und/oder GraphQL-Struktur</li>
            <li>Validierungslogik</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>3️⃣ Prozess- und Ablaufdiagramme</h3>
          <ul className="relationships-list">
            <li>Checkout-Workflow</li>
            <li>User Registration & Authentication Flow</li>
            <li>Payment-Integration mit Stripe</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>4️⃣ Technologie-Stack & Infrastruktur</h3>
          <ul className="relationships-list">
            <li>verwendete Frameworks (React, Node.js, MongoDB, Mongoose, Stripe)</li>
            <li>Deployment-Struktur (z.B. Vercel, Docker, GitLab CI/CD)</li>
            <li>Projektstruktur (Ordner und Module)</li>
          </ul>
          
          {/* Technologie-Architektur Darstellung */}
          <div style={{ marginTop: '20px' }}>
            <h4>🏗️ System-Architektur Übersicht</h4>
            
            {/* Interactive Architecture Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              margin: '20px 0',
              position: 'relative'
            }}>
              {architectureLayers.map((layer, index) => (
                <div
                  key={index}
                  style={{
                    border: `3px solid ${layer.color}`,
                    borderRadius: '15px',
                    padding: '20px',
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(37, 37, 44, 0.8)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => setShowDiagramPopup(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 15px 35px rgba(${layer.color}, 0.3)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Gradient Background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${layer.color}, transparent)`
                  }} />
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{ 
                      fontSize: '24px', 
                      marginRight: '10px' 
                    }}>
                      {layer.icon}
                    </span>
                    <h4 style={{
                      margin: 0,
                      color: layer.color,
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {layer.name}
                    </h4>
                  </div>
                  
                  <div style={{
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(0,0,0,0.3)' 
                      : 'rgba(0,0,0,0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <strong style={{ color: layer.color }}>
                      {layer.tech}
                    </strong>
                  </div>
                  
                  <p style={{
                    margin: '0',
                    fontSize: '14px',
                    color: theme === 'dark' ? '#ffffff' : '#333333',
                    lineHeight: '1.4'
                  }}>
                    {layer.purpose}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Mermaid Diagram Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '30px 0'
            }}>
              <button
                onClick={() => setShowDiagramPopup(true)}
                style={{
                  background: `linear-gradient(135deg, ${theme === 'dark' ? '#f19115' : '#5c8791'}, ${theme === 'dark' ? '#ff6b35' : '#4a6fa5'})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '15px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
              >
                🔍 Detailliertes Architektur-Diagramm anzeigen
              </button>
            </div>
            
            {/* Technologie-Details Tabelle */}
            <div style={{ marginTop: '30px' }}>
              <h4>📊 Technologie-Details</h4>
              <div className="fields-table">
                <table>
                  <thead>
                    <tr>
                      <th>Bereich</th>
                      <th>Technologien</th>
                      <th>Zweck</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Frontend</strong></td>
                      <td>React, TypeScript, Vite</td>
                      <td>Benutzeroberfläche und Interaktion</td>
                    </tr>
                    <tr>
                      <td><strong>Backend</strong></td>
                      <td>Node.js, Express.js</td>
                      <td>API-Server und Geschäftslogik</td>
                    </tr>
                    <tr>
                      <td><strong>Datenbank</strong></td>
                      <td>MongoDB, ChromaDB</td>
                      <td>Datenspeicherung und Vektorsuche</td>
                    </tr>
                    <tr>
                      <td><strong>Payments</strong></td>
                      <td>Stripe Connect</td>
                      <td>Zahlungsabwicklung und Marketplace</td>
                    </tr>
                    <tr>
                      <td><strong>KI/ML</strong></td>
                      <td>Ollama, ElevenLabs</td>
                      <td>Chatbot und Sprachsynthese</td>
                    </tr>
                    <tr>
                      <td><strong>Security</strong></td>
                      <td>JWT, OAuth 2.0, Passport.js</td>
                      <td>Authentifizierung und Autorisierung</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="subsection">
          <h3>5️⃣ Erweiterungen & Zukunftspläne</h3>
          <ul className="relationships-list">
            <li>Skalierungsmöglichkeiten (Multi-Currency, Ländersupport)</li>
            <li>Soft-Delete, Auditing, DSGVO</li>
            <li>Microservices / Event-Sourcing Optionen</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Verfügbare Dokumentationen</h2>
        <div className="methods-grid">
          <div 
            className="method-card"
            onClick={() => onNavigate('verkaufs-logik-kyc')}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h4>💳 Verkaufs Logik mit KYC Integration</h4>
            <p>Detaillierte Dokumentation der Verkaufsprozesse mit Know Your Customer (KYC) Verifizierung und Compliance-Anforderungen</p>
            <div style={{ 
              marginTop: '15px', 
              color: theme === 'dark' ? '#f19115' : '#5c8791',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              → Zur Dokumentation
            </div>
          </div>
          
          <div 
            className="method-card"
            onClick={() => onNavigate('gamecompass-datenmodell')}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h4>🗄️ GameCompass – Datenmodell</h4>
            <p>Umfassende Darstellung der Datenbank-Architektur, Entity-Relationship-Diagramme und Datenfluss-Modelle</p>
            <div style={{ 
              marginTop: '15px', 
              color: theme === 'dark' ? '#f19115' : '#5c8791',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              → Zur Dokumentation
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <div style={{
          padding: '20px',
          backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
          borderRadius: '12px',
          border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
          marginBottom: '20px'
        }}>
          <p style={{ 
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#f19115' : '#5c8791'
          }}>
            Stand dieser Dokumentation: 17. Juni 2025
          </p>
        </div>
        
        <div style={{
          padding: '20px',
          backgroundColor: theme === 'dark' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.1)',
          borderRadius: '12px',
          border: '2px solid #9c27b0',
          borderLeft: '6px solid #9c27b0'
        }}>
          <p style={{ 
            margin: '0',
            fontSize: '16px',
            fontStyle: 'italic'
          }}>
            <strong>Hinweis:</strong><br />
            Diese Architektur-Dokumentation wird laufend aktualisiert und erweitert. Änderungen am Datenmodell, API oder Systemdesign werden hier systematisch dokumentiert.
          </p>
        </div>
      </div>

      {/* Popup für vergrößertes Diagramm */}
      {showDiagramPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: theme === 'dark' ? '#25252c' : '#ffffff',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '95vw',
            maxHeight: '95vh',
            overflow: 'auto',
            position: 'relative',
            border: `3px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`
          }}>
            <button
              onClick={() => setShowDiagramPopup(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: theme === 'dark' ? '#f19115' : '#5c8791',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <h3 style={{ 
              margin: '0 0 20px 0',
              color: theme === 'dark' ? '#f19115' : '#5c8791',
              textAlign: 'center'
            }}>
              🏗️ GameCompass System-Architektur
            </h3>
            
            {/* Das obige Mermaid-Diagramm hier als Text für Referenz */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {architectureLayers.map((layer, index) => (
                <div
                  key={index}
                  style={{
                    border: `3px solid ${layer.color}`,
                    borderRadius: '12px',
                    padding: '15px',
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(37, 37, 44, 0.8)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                    {layer.icon}
                  </div>
                  <h4 style={{
                    margin: '0 0 10px 0',
                    color: layer.color,
                    fontSize: '16px'
                  }}>
                    {layer.name}
                  </h4>
                  <div style={{
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(0,0,0,0.3)' 
                      : 'rgba(0,0,0,0.05)',
                    padding: '8px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}>
                    <strong style={{ color: layer.color }}>
                      {layer.tech}
                    </strong>
                  </div>
                  <p style={{
                    margin: '0',
                    fontSize: '11px',
                    lineHeight: '1.3'
                  }}>
                    {layer.purpose}
                  </p>
                </div>
              ))}
            </div>
            
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: theme === 'dark' ? '#9e9e9e' : '#666666',
              fontStyle: 'italic',
              margin: '10px 0 0 0'
            }}>
              Vollständiges Mermaid-Diagramm verfügbar in der Chat-Ansicht oben ↑
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 