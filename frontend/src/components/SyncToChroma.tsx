import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';

export const SyncToChroma: React.FC = () => {
  const { theme } = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mermaidChart = `
sequenceDiagram
    participant Dev as 👨‍💻 Entwickler
    participant Script as 📄 Script
    participant MongoDB as 🗄️ Spiele-Datenbank
    participant ChromaDB as 🔍 Such-Datenbank

    Dev->>Script: Script starten
    Script->>MongoDB: Verbinde zur Datenbank
    MongoDB-->>Script: ✅ Verbunden
    
    Script->>MongoDB: Hole alle Spiele
    MongoDB-->>Script: Portal 2, Tetris, FIFA...
    
    Script->>ChromaDB: Mache Spiele durchsuchbar
    Note over ChromaDB: Verwandelt Spieltexte<br/>in Such-Vektoren
    ChromaDB-->>Script: ✅ Fertig
    
    Script-->>Dev: "1000 Spiele sind jetzt durchsuchbar!"
  `;

  return (
    <div className="service-detail-container">
      <h1><span>📁</span> <span className="gradient-text">syncToChroma.ts</span></h1>
      <p className="subtitle">Automatisierte Synchronisation von GameCompass-Daten zur ChromaDB</p>
      
      <div className="section">
        <h2>🔍 Wie es in ChromaDB gelangt</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
          
          {/* Schritt 1 */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
            borderRadius: '12px',
            border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: theme === 'dark' ? '#f19115' : '#5c8791',
                color: theme === 'dark' ? '#2d2e35' : '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                1️⃣
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: theme === 'dark' ? '#f19115' : '#5c8791' }}>
                MongoDB verbinden
              </h3>
              <p style={{ margin: '0', fontSize: '16px' }}>
                <code style={{ 
                  backgroundColor: theme === 'dark' ? '#34353b' : '#f8f9fa',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  await mongoose.connect(process.env.MONGODB_URI!)
                </code>
              </p>
            </div>
          </div>

          {/* Schritt 2 */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(139, 195, 74, 0.1)' : 'rgba(139, 195, 74, 0.1)',
            borderRadius: '12px',
            border: `2px solid #8bc34a`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#8bc34a',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                2️⃣
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#8bc34a' }}>
                Alle Spiele laden
              </h3>
              <p style={{ margin: '0', fontSize: '16px' }}>
                <code style={{ 
                  backgroundColor: theme === 'dark' ? '#34353b' : '#f8f9fa',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  const spiele = await Spiel.find().lean()
                </code>
              </p>
            </div>
          </div>

          {/* Schritt 3 */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.1)',
            borderRadius: '12px',
            border: `2px solid #9c27b0`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#9c27b0',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                3️⃣
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#9c27b0' }}>
                Zu ChromaDB übertragen
              </h3>
              <p style={{ margin: '0', fontSize: '16px' }}>
                <code style={{ 
                  backgroundColor: theme === 'dark' ? '#34353b' : '#f8f9fa',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  await chromaService.upsertGames(spiele)
                </code>
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>⚙️ ChromaService macht intern</h2>
        <div 
          className="code-block"
          style={{
            overflow: 'visible',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'visible',
            width: '100%',
          }}><code>// Jedes Spiel wird zu Vektor-Dokument:
{`{
  id: "spiel_mongodb_id",
  document: "Portal 2. Puzzle-Plattformspiel. Preis: 29 Euro.",
  metadata: { price: 29.99, rating: 4.8, genres: "Puzzle" }
}`}</code></pre>
        </div>
        <div style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#f19115' : '#5c8791'
        }}>
          <p>Workflow: MongoDB Spiele → upsertGames() → ChromaDB Vektoren</p>
          <p>Fertig! 🎯</p>
        </div>
      </div>

      <div className="section">
        <h2>📊 setupPrompts.ts & syncToChroma.ts Workflow</h2>
        <h3>syncToChroma.ts Sequenzdiagramm</h3>
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
                📁 syncToChroma.ts Workflow
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