import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const SetupPrompts: React.FC = () => {
  const { theme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mermaidChart = `
sequenceDiagram
    participant User as 🙋‍♂️ Nutzer
    participant FE as 🌐 Frontend
    participant BE as 🚀 Backend
    participant Stripe as 💳 Stripe
    participant DB as 🗄️ MongoDB

    User->>FE: Klickt "Verkaufen"
    FE->>BE: GET /auth/me
    BE-->>FE: Userdaten (oder Login nötig)

    User->>FE: Startet Stripe-Onboarding
    FE->>BE: POST /api/connect/create-account
    BE->>Stripe: Erstelle Stripe-Account
    Stripe-->>BE: StripeAccountId & Link
    BE->>DB: StripeAccountId beim User speichern
    BE-->>FE: Onboarding-Link
    FE->>User: Weiterleitung zu Stripe

    User->>FE: Neues Angebot erstellen
    FE->>BE: POST /api/offers
    BE->>DB: Angebot mit StripeAccountId speichern
    BE-->>FE: Bestätigung

    User(Käufer)->>FE: Klickt "Kaufen"
    FE->>BE: POST /api/checkout
    BE->>Stripe: Checkout-Session anlegen
    Stripe-->>BE: Checkout-URL
    BE-->>FE: Checkout-URL
    FE->>User: Weiterleitung zur Stripe-Zahlung

    Stripe->>BE: Webhook: Zahlung eingegangen
    BE->>DB: Angebot als verkauft markieren
    BE-->>Stripe: Bestätigung Webhook
  `;

  return (
    <div className="service-detail-container">
      <h1><span>📝</span> <span className="gradient-text">setupPrompts.ts</span></h1>
      <p className="subtitle">Zahlungsintegration & Verkaufsprozess mit Stripe</p>
      
      <div className="section">
        <h2>📋 Funktionsbeschreibung</h2>
        <p>Dieses Sequenzdiagramm zeigt den vollständigen Ablauf vom Verkaufsstart über das Stripe-Onboarding bis zur Zahlungsabwicklung und Angebotsverwaltung in GameCompass.</p>
      </div>

      <div className="section">
        <h2>🎯 Verkaufsprozess-Flow</h2>
        <div className="prompts-info">
          <p>Der GameCompass Verkaufsprozess umfasst folgende Kernbereiche:</p>
          <ul className="relationships-list">
            <li><strong>Verkäufer-Onboarding:</strong> Stripe-Account-Erstellung und Verifikation</li>
            <li><strong>Angebots-Management:</strong> Spiele-Angebote erstellen und verwalten</li>
            <li><strong>Zahlungsabwicklung:</strong> Sichere Stripe-Checkout-Sessions</li>
            <li><strong>Webhook-Integration:</strong> Automatische Verkaufs-Bestätigung</li>
            <li><strong>Bestellungs-Tracking:</strong> Vollständige Transaktions-Überwachung</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Stripe Integration Details</h2>
        <div className="setup-info">
          <p>Der Verkaufsprozess integriert nahtlos mit Stripe für sichere Zahlungsabwicklung:</p>
          <ul className="relationships-list">
            <li><strong>Account Connect:</strong> Verkäufer-Verifizierung über Stripe Connect</li>
            <li><strong>Payment Intent:</strong> Sichere Checkout-Session-Erstellung</li>
            <li><strong>Webhook Events:</strong> Echtzeit-Transaktions-Updates</li>
            <li><strong>Multi-Party Payments:</strong> Direkte Auszahlung an Verkäufer</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>💳 Zahlungsintegration & Verkaufsprozess Sequenzdiagramm</h2>
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
                💳 Zahlungsintegration & Verkaufsprozess
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