import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const InteraktiveNutzerfuehrung: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🗺️</span> <span className="gradient-text">Interaktive Nutzerführung</span></h1>
      <p className="subtitle">GameCompass Frontend - Onboarding und Benutzerführung</p>
      
      <div className="section">
        <h2>📋 Übersicht</h2>
        <p>Hier wird die interaktive Nutzerführung, Onboarding-Prozesse und Hilfe-Systeme von GameCompass dokumentiert.</p>
      </div>

      <div className="section">
        <h2>🎮 Onboarding-System</h2>
        <div className="onboarding-info">
          <p>Dokumentation folgt in Kürze...</p>
          <ul>
            <li>Welcome-Tour für neue Benutzer</li>
            <li>Schritt-für-Schritt Anleitungen</li>
            <li>Interaktive Tooltips</li>
            <li>Contextual Help-System</li>
            <li>Progress-Tracking</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🧭 Navigations-Hilfen</h2>
        <div className="navigation-info">
          <p>Interaktive Elemente zur Unterstützung der Benutzernavigation.</p>
          <ul>
            <li>Guided Tours</li>
            <li>Feature Highlights</li>
            <li>Keyboard Shortcuts</li>
            <li>Quick Actions</li>
            <li>Search & Filter Guidance</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🎯 Gaming-Einsteiger Hilfe</h2>
        <div className="beginner-info">
          <p>Spezielle Hilfe-Systeme für Gaming-Einsteiger.</p>
          <ul>
            <li>Genre-Erklärungen</li>
            <li>Platform-Guides</li>
            <li>Kaufberatung</li>
            <li>Community-Integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 