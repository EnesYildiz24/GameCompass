import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const VerkaufsLogikKYC: React.FC = () => {
  const { theme } = useTheme();
  const [showKYCDiagram, setShowKYCDiagram] = React.useState(false);
  const [showSalesDiagram, setShowSalesDiagram] = React.useState(false);

  const kycMermaidChart = `
sequenceDiagram
    participant Nutzer as 🙋‍♂️ Verkäufer
    participant Frontend as 🌐 Frontend
    participant Backend as 🚀 Backend
    participant Stripe as 💳 Stripe

    Nutzer->>Frontend: Klickt "Verkaufen"
    Frontend->>Backend: Login prüfen
    Backend-->>Frontend: OK

    Nutzer->>Frontend: Stripe-Onboarding starten
    Frontend->>Backend: Anfrage Stripe-Onboarding
    Backend->>Stripe: Erstelle Stripe-Account für Nutzer
    Stripe-->>Backend: Onboarding-Link zurück
    Backend-->>Frontend: Link an Nutzer
    Frontend->>Nutzer: Weiterleitung zu Stripe
    Nutzer->>Stripe: Gibt persönliche Daten ein (KYC)
    Stripe-->>Nutzer: Bestätigung Onboarding abgeschlossen
    Stripe-->>Backend: Info: Onboarding abgeschlossen
  `;

  const salesMermaidChart = `
sequenceDiagram
    participant Käufer as 🙋‍♂️ Käufer
    participant Frontend as 🌐 Frontend
    participant Backend as 🚀 Backend
    participant Stripe as 💳 Stripe
    participant Verkäufer as 🙋‍♂️ Verkäufer

    Käufer->>Frontend: Klickt "Kaufen"
    Frontend->>Backend: Kaufsession starten
    Backend->>Stripe: Stripe-Checkout-Session anlegen (mit Fee für Plattform)
    Stripe-->>Backend: Checkout-Link zurück
    Backend-->>Frontend: Link an Käufer
    Frontend->>Käufer: Weiterleitung zur Zahlung

    Käufer->>Stripe: Bezahlt Angebot
    Stripe->>Backend: Webhook: Zahlung erfolgreich
    Stripe->>Verkäufer: Auszahlung (abzgl. Plattform-Gebühr)
    Backend->>Frontend: Info: Verkauf abgeschlossen
  `;

  return (
    <div className="service-detail-container">
      <h1><span>💳</span> <span className="gradient-text">Verkaufs Logik mit KYC Integration</span></h1>
      <p className="subtitle">Know Your Customer Compliance und Verkaufsprozess-Integration für GameCompass</p>
      
      <div className="section">
        <h2>💡 Einleitung</h2>
        <p>Der Verkaufsprozess auf GameCompass ist in zwei zentrale Abläufe unterteilt:</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          margin: '20px 0'
        }}>
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
            backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)'
          }}>
            <h3 style={{ 
              color: theme === 'dark' ? '#f19115' : '#5c8791',
              margin: '0 0 15px 0'
            }}>
              🔐 KYC/Onboarding
            </h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>
              Damit ein Nutzer auf unserer Plattform Games verkaufen kann, muss er sich per Stripe-Onboarding legitimieren (KYC – „Know Your Customer"). Stripe übernimmt die Identitätsprüfung und erstellt ein Verkäuferkonto.
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            border: `2px solid ${theme === 'dark' ? '#ff6b35' : '#4a6fa5'}`,
            backgroundColor: theme === 'dark' ? 'rgba(255, 107, 53, 0.1)' : 'rgba(74, 111, 165, 0.1)'
          }}>
            <h3 style={{ 
              color: theme === 'dark' ? '#ff6b35' : '#4a6fa5',
              margin: '0 0 15px 0'
            }}>
              💰 Verkaufsprozess & Zahlungsfluss
            </h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>
              Nach erfolgreichem Onboarding kann der Nutzer Angebote einstellen. Beim Kauf eines Angebots bezahlt der Käufer direkt per Stripe. Stripe zieht unsere Servicegebühr automatisch ab und überweist den Restbetrag an das Verkäuferkonto.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>1️⃣ KYC & Stripe-Onboarding</h2>
        
        {/* KYC Mermaid Diagram */}
        <div style={{
          margin: '20px 0',
          position: 'relative'
        }}>
          <div style={{
            border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(37, 37, 44, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setShowKYCDiagram(true)}>
            <Mermaid 
              chart={kycMermaidChart} 
              theme={theme === 'dark' ? 'dark' : 'light'} 
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: theme === 'dark' ? '#f19115' : '#5c8791',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              🔍 Klicken zum Vergrößern
            </div>
          </div>
        </div>

        {/* KYC Process Steps */}
        <div className="subsection">
          <h3>📋 Ablauf im Detail</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '15px'
          }}>
            <div className="step-card">
              <h4>1. 🖱️ Verkaufen-Button</h4>
              <p>Nutzer klickt auf "Verkaufen" und das Frontend prüft den Login-Status über das Backend.</p>
            </div>
            
            <div className="step-card">
              <h4>2. 🚀 Stripe-Onboarding starten</h4>
              <p>Frontend sendet Anfrage an Backend, welches bei Stripe einen neuen Account für den Nutzer erstellt.</p>
            </div>
            
            <div className="step-card">
              <h4>3. 🔗 Onboarding-Link</h4>
              <p>Stripe gibt einen Onboarding-Link zurück, der über Backend und Frontend an den Nutzer weitergeleitet wird.</p>
            </div>
            
            <div className="step-card">
              <h4>4. 📝 KYC-Daten eingeben</h4>
              <p>Nutzer wird zu Stripe weitergeleitet und gibt persönliche Daten ein (Know Your Customer).</p>
            </div>
            
            <div className="step-card">
              <h4>5. ✅ Bestätigung</h4>
              <p>Stripe bestätigt das abgeschlossene Onboarding sowohl dem Nutzer als auch unserem Backend.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>2️⃣ Verkaufsprozess & Zahlungsfluss</h2>
        
        {/* Sales Mermaid Diagram */}
        <div style={{
          margin: '20px 0',
          position: 'relative'
        }}>
          <div style={{
            border: `2px solid ${theme === 'dark' ? '#ff6b35' : '#4a6fa5'}`,
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(37, 37, 44, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setShowSalesDiagram(true)}>
            <Mermaid 
              chart={salesMermaidChart} 
              theme={theme === 'dark' ? 'dark' : 'light'} 
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: theme === 'dark' ? '#ff6b35' : '#4a6fa5',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              🔍 Klicken zum Vergrößern
            </div>
          </div>
        </div>

        {/* Sales Process Steps */}
        <div className="subsection">
          <h3>📋 Ablauf im Detail</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '15px'
          }}>
            <div className="step-card">
              <h4>1. 🛒 Kaufen-Button</h4>
              <p>Käufer klickt auf "Kaufen" für ein Angebot und das Frontend startet eine Kaufsession über das Backend.</p>
            </div>
            
            <div className="step-card">
              <h4>2. 💳 Stripe-Checkout erstellen</h4>
              <p>Backend erstellt eine Stripe-Checkout-Session mit automatischer Plattform-Gebühr (Fee) und erhält einen Checkout-Link.</p>
            </div>
            
            <div className="step-card">
              <h4>3. 🔗 Weiterleitung zur Zahlung</h4>
              <p>Frontend leitet den Käufer über den Checkout-Link zur sicheren Stripe-Zahlungsseite weiter.</p>
            </div>
            
            <div className="step-card">
              <h4>4. 💰 Zahlung ausführen</h4>
              <p>Käufer bezahlt das Angebot direkt über Stripe's sichere Zahlungsinfrastruktur.</p>
            </div>
            
            <div className="step-card">
              <h4>5. 🔔 Webhook & Auszahlung</h4>
              <p>Stripe sendet Webhook bei erfolgreicher Zahlung an unser Backend und zahlt automatisch an den Verkäufer (abzüglich Plattform-Gebühr) aus.</p>
            </div>
            
            <div className="step-card">
              <h4>6. ✅ Verkauf abgeschlossen</h4>
              <p>Backend informiert Frontend über den abgeschlossenen Verkauf, beide Parteien erhalten Bestätigungen.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Technische Details</h2>
        
        <div className="methods-grid">
          <div className="method-card">
            <h4>🏦 Stripe Connect</h4>
            <ul>
              <li>Automatische Marketplace-Provisionen</li>
              <li>Compliance & KYC durch Stripe</li>
              <li>Internationale Zahlungen</li>
              <li>Webhook-Integration</li>
            </ul>
          </div>
          
          <div className="method-card">
            <h4>💳 Payment Processing</h4>
            <ul>
              <li>PCI DSS Compliance</li>
              <li>3D Secure Authentication</li>
              <li>Multi-Currency Support</li>
              <li>Fraud Protection</li>
            </ul>
          </div>
          
          <div className="method-card">
            <h4>🔐 Security & Compliance</h4>
            <ul>
              <li>End-to-End Verschlüsselung</li>
              <li>GDPR/DSGVO konform</li>
              <li>Anti-Money Laundering (AML)</li>
              <li>Audit Trail Logging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* KYC Diagram Popup */}
      {showKYCDiagram && (
        <div style={{
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
        onClick={() => setShowKYCDiagram(false)}
        >
          <div style={{
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
            <button
              onClick={() => setShowKYCDiagram(false)}
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
            <div style={{ paddingTop: '20px' }}>
              <h3 style={{ 
                margin: '0 0 20px 0',
                color: theme === 'dark' ? '#f19115' : '#5c8791',
                textAlign: 'center',
                fontSize: '24px',
              }}>
                🔐 KYC & Stripe-Onboarding Prozess
              </h3>
              
              {/* Enlarged KYC Mermaid Diagram */}
              <div style={{
                transform: 'scale(1.2)',
                transformOrigin: 'center',
                minHeight: '600px',
              }}>
                <Mermaid 
                  chart={kycMermaidChart} 
                  theme={theme === 'dark' ? 'dark' : 'light'} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Diagram Popup */}
      {showSalesDiagram && (
        <div style={{
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
        onClick={() => setShowSalesDiagram(false)}
        >
          <div style={{
            position: 'relative',
            width: '90vw',
            height: '80vh',
            backgroundColor: theme === 'dark' ? '#2d2e35' : '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'auto',
            border: `3px solid ${theme === 'dark' ? '#ff6b35' : '#4a6fa5'}`,
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSalesDiagram(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                backgroundColor: theme === 'dark' ? '#ff6b35' : '#4a6fa5',
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
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ff6b35' : '#4a6fa5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ff6b35' : '#4a6fa5';
              }}
            >
              ✕
            </button>
            <div style={{ paddingTop: '20px' }}>
              <h3 style={{ 
                margin: '0 0 20px 0',
                color: theme === 'dark' ? '#ff6b35' : '#4a6fa5',
                textAlign: 'center',
                fontSize: '24px',
              }}>
                💰 Verkaufsprozess & Zahlungsfluss
              </h3>
              
              {/* Enlarged Sales Mermaid Diagram */}
              <div style={{
                transform: 'scale(1.2)',
                transformOrigin: 'center',
                minHeight: '600px',
              }}>
                <Mermaid 
                  chart={salesMermaidChart} 
                  theme={theme === 'dark' ? 'dark' : 'light'} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 