import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/IntegrationsServices.css';

export const IntegrationsServices: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="integrations-container">
      <h1><span className="integrations-emoji">🔌</span> <span className="gradient-text">Integrations & Services</span></h1>
      <p className="subtitle">
        Übersicht über alle externen API-Integrationen, Authentifizierungs-Services und Payment-Lösungen.
      </p>

      <div className="section">
        <h2>🔐 Authentifizierung (SSO)</h2>
        <p>Single Sign-On Integration mit verschiedenen Anbietern für nahtlose Benutzeranmeldung.</p>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-header">
              <span className="service-icon">👥</span>
              <h3>Facebook Login</h3>
            </div>
            <p>Facebook OAuth 2.0 Integration für schnelle Anmeldung</p>
            <ul className="service-features">
              <li>OAuth 2.0 Protokoll</li>
              <li>Profil-Datenabruf</li>
              <li>Automatische Registrierung</li>
            </ul>
            <div className="service-status active">
              <span className="status-dot"></span>
              <span>Aktiv</span>
            </div>
          </div>

          <div className="service-card">
            <div className="service-header">
              <span className="service-icon">🔍</span>
              <h3>Google OAuth</h3>
            </div>
            <p>Google Sign-In für sichere Authentifizierung</p>
            <ul className="service-features">
              <li>Google Identity Platform</li>
              <li>Sichere Token-Verwaltung</li>
              <li>Multi-Domain Support</li>
            </ul>
            <div className="service-status active">
              <span className="status-dot"></span>
              <span>Aktiv</span>
            </div>
          </div>

          <div className="service-card">
            <div className="service-header">
              <span className="service-icon">📧</span>
              <h3>Nodemailer</h3>
            </div>
            <p>E-Mail-Versand für Benachrichtigungen und Bestätigungen</p>
            <ul className="service-features">
              <li>SMTP Integration</li>
              <li>Template-basierte E-Mails</li>
              <li>Delivery Tracking</li>
            </ul>
            <div className="service-status active">
              <span className="status-dot"></span>
              <span>Aktiv</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>💳 Payment Services</h2>
        <p>Sichere Zahlungsabwicklung für den GameCompass Marketplace.</p>
        
        <div className="payment-grid">
          <div className="service-card featured">
            <div className="service-header">
              <span className="service-icon">💎</span>
              <h3>Stripe Integration</h3>
            </div>
            <p>Vollständige Payment-Lösung mit internationaler Unterstützung</p>
            <ul className="service-features">
              <li>Kreditkarten-Verarbeitung</li>
              <li>Webhook-Integration</li>
              <li>Subscription Management</li>
              <li>Fraud Detection</li>
            </ul>
            <div className="service-status active">
              <span className="status-dot"></span>
              <span>Aktiv</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Integration Flow</h2>
        <div className="flow-info">
          <p>Authentifizierungs- und Payment-Flow im GameCompass System:</p>
          <div className="flow-diagram">
            <div className="flow-step">
              <span className="step-icon">👤</span>
              <h4>1. Authentifizierung</h4>
              <p>User wählt SSO-Anbieter (Facebook/Google)</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-icon">🔐</span>
              <h4>2. Autorisierung</h4>
              <p>OAuth-Flow und Token-Validierung</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-icon">🛒</span>
              <h4>3. Shopping</h4>
              <p>Produkte auswählen und in Warenkorb legen</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-icon">💳</span>
              <h4>4. Payment</h4>
              <p>Sichere Zahlung über Stripe</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-icon">📧</span>
              <h4>5. Bestätigung</h4>
              <p>E-Mail-Versand via Nodemailer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Konfiguration</h2>
        <div className="config-info">
          <p>Alle Services sind über Umgebungsvariablen konfiguriert:</p>
          <div className="config-grid">
            <div className="config-item">
              <h4>🔑 API Keys</h4>
              <p>Sichere Speicherung aller API-Schlüssel in .env Dateien</p>
            </div>
            <div className="config-item">
              <h4>🔄 Webhooks</h4>
              <p>Automatische Event-Verarbeitung für Payment-Updates</p>
            </div>
            <div className="config-item">
              <h4>🛡️ Sicherheit</h4>
              <p>HTTPS-Only, Token-Rotation und Rate-Limiting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 