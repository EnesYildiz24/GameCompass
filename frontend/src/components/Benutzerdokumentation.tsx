import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const Benutzerdokumentation: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('getting-started');

  return (
    <div className="service-detail-container">
      <h1><span>📖</span> <span className="gradient-text">Benutzerdokumentation</span></h1>
      <p className="subtitle">Hilfsanleitung, FAQ und Tipps für die optimale Nutzung von GameCompass</p>
      
      <div className="section">
        <h2>🚀 Schnellstart-Guide</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['getting-started', 'account', 'shopping', 'faq'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: activeTab === tab 
                  ? (theme === 'dark' ? '#f19115' : '#5c8791')
                  : (theme === 'dark' ? '#3a3b42' : '#f5f5f5'),
                color: activeTab === tab 
                  ? '#ffffff' 
                  : (theme === 'dark' ? '#e0dfe5' : '#333333'),
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab === 'getting-started' && '🚀 Erste Schritte'}
              {tab === 'account' && '👤 Account'}
              {tab === 'shopping' && '🛒 Shopping'}
              {tab === 'faq' && '❓ FAQ'}
            </button>
          ))}
        </div>

        {activeTab === 'getting-started' && (
          <div>
            <h3>🎮 Willkommen bei GameCompass!</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
              
              <div style={{
                padding: '20px',
                backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                border: `2px solid #22c55e`,
                transition: 'all 0.3s ease'
              }}>
                <h4 style={{ color: '#22c55e', marginTop: 0 }}>Schritt 1: Account erstellen</h4>
                <ul>
                  <li>Klicke auf "Registrieren" in der oberen rechten Ecke</li>
                  <li>Wähle zwischen Email-Registrierung oder Social Login (Google/Facebook)</li>
                  <li>Bestätige deine Email-Adresse</li>
                  <li>Vervollständige dein Profil mit Gaming-Präferenzen</li>
                </ul>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: `2px solid #3b82f6`,
                transition: 'all 0.3s ease'
              }}>
                <h4 style={{ color: '#3b82f6', marginTop: 0 }}>Schritt 2: Spiele entdecken</h4>
                <ul>
                  <li>Nutze die Suchfunktion mit Filtern (Genre, Preis, Bewertung)</li>
                  <li>Lass dir von unserem KI-Chat Empfehlungen geben</li>
                  <li>Durchstöbere die "Alle Angebote" Seite</li>
                  <li>Erstelle Wishlists für interessante Spiele</li>
                </ul>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                borderRadius: '12px',
                border: `2px solid #a855f7`,
                transition: 'all 0.3s ease'
              }}>
                <h4 style={{ color: '#a855f7', marginTop: 0 }}>Schritt 3: Kaufen & Genießen</h4>
                <ul>
                  <li>Spiele in den Warenkorb legen</li>
                  <li>Sichere Zahlung über Stripe</li>
                  <li>Game-Keys sofort nach Zahlung erhalten</li>
                  <li>Bewertung schreiben und Community helfen</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div>
            <h3>👤 Account-Verwaltung</h3>
            
            <h4>🔐 Login-Optionen</h4>
            <ul>
              <li><strong>Email + Passwort:</strong> Traditionelle Anmeldung</li>
              <li><strong>Google OAuth:</strong> Ein-Klick Login mit Google-Account</li>
              <li><strong>Facebook Login:</strong> Anmeldung über Facebook</li>
            </ul>

            <h4>⚙️ Profil-Einstellungen</h4>
            <ul>
              <li><strong>Gaming-Präferenzen:</strong> Lieblings-Genres festlegen</li>
              <li><strong>Benachrichtigungen:</strong> Deal-Alerts konfigurieren</li>
              <li><strong>Theme:</strong> Dark/Light Mode umschalten</li>
              <li><strong>Sprache:</strong> Mehrsprachige Unterstützung (geplant)</li>
            </ul>

            <h4>📊 Aktivitäten</h4>
            <ul>
              <li><strong>Bestellhistorie:</strong> Alle getätigten Käufe einsehen</li>
              <li><strong>Bewertungen:</strong> Eigene Reviews verwalten</li>
              <li><strong>Wishlist:</strong> Gewünschte Spiele organisieren</li>
              <li><strong>Chat-Verlauf:</strong> KI-Unterhaltungen nachverfolgen</li>
            </ul>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div>
            <h3>🛒 Shopping-Guide</h3>
            
            <h4>🔍 Spiele finden</h4>
            <div className="code-block">
              <pre><code>{`• Suchleiste: Direkte Spiel-Suche
• Filter: Genre, Preis, Bewertung, Release-Jahr
• KI-Chat: "Finde mir RPGs unter 30€"
• Kategorien: Nach Spieltyp durchstöbern
• Trending: Aktuell beliebte Spiele`}</code></pre>
            </div>

            <h4>💰 Preise & Angebote</h4>
            <ul>
              <li><strong>Preisvergleich:</strong> Beste Deals automatisch angezeigt</li>
              <li><strong>Sale-Events:</strong> Seasonal Sales und Flash-Deals</li>
              <li><strong>Price-Alerts:</strong> Benachrichtigung bei Preis-Drops</li>
              <li><strong>Bundle-Angebote:</strong> Spiele-Pakete mit Rabatten</li>
            </ul>

            <h4>🛡️ Sicherheit</h4>
            <ul>
              <li><strong>Stripe-Zahlung:</strong> Sichere Kreditkarten-Verarbeitung</li>
              <li><strong>SSL-Verschlüsselung:</strong> Alle Daten verschlüsselt</li>
              <li><strong>Käuferschutz:</strong> Geld-zurück-Garantie bei Problemen</li>
              <li><strong>Authentische Keys:</strong> Nur legale Game-Keys</li>
            </ul>
          </div>
        )}

        {activeTab === 'faq' && (
          <div>
            <h3>❓ Häufig gestellte Fragen</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <details style={{
                padding: '15px',
                backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`
              }}>
                <summary style={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  color: theme === 'dark' ? '#f19115' : '#5c8791'
                }}>
                  🎮 Wie erhalte ich meine Game-Keys?
                </summary>
                <p>Nach erfolgreicher Zahlung werden die Game-Keys automatisch per Email versendet und sind sofort in deinem Account verfügbar. Die Aktivierung erfolgt über die jeweilige Gaming-Plattform (Steam, Epic Games, etc.).</p>
              </details>

              <details style={{
                padding: '15px',
                backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                border: `1px solid #22c55e`
              }}>
                <summary style={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  color: '#22c55e'
                }}>
                  💳 Welche Zahlungsmethoden werden akzeptiert?
                </summary>
                <p>Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express), PayPal, SEPA-Lastschrift und viele lokale Zahlungsmethoden über unseren Partner Stripe.</p>
              </details>

              <details style={{
                padding: '15px',
                backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                borderRadius: '8px',
                border: `1px solid #a855f7`
              }}>
                <summary style={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  color: '#a855f7'
                }}>
                  🤖 Wie funktioniert der KI-Chat?
                </summary>
                <p>Unser KI-Assistent nutzt lokale LLM-Technologie und kann dir personalisierte Spielempfehlungen geben. Frage einfach: "Empfiehl mir ein Indie-RPG" oder "Was sind die besten Strategie-Spiele 2024?"</p>
              </details>

              <details style={{
                padding: '15px',
                backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                border: `1px solid #ef4444`
              }}>
                <summary style={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  color: '#ef4444'
                }}>
                  🔄 Kann ich Spiele zurückgeben?
                </summary>
                <p>Digital aktivierte Spiele können aufgrund ihrer Natur normalerweise nicht zurückgegeben werden. Bei technischen Problemen oder defekten Keys bieten wir jedoch Ersatz oder Rückerstattung innerhalb von 48 Stunden.</p>
              </details>

              <details style={{
                padding: '15px',
                backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                border: `1px solid #3b82f6`
              }}>
                <summary style={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  color: '#3b82f6'
                }}>
                  🌍 Sind die Spiele regional gesperrt?
                </summary>
                <p>Wir kennzeichnen alle regionalen Beschränkungen deutlich. Die meisten unserer Keys sind global aktivierbar. Bei EU-Keys wird dies explizit angegeben.</p>
              </details>

              <details style={{
                padding: '15px',
                backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                borderRadius: '8px',
                border: `1px solid #fb923c`
              }}>
                <summary style={{ 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  color: '#fb923c'
                }}>
                  📱 Gibt es eine mobile App?
                </summary>
                <p>Derzeit ist GameCompass als responsive Webseite verfügbar, die auf allen Geräten funktioniert. Eine native mobile App und PWA sind in Planung für 2024.</p>
              </details>

            </div>
          </div>
        )}
      </div>

      <div className="section">
        <h2>💬 Kontakt & Support</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>📧 Email-Support</h4>
            <p><strong>support@gamecompass.de</strong></p>
            <p>Antwortzeit: 24-48 Stunden</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>💬 Live-Chat</h4>
            <p><strong>In-App KI-Assistent</strong></p>
            <p>24/7 verfügbar für Produktfragen</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>📚 Community</h4>
            <p><strong>Discord Server</strong></p>
            <p>Community-Support & Gaming-Tipps</p>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🎯 Pro-Tipps für Power-User</h2>
        
        <ul>
          <li><strong>Keyboard Shortcuts:</strong> 'Ctrl+K' für Schnellsuche</li>
          <li><strong>Advanced Filters:</strong> Kombiniere mehrere Filter für präzise Ergebnisse</li>
          <li><strong>Price Tracking:</strong> Aktiviere Benachrichtigungen für Wunschlisten-Items</li>
          <li><strong>Bulk Actions:</strong> Mehrere Spiele gleichzeitig zum Warenkorb hinzufügen</li>
          <li><strong>Review Power:</strong> Detaillierte Reviews helfen der Community und dir</li>
          <li><strong>Social Features:</strong> Teile deine Lieblingsspiele mit Freunden</li>
        </ul>
      </div>
    </div>
  );
}; 