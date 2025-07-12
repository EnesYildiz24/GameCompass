import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Backend.css';

interface KIProps {
  onNavigate?: (page: string) => void;
}

// Funktion zur Behandlung der Navigation
const handleNavigation = (section: string, onNavigate?: (page: string) => void) => {
  if (onNavigate) {
    onNavigate(section);
  }
};

export const KI: React.FC<KIProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  return (
    <div className="backend-container">
      <h1><span className="backend-emoji">🤖</span> <span className="gradient-text">KI-System – GameCompass</span></h1>
      <p className="subtitle">
        Dieses Verzeichnis bietet einen umfassenden Überblick über unser KI-System und die intelligenten Chat-Funktionen von GameCompass.
      </p>

      <div className="section">
        <h2>📋 KI-Dokumentation</h2>
        <div className="backend-overview">
          <div 
            className="overview-section" 
            onClick={() => handleNavigation('gamecompass-vektor-system', onNavigate)}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <h3>↗️ ChatBot-Übersicht</h3>
            <p>Die Seite beschreibt die Architektur und Funktionsweise des GameCompass-Chatbots, der mithilfe semantischer Vektorsuche (ChromaDB), strukturierter Daten (MongoDB) und KI-Antworten (Ollama) intelligente Spielempfehlungen liefert.</p>
            <div className="link-box">
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>GameCompass Vektor-System</strong></span>
            </div>
          </div>

          <div 
            className="overview-section" 
            onClick={() => handleNavigation('sync-to-chroma', onNavigate)}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <h3>📦 Spieleimport & Vektor-Indizierung mit ChromaDB</h3>
            <p>Die Seite erklärt, wie Spiele aus MongoDB über ein Importscript in ChromaDB übertragen und dort als Vektor-Dokumente für die semantische Suche indiziert werden.</p>
            <div className="link-box">
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>syncToChroma.ts</strong></span>
            </div>
          </div>

          <div 
            className="overview-section" 
            onClick={() => handleNavigation('setup-prompts', onNavigate)}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <h3>💳 Zahlungsintegration & Verkaufsprozess mit Stripe</h3>
            <p>Dieses Sequenzdiagramm zeigt den vollständigen Ablauf vom Verkaufsstart über das Stripe-Onboarding bis zur Zahlungsabwicklung und Angebotsverwaltung in GameCompass.</p>
            <div className="link-box">
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>setupPrompts.ts</strong></span>
            </div>
          </div>

          <div className="overview-section-dual" style={{ transition: 'all 0.3s ease' }}>
            <h3>🏛️ Architektur des Chat-Systems <strong>&</strong> 🧠 Architektur des Chat-Systems II</h3>
            <p>Diese Seiten veranschaulichen die modulare Architektur des GameCompass-Chatbots, der Benutzeranfragen mithilfe von MongoDB, ChromaDB und einem lokalen LLM (Ollama) verarbeitet und intelligente, kontextbasierte Spielempfehlungen liefert.</p>
            <div className="dual-link-container">
              <div 
                className="link-box" 
                onClick={() => handleNavigation('architektur-chat-system', onNavigate)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.backgroundColor = 'rgba(91, 135, 145, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="link-icon">🔗</span>
                <span>Siehe: <strong>Architektur des Chat-Systems</strong></span>
              </div>
              <div 
                className="link-box" 
                onClick={() => handleNavigation('architektur-chat-system-2', onNavigate)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.backgroundColor = 'rgba(91, 135, 145, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="link-icon">🔗</span>
                <span>Siehe: <strong>Architektur des Chat-Systems II</strong></span>
              </div>
            </div>
          </div>

          <div 
            className="overview-section" 
            onClick={() => handleNavigation('ki-chat-modelle', onNavigate)}
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <h3>🤖 Chat-Systeme & Sprachintegration in GameCompass</h3>
            <p>Diese Seite zeigt die Architektur der Text- und Audio-Chatfunktionen sowie den dynamischen KI-Provider-Wechsel, mit denen GameCompass eine flexible und sprachgesteuerte Nutzererfahrung ermöglicht.</p>
            <div className="link-box">
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>KI-Chat Modelle</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 