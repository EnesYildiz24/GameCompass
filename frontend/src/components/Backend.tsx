import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Backend.css';

interface BackendProps {
  onNavigate?: (section: string) => void;
}

export const Backend: React.FC<BackendProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  return (
    <div className="backend-container">
      <h1><span className="backend-emoji">⚙️</span> <span className="gradient-text">Backend – GameCompass</span></h1>
      <p className="subtitle">
        Dieses Verzeichnis bietet einen klaren Überblick über alle Kernbereiche des Backends und verweist direkt auf unsere Modell-Definitionen.
      </p>

      <div className="section">
        <h2>📋 Inhalt</h2>
        <div className="backend-overview">
          <div className="overview-section">
            <h3 
              style={{ cursor: 'pointer' }} 
              onClick={() => onNavigate?.('model')}
            >
              📊 Modelle
            </h3>
            <p>Datenbank-Modelle und Schema-Definitionen für GameCompass</p>
            <ul className="overview-list">
              <li>├─ User Models</li>
              <li>├─ Game Models</li>
              <li>├─ Order Models</li>
              <li>└─ Review Models</li>
            </ul>
            <div 
              className="link-box clickable" 
              onClick={() => onNavigate?.('model')}
              style={{ cursor: 'pointer' }}
            >
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>Model</strong> Sektion</span>
            </div>
          </div>

          <div className="overview-section">
            <h3 
              style={{ cursor: 'pointer' }} 
              onClick={() => onNavigate?.('integrations')}
            >
              🔌 Integrations & Services
            </h3>
            <p>Externe APIs, Authentifizierung und Service-Integrationen</p>
            <ul className="overview-list">
              <li>├─ Authentifizierung (SSO)</li>
              <li>│   ├─ Facebook Login</li>
              <li>│   ├─ Google OAuth</li>
              <li>│   └─ Nodemailer Integration</li>
              <li>└─ Payment Services</li>
              <li>    └─ Stripe Integration</li>
            </ul>
            <div 
              className="link-box clickable" 
              onClick={() => onNavigate?.('integrations')}
              style={{ cursor: 'pointer' }}
            >
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>Integrations & Services</strong> Sektion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🏗️ Architektur-Übersicht</h2>
        <div className="architecture-info">
          <p>Das Backend basiert auf einer modularen Architektur:</p>
          <ul className="architecture-list">
            <li><strong>Models:</strong> Mongoose/Sequelize Schema-Definitionen</li>
            <li><strong>Services:</strong> Business-Logic und externe API-Integrationen</li>
            <li><strong>Routes:</strong> Express.js API-Endpunkte</li>
            <li><strong>Middleware:</strong> Authentifizierung, Validierung, Error-Handling</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🚀 Quick Start</h2>
        <div className="quick-start-info">
          <p>Für eine detaillierte Übersicht der Backend-Komponenten navigiere zu den entsprechenden Sektionen:</p>
          <div className="navigation-hints">
            <div 
              className="nav-hint clickable" 
              onClick={() => onNavigate?.('model')}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-icon">📊</span>
              <span><strong>Model</strong> - Datenbank-Schemas und Modell-Definitionen</span>
            </div>
            <div 
              className="nav-hint clickable" 
              onClick={() => onNavigate?.('integrations')}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-icon">🔌</span>
              <span><strong>Integrations & Services</strong> - API-Integrationen und externe Services</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 