import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const GameCompassDatenmodell: React.FC = () => {
  const { theme } = useTheme();
  const [showCommerceDiagram, setShowCommerceDiagram] = useState(false);
  const [showChatDiagram, setShowChatDiagram] = useState(false);

  const commerceERChart = `
erDiagram
    USER ||--o{ USER_ROLE : has
    USER_ROLE }o--|| ROLE : "is"

    USER ||--o{ SPIEL : creates

    USER ||--o{ OFFER : publishes
    OFFER }o--|| SPIEL : for

    USER |o--|| CART : "owns (0..1)"
    CART ||--o{ CART_ITEM : contains
    CART_ITEM }|..|| OFFER : refersTo

    USER ||--o{ BESTELLUNG : places
    BESTELLUNG ||--o{ BESTELLUNG_ITEM : includes
    BESTELLUNG_ITEM }|..|| OFFER : for

    USER ||--o{ BEWERTUNG : writes
    SPIEL ||--o{ BEWERTUNG : receives

    BESTELLUNG ||--o{ PAYMENT : paidBy
  `;

  const chatERChart = `
erDiagram
    USER ||--o{ CHAT_SESSION : "starts"
    CHAT_SESSION ||--o{ CHAT_MESSAGE : "contains"

    CHAT_PROMPT ||--o{ CHAT_MESSAGE : "uses (optional)"

    CHAT_SESSION {
        string  sessionId  PK
        date    createdAt
        date    updatedAt
    }

    CHAT_MESSAGE {
        string  id         PK
        string  sessionId  FK
        enum    role       "user | assistant"
        string  content
        date    timestamp
    }

    CHAT_PROMPT {
        string  id         PK
        enum    type       "genre | preference | …"
        string  question
        enum    responseType
    }
  `;

  const renderDiagram = (chart: string, title: string, popupType: string, borderColor: string) => (
    <div 
      onClick={() => popupType === 'commerce' ? setShowCommerceDiagram(true) : setShowChatDiagram(true)}
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: theme === 'dark' ? 'rgba(37, 37, 44, 0.3)' : 'rgba(255, 255, 255, 0.8)',
        position: 'relative',
        margin: '20px 0'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(37, 37, 44, 0.3)' : 'rgba(255, 255, 255, 0.8)';
      }}
      title="Klicken zum Vergrößern"
    >
      <Mermaid chart={chart} theme={theme === 'dark' ? 'dark' : 'light'} />
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: borderColor,
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        🔍 Klicken zum Vergrößern
      </div>
    </div>
  );

  const renderPopup = (chart: string, title: string, show: boolean, setShow: (show: boolean) => void, borderColor: string) => (
    show && (
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
        onClick={() => setShow(false)}
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
            border: `3px solid ${borderColor}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShow(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '40px',
              height: '40px',
              backgroundColor: borderColor,
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
          <div style={{ paddingTop: '20px' }}>
            <h2 style={{ 
              color: borderColor,
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '24px',
            }}>
              {title}
            </h2>
            <div style={{ 
              transform: 'scale(1.2)', 
              transformOrigin: 'center',
              minHeight: '600px',
            }}>
              <Mermaid chart={chart} theme={theme === 'dark' ? 'dark' : 'light'} />
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="service-detail-container">
      <h1><span>🗄️</span> <span className="gradient-text">GameCompass – Datenmodell</span></h1>
      <p className="subtitle">Stand: 17. Juni 2025 - Aktuelles logisches Datenmodell des GameCompass‑Marktplatzes</p>
      
      <div className="section">
        <p>Diese Datei fasst das <strong>aktuelle logische Datenmodell</strong> des GameCompass‑Marktplatzes zusammen, basierend auf den vorhandenen Mongoose‑Schemas und den noch offenen Architekturentscheidungen.</p>
      </div>

      <div className="section">
        <h2>1️⃣ Überblick der Kern‑Entitäten</h2>
        
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Entity</th>
                <th>Zweck</th>
                <th>Wichtige Attribute</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>User</strong></td>
                <td>Gemeinsame Basis für alle Nutzer (Admin + Buyer)</td>
                <td><code>email</code>, <code>password</code> <em>(bei local)</em>, <code>role</code> (<code>admin</code>|<code>buyer</code>), <code>provider</code>, <code>isPublisher</code>, <code>stripeAccountId</code>, <code>verified</code>, <em>timestamps</em></td>
              </tr>
              <tr>
                <td><strong>Admin</strong></td>
                <td>Spezialisierter User mit Rechteset</td>
                <td><code>permissions: string[]</code></td>
              </tr>
              <tr>
                <td><strong>Buyer</strong></td>
                <td>Spezialisierter User mit Checkout‑Infos</td>
                <td><code>shippingAddress</code>, <code>paymentMethods</code></td>
              </tr>
              <tr>
                <td><strong>Spiel</strong></td>
                <td>Spielmetadaten & Store‑Anzeigen</td>
                <td><code>name</code>, <code>description</code>, <code>price</code>, <code>developer</code>, <code>background_image</code>, <code>rating</code>, <code>genres</code>, <code>platforms</code>, <code>screenshots</code>…</td>
              </tr>
              <tr>
                <td><strong>Offer</strong></td>
                <td>Konkretes Angebot zu einem Spiel (sofern mehrere Preise, Keys etc.)</td>
                <td><code>game</code> → <em>Spiel</em>, <code>seller</code> → <em>User</em>, <code>price</code>, <code>condition</code> (<code>new</code>|<code>used</code>)</td>
              </tr>
              <tr>
                <td><strong>Cart</strong></td>
                <td>Aktueller Warenkorb eines Users</td>
                <td><code>userId</code> → <em>User</em>, <code>items[]</code>, <code>updatedAt</code></td>
              </tr>
              <tr>
                <td><strong>CartItem</strong></td>
                <td>Ein Posten im Warenkorb</td>
                <td><code>gameId</code> → <em>Spiel</em> <strong>oder</strong> <code>offerId</code> → <em>Offer</em> (✱ Entscheidung offen), <code>price</code>, <code>quantity</code></td>
              </tr>
              <tr>
                <td><strong>Bestellung</strong></td>
                <td>Fixierte Order</td>
                <td><code>userId</code>, <code>products[]</code>, <code>price</code>, <code>status</code>, <em>Stripe‑IDs</em>, <em>timestamps</em></td>
              </tr>
              <tr>
                <td><strong>BestellungItem</strong></td>
                <td>Einzelposten der Order</td>
                <td><code>spielId</code> / <code>offerId</code>, <code>name</code>, <code>price</code>, <code>amount</code></td>
              </tr>
              <tr>
                <td><strong>Bewertung</strong></td>
                <td>Review zu einem Spiel</td>
                <td><code>userId</code>, <code>spielId</code>, <code>comment</code>, <code>stars</code>, <em>timestamps</em></td>
              </tr>
              <tr>
                <td><strong>Genre</strong></td>
                <td>Genre‑Taxonomie</td>
                <td><code>name</code>, <code>description</code>, <code>germanName</code>, <code>aliases</code>, <code>popularity</code></td>
              </tr>
              <tr>
                <td><strong>ChatHistory</strong></td>
                <td>Conversation‑Log für Empfehlungen</td>
                <td><code>userId</code>, <code>sessionId</code>, <code>messages[]</code>, <em>timestamps</em></td>
              </tr>
              <tr>
                <td><strong>ChatPrompt</strong></td>
                <td>Prompt‑Vorlagen</td>
                <td><code>type</code>, <code>question</code>, <code>responseType</code>, <code>rules</code>, <code>examples</code>…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>2️⃣ Mermaid‑ER‑Diagramme</h2>
        
        <div className="subsection">
          <h3>2.1 Commerce‑Kontext</h3>
          {renderDiagram(commerceERChart, '🛒 Commerce‑Kontext ER-Diagramm', 'commerce', theme === 'dark' ? '#f19115' : '#5c8791')}
          
          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.1)',
            borderRadius: '8px',
            border: '2px solid #9c27b0',
            borderLeft: '6px solid #9c27b0',
            margin: '15px 0'
          }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              <strong>Hinweis:</strong> Noch in der Bearbeitung.
            </p>
          </div>
        </div>

        <div className="subsection">
          <h3>2.2 KI‑Chat‑Kontext</h3>
          {renderDiagram(chatERChart, '🤖 KI‑Chat‑Kontext ER-Diagramm', 'chat', theme === 'dark' ? '#ff6b35' : '#4a6fa5')}
        </div>
      </div>

      <div className="section">
        <h2>3️⃣ Offene Architekturentscheidungen</h2>
        
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Frage</th>
                <th>Aktueller Favorit</th>
                <th>Auswirkung bei <strong>Ja</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1</strong></td>
                <td>Dynamische Preise / Mehrfach‑Offers je Spiel?</td>
                <td><em>Unklar</em></td>
                <td><code>CartItem</code> & <code>BestellungItem</code> → <code>offerId</code>, <code>Offer</code> wird zentraler.</td>
              </tr>
              <tr>
                <td><strong>2</strong></td>
                <td>Review nur nach Kauf zulassen?</td>
                <td><em>Unklar</em></td>
                <td>Entweder Business‑Rule prüfen oder <code>orderId</code> in <code>Bewertung</code> speichern.</td>
              </tr>
              <tr>
                <td><strong>3</strong></td>
                <td>Soft‑Delete / DSGVO‑Konformität?</td>
                <td>derzeit <strong>nein</strong></td>
                <td><code>deletedAt</code> / <code>isActive</code> in User/Spiel/Offer.</td>
              </tr>
              <tr>
                <td><strong>4</strong></td>
                <td>Mehrwährungs‑Support?</td>
                <td>derzeit <strong>nein</strong></td>
                <td>Zusätzliche Preistabellen oder Currency‑Felder.</td>
              </tr>
              <tr>
                <td><strong>5</strong></td>
                <td>Zahlungen & Refunds als eigene Collection?</td>
                <td>Stripe‑IDs direkt in <em>Bestellung</em></td>
                <td>Separate <code>Payment</code>‑Entität nur falls Refunds/Teilzahlungen nötig.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>4️⃣ Nächste Schritte</h2>
        
        <div className="step-card">
          <h4>📋 To-Do Liste</h4>
          <ol className="relationships-list">
            <li>Entscheidungen in Tabelle 3 finalisieren.</li>
            <li>Schema‑Updates in Mongoose durchführen (z. B. <code>offerId</code> vs <code>spielId</code>).</li>
            <li>Indexe & Validierungsregeln definieren (z. B. <code>unique: true</code> für <code>email</code>, Compound‑Index auf <code>userId</code> + <code>spielId</code> bei <code>Bewertung</code>).</li>
            <li>Falls Soft‑Delete gewünscht → Service‑Layer anpassen (<code>find({"{ isActive: true }"}</code>).</li>
            <li>Dokumentation im Wiki / README mit diesem Markdown verlinken.</li>
          </ol>
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
      </div>

      {/* Render Popups */}
      {renderPopup(commerceERChart, '🛒 Commerce‑Kontext ER-Diagramm', showCommerceDiagram, setShowCommerceDiagram, theme === 'dark' ? '#f19115' : '#5c8791')}
      {renderPopup(chatERChart, '🤖 KI‑Chat‑Kontext ER-Diagramm', showChatDiagram, setShowChatDiagram, theme === 'dark' ? '#ff6b35' : '#4a6fa5')}
    </div>
  );
}; 