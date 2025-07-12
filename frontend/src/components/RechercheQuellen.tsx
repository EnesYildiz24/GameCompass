import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const RechercheQuellen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🔍</span> <span className="gradient-text">Recherche & Quellen</span></h1>
      <p className="subtitle">Alle verwendeten Ressourcen, KI-Tools und Recherchequellen für GameCompass</p>
      
      <div className="section">
        <h2>🤖 KI-Assistenten</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
          
          {/* ChatGPT */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(16, 163, 127, 0.1)' : 'rgba(16, 163, 127, 0.1)',
            borderRadius: '12px',
            border: `2px solid #10a37f`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#10a37f',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                💬
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#10a37f' }}>
                ChatGPT (OpenAI)
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                <strong>Verwendung:</strong> Code-Generierung, Debugging, Architektur-Planung, Dokumentation
              </p>
              <p style={{ margin: '0', fontSize: '14px', opacity: '0.8' }}>
                Besonders hilfreich bei React-Komponenten, TypeScript-Interfaces und MongoDB-Schema-Design
              </p>
            </div>
          </div>

          {/* Claude */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#fb923c',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                🧠
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#fb923c' }}>
                Claude (Anthropic)
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                <strong>Verwendung:</strong> Komplexe Codeanalyse, Refactoring, Best Practices, Sicherheitsaspekte
              </p>
              <p style={{ margin: '0', fontSize: '14px', opacity: '0.8' }}>
                Exzellent für Backend-Logik, API-Design und fortgeschrittene TypeScript-Patterns
              </p>
            </div>
          </div>

          {/* ElevenLabs */}
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #8b5cf6`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                🎤
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#8b5cf6' }}>
                ElevenLabs
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                <strong>Verwendung:</strong> Audio-Features, Sprachsynthese für Chat-System
              </p>
              <p style={{ margin: '0', fontSize: '14px', opacity: '0.8' }}>
                Für Text-to-Speech Funktionalität im GameCompass Chat-System
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📚 Entwicklungsressourcen</h2>
        
        <h3>🌐 Online-Plattformen</h3>
        <ul>
          <li><strong>Stack Overflow:</strong> Problem-Lösungen für React, Node.js, MongoDB</li>
          <li><strong>GitHub Discussions:</strong> Community-Best-Practices</li>
          <li><strong>MDN Web Docs:</strong> Web-Standards und Browser-APIs</li>
          <li><strong>React Docs:</strong> Offizielle React-Dokumentation</li>
          <li><strong>TypeScript Handbook:</strong> Type-System Referenz</li>
        </ul>

        <h3>🎥 Video-Tutorials</h3>
        <ul>
          <li><strong>YouTube Channels:</strong>
            <ul>
              <li>Traversy Media - MERN Stack Tutorials</li>
              <li>Net Ninja - React & TypeScript</li>
              <li>Academind - Full-Stack Development</li>
              <li>Dev Ed - Modern Web Development</li>
            </ul>
          </li>
        </ul>

        <h3>📖 Dokumentationen</h3>
        <ul>
          <li><strong>Vite:</strong> Build-Tool Konfiguration</li>
          <li><strong>Express.js:</strong> Backend-Framework</li>
          <li><strong>Mongoose:</strong> MongoDB-Integration</li>
          <li><strong>Stripe:</strong> Payment-Processing</li>
          <li><strong>PassportJS:</strong> Authentication-Strategien</li>
          <li><strong>ChromaDB:</strong> Vector-Database für KI-Features</li>
        </ul>
      </div>

      <div className="section">
        <h2>🔧 Technische Recherche</h2>
        
        <h3>APIs & Integrationen</h3>
        <div className="code-block">
          <pre><code>{`• RAWG Games Database API - Spieldaten
• Facebook Graph API - Social Login  
• Google OAuth 2.0 - Authentication
• Stripe API - Zahlungsabwicklung
• Ollama - Lokale LLM Integration
• ChromaDB - Vector Search`}</code></pre>
        </div>

        <h3>Architektur-Patterns</h3>
        <ul>
          <li><strong>MVC Pattern:</strong> Backend-Strukturierung</li>
          <li><strong>Component Pattern:</strong> React-Architektur</li>
          <li><strong>Service Layer:</strong> Business-Logic Kapselung</li>
          <li><strong>Repository Pattern:</strong> Datenbank-Abstraktion</li>
          <li><strong>Middleware Pattern:</strong> Request-Processing</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎯 Spezielle Lösungsansätze</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>🔍 Vector Search</h4>
            <p>ChromaDB + Ollama für semantische Spielsuche implementiert</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ef4444`
          }}>
            <h4 style={{ color: '#ef4444', marginTop: 0 }}>🔐 Auth System</h4>
            <p>Multi-Provider OAuth mit Passport.js & JWT Tokens</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>💳 Payments</h4>
            <p>Stripe Integration mit Session-Management</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>🤖 AI Chat</h4>
            <p>Lokales LLM mit Kontext-Verstehen für Spielberatung</p>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📝 Recherche-Methodik</h2>
        <ol>
          <li><strong>Problem-Identifikation:</strong> Konkrete Herausforderung definieren</li>
          <li><strong>Multi-Source-Ansatz:</strong> KI-Assistenten + Community + Docs</li>
          <li><strong>Code-Iteration:</strong> Prototyping → Testing → Refactoring</li>
          <li><strong>Best-Practice-Validation:</strong> Industry Standards prüfen</li>
          <li><strong>Performance-Testing:</strong> Real-world Scenarios testen</li>
        </ol>
      </div>
    </div>
  );
}; 