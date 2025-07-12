import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Model.css';
import '../styles/ModelDetail.css';

interface ModelProps {
  onNavigate?: (page: string) => void;
}

export const Model: React.FC<ModelProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  const handleModelClick = (modelPage: string) => {
    if (onNavigate) {
      onNavigate(modelPage);
    }
  };

  return (
    <div className="model-container">
      <h1><span className="model-emoji">📊</span> <span className="gradient-text">Backend-Modelle (Datenbankstruktur)</span></h1>
      <p className="subtitle">
        Dieses Verzeichnis dokumentiert sämtliche im Projekt verwendeten Mongoose-Modelle für das Backend von GameCompass.
      </p>

      <div className="section">
        <div className="important-note">
          <span className="note-icon">📌</span>
          <div>
            <strong>Hinweis:</strong><br/>
            Alle Models werden mit TypeScript-Interfaces und Mongoose-Schemas realisiert.
            Die Dokumentation erläutert alle Felder, spezielle Methoden, Beziehungen sowie Besonderheiten.
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📋 Inhaltsverzeichnis</h2>
        <p>Klicken Sie auf ein Model, um zur detaillierten Dokumentation zu gelangen:</p>
        
        <div className="models-grid">
          <div className="model-card clickable" onClick={() => handleModelClick('user-model')}>
            <div className="model-header">
              <span className="model-icon">👤</span>
              <h3>User Model</h3>
            </div>
            <p>Basis-Benutzermodell für Authentifizierung und Profile</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('buyer-model')}>
            <div className="model-header">
              <span className="model-icon">🛍️</span>
              <h3>Buyer Model</h3>
            </div>
            <p>Käufer-spezifische Erweiterung des User Models</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('admin-model')}>
            <div className="model-header">
              <span className="model-icon">👑</span>
              <h3>Admin Model</h3>
            </div>
            <p>Administrator-Rechte und Management-Funktionen</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('genre-model')}>
            <div className="model-header">
              <span className="model-icon">🎭</span>
              <h3>Genre Model</h3>
            </div>
            <p>Spiel-Kategorien und Genre-Klassifizierung</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('spiel-model')}>
            <div className="model-header">
              <span className="model-icon">🎮</span>
              <h3>Spiel Model</h3>
            </div>
            <p>Spiel-Informationen, Preise und Verfügbarkeit</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('offer-model')}>
            <div className="model-header">
              <span className="model-icon">💰</span>
              <h3>Offer Model</h3>
            </div>
            <p>Angebote, Rabatte und Sonderaktionen</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('cart-model')}>
            <div className="model-header">
              <span className="model-icon">🛒</span>
              <h3>Cart Model</h3>
            </div>
            <p>Warenkorb-Verwaltung und Session-Management</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('bestellung-model')}>
            <div className="model-header">
              <span className="model-icon">📦</span>
              <h3>Bestellung Model</h3>
            </div>
            <p>Bestellabwicklung und Order-Management</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('bewertung-model')}>
            <div className="model-header">
              <span className="model-icon">⭐</span>
              <h3>Bewertung Model</h3>
            </div>
            <p>Bewertungen, Reviews und Rating-System</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('chatprompt-model')}>
            <div className="model-header">
              <span className="model-icon">💬</span>
              <h3>ChatPrompt Model</h3>
            </div>
            <p>KI-Chat Prompts und Template-Verwaltung</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>

          <div className="model-card clickable" onClick={() => handleModelClick('chathistory-model')}>
            <div className="model-header">
              <span className="model-icon">📜</span>
              <h3>ChatHistory Model</h3>
            </div>
            <p>Chat-Verlauf und Konversations-Speicherung</p>
            <div className="model-link">
              <span className="link-arrow">→</span>
              <span>Zur Dokumentation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔗 Schema Relationships</h2>
        <div className="relationships-info">
          <p>Die Modelle sind über folgende Beziehungen miteinander verknüpft:</p>
          <div className="relationship-diagram">
            <div className="relationship-item">
              <span className="rel-icon">👤</span>
              <span className="rel-arrow">→</span>
              <span className="rel-icon">🛒</span>
              <span className="rel-text">User hat viele Orders</span>
            </div>
            <div className="relationship-item">
              <span className="rel-icon">🛒</span>
              <span className="rel-arrow">→</span>
              <span className="rel-icon">🎮</span>
              <span className="rel-text">Order enthält viele Games</span>
            </div>
            <div className="relationship-item">
              <span className="rel-icon">👤</span>
              <span className="rel-arrow">→</span>
              <span className="rel-icon">⭐</span>
              <span className="rel-text">User schreibt viele Reviews</span>
            </div>
            <div className="relationship-item">
              <span className="rel-icon">🎮</span>
              <span className="rel-arrow">→</span>
              <span className="rel-icon">⭐</span>
              <span className="rel-text">Game hat viele Reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Technische Details</h2>
        <div className="tech-details">
          <div className="tech-item">
            <h4>🗃️ Database</h4>
            <p>MongoDB mit Mongoose ODM für Schema-Definition und Validierung</p>
          </div>
          <div className="tech-item">
            <h4>🔐 Validierung</h4>
            <p>Schema-basierte Validierung mit benutzerdefinierten Validatoren</p>
          </div>
          <div className="tech-item">
            <h4>🔄 Middleware</h4>
            <p>Pre/Post Hooks für automatische Timestamps und Datenverarbeitung</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 