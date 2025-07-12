import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Backend.css';

interface FrontendProps {
  onNavigate?: (section: string) => void;
}

export const Frontend: React.FC<FrontendProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  return (
    <div className="backend-container">
      <h1><span className="backend-emoji">🖥️</span> <span className="gradient-text">Frontend – GameCompass</span></h1>
      <p className="subtitle">
        Dieses Verzeichnis bietet einen klaren Überblick über alle Frontend-Bereiche und verweist direkt auf unsere Design- und UX-Dokumentation.
      </p>

      <div className="section">
        <h2>📋 Inhalt</h2>
        <div className="backend-overview">
          <div className="overview-section">
            <h3 
              style={{ cursor: 'pointer' }} 
              onClick={() => onNavigate?.('design')}
            >
              🎨 Design
            </h3>
            <p>Design-System, UI/UX Richtlinien und Komponenten-Bibliothek</p>
            <ul className="overview-list">
              <li>├─ Farbpalette & Themes</li>
              <li>├─ Typografie & Schriftarten</li>
              <li>├─ Komponenten-Bibliothek</li>
              <li>└─ Accessibility Guidelines</li>
            </ul>
            <div 
              className="link-box clickable" 
              onClick={() => onNavigate?.('design')}
              style={{ cursor: 'pointer' }}
            >
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>Design</strong> Sektion</span>
            </div>
          </div>

          <div className="overview-section">
            <h3 
              style={{ cursor: 'pointer' }} 
              onClick={() => onNavigate?.('figma')}
            >
              🎯 Figma
            </h3>
            <p>Prototypen, Wireframes und Design-Mockups</p>
            <ul className="overview-list">
              <li>├─ Wireframes & User-Flows</li>
              <li>├─ High-Fidelity Mockups</li>
              <li>├─ Interaktive Prototypen</li>
              <li>└─ Design-Spezifikationen</li>
            </ul>
            <div 
              className="link-box clickable" 
              onClick={() => onNavigate?.('figma')}
              style={{ cursor: 'pointer' }}
            >
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>Figma</strong> Sektion</span>
            </div>
          </div>

          <div className="overview-section">
            <h3 
              style={{ cursor: 'pointer' }} 
              onClick={() => onNavigate?.('interaktive-nutzerfuehrung')}
            >
              🗺️ Interaktive Nutzerführung
            </h3>
            <p>Onboarding, Benutzerführung und Hilfe-Systeme</p>
            <ul className="overview-list">
              <li>├─ Welcome-Tour & Onboarding</li>
              <li>├─ Interaktive Tooltips</li>
              <li>├─ Navigations-Hilfen</li>
              <li>└─ Gaming-Einsteiger Hilfe</li>
            </ul>
            <div 
              className="link-box clickable" 
              onClick={() => onNavigate?.('interaktive-nutzerfuehrung')}
              style={{ cursor: 'pointer' }}
            >
              <span className="link-icon">🔗</span>
              <span>Siehe: <strong>Interaktive Nutzerführung</strong> Sektion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🏗️ Frontend-Architektur</h2>
        <div className="architecture-info">
          <p>Das Frontend basiert auf einer modernen React-Architektur:</p>
          <ul className="architecture-list">
            <li><strong>Framework:</strong> React 18 mit TypeScript und Vite</li>
            <li><strong>Styling:</strong> CSS-in-JS, Styled-Components, Bootstrap</li>
            <li><strong>State Management:</strong> React Context API, Custom Hooks</li>
            <li><strong>Routing:</strong> React Router für Navigation</li>
            <li><strong>UI/UX:</strong> Responsive Design, Dark/Light Mode</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🚀 Quick Start</h2>
        <div className="quick-start-info">
          <p>Für eine detaillierte Übersicht der Frontend-Komponenten navigiere zu den entsprechenden Sektionen:</p>
          <div className="navigation-hints">
            <div 
              className="nav-hint clickable" 
              onClick={() => onNavigate?.('design')}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-icon">🎨</span>
              <span><strong>Design</strong> - Design-System und UI/UX Richtlinien</span>
            </div>
            <div 
              className="nav-hint clickable" 
              onClick={() => onNavigate?.('figma')}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-icon">🎯</span>
              <span><strong>Figma</strong> - Prototypen und Design-Mockups</span>
            </div>
            <div 
              className="nav-hint clickable" 
              onClick={() => onNavigate?.('interaktive-nutzerfuehrung')}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-icon">🗺️</span>
              <span><strong>Interaktive Nutzerführung</strong> - Onboarding und Benutzerführung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 