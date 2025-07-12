import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const UnterstützteProgramme: React.FC = () => {
  const { theme } = useTheme();

  const categories = [
    {
      title: 'Frontend-Entwicklung',
      icon: '🖥️',
      tools: [
        'React - JavaScript-Framework für Benutzeroberflächen',
        'TypeScript - Typisierte Erweiterung von JavaScript',
        'Vite - Build-Tool und Development Server',
        'HTML5 - Markup-Sprache für Webseiten',
        'CSS3 - Stylesheet-Sprache für Design',
        'ESLint - Code-Qualität und Fehlerprüfung'
      ]
    },
    {
      title: 'Backend-Entwicklung',
      icon: '⚙️',
      tools: [
        'Node.js - JavaScript-Laufzeitumgebung',
        'Express.js - Web-Framework für Node.js',
        'Mongoose - MongoDB-Object-Modeling für Node.js',
        'JWT - JSON Web Tokens für Authentifizierung',
        'Passport.js - Authentifizierungs-Middleware',
        'Nodemailer - E-Mail-Versand für Node.js'
      ]
    },
    {
      title: 'Datenbanken',
      icon: '🗄️',
      tools: [
        'MongoDB - NoSQL-Dokumentendatenbank',
        'ChromaDB - Vektordatenbank für KI/ML',
        'MongoDB Atlas - Cloud-Database-Service'
      ]
    },
    {
      title: 'Zahlungssystem',
      icon: '💳',
      tools: [
        'Stripe - Zahlungsabwicklung und Marketplace',
        'Stripe Connect - Multi-Party-Zahlungen',
        'Stripe Webhooks - Event-basierte Benachrichtigungen'
      ]
    },
    {
      title: 'KI & Machine Learning',
      icon: '🤖',
      tools: [
        'Ollama - Lokale Large Language Models',
        'ElevenLabs - Text-to-Speech API',
        'LangChain - Framework für LLM-Anwendungen',
        'ChromaDB - Vektorsuche für Embeddings'
      ]
    },
    {
      title: 'Authentifizierung',
      icon: '🔐',
      tools: [
        'OAuth 2.0 - Autorisierungs-Framework',
        'Google OAuth - Google-Anmeldung',
        'Facebook OAuth - Facebook-Anmeldung',
        'JWT - Token-basierte Authentifizierung'
      ]
    },
    {
      title: 'Development Tools',
      icon: '🔧',
      tools: [
        'Git - Versionskontrolle',
        'GitLab - Code-Repository und CI/CD',
        'npm - Package Manager für JavaScript',
        'Prettier - Code-Formatierung',
        'Jest - JavaScript-Testing-Framework',
        'Selenium - Browser-Automatisierung für Tests'
      ]
    },
    {
      title: 'Design & Prototyping',
      icon: '🎨',
      tools: [
        'Figma - UI/UX-Design und Prototyping',
        'Adobe Creative Suite - Grafikdesign',
        'Verdana - Hauptschriftart der Anwendung'
      ]
    },
    {
      title: 'Deployment & Hosting',
      icon: '🚀',
      tools: [
        'Vercel - Frontend-Hosting und Deployment',
        'Docker - Containerisierung',
        'GitLab CI/CD - Continuous Integration/Deployment'
      ]
    },
    {
      title: 'API & Integration',
      icon: '🔗',
      tools: [
        'REST API - Schnittstellen-Architektur',
        'Swagger - API-Dokumentation',
        'CORS - Cross-Origin Resource Sharing',
        'Axios - HTTP-Client für API-Calls'
      ]
    },
    {
      title: 'Testing & Qualitätssicherung',
      icon: '🧪',
      tools: [
        'Jest - Unit- und Integration-Tests',
        'Selenium - End-to-End-Tests',
        'Postman - API-Testing',
        'ESLint - Code-Qualitätsprüfung'
      ]
    },
    {
      title: 'Kommunikation & Dokumentation',
      icon: '📚',
      tools: [
        'Discord - Team-Kommunikation',
        'Markdown - Dokumentationsformat',
        'Wiki-System - Interne Dokumentation',
        'Mermaid - Diagramm-Erstellung'
      ]
    },
    {
      title: 'Verwendete KIs',
      icon: '🧠',
      tools: [
        'Claude (Anthropic) - KI-Assistent für Code-Entwicklung und Dokumentation',
        'ChatGPT (OpenAI) - Conversational AI für Problemlösung und Ideenfindung',
        'GitHub Copilot - KI-Programmierassistent für Code-Vervollständigung',
        'Ollama - Lokale LLM-Inference für GameCompass ChatBot',
        'ElevenLabs - Text-to-Speech KI für Sprachsynthese',
        'DeepSeek - Alternative LLM-Option für Entwicklungsunterstützung'
      ]
    }
  ];

  return (
    <div className="service-detail-container">
      <h1><span>🛠️</span> <span className="gradient-text">Unterstützte Programme für unser Projekt</span></h1>
      <p className="subtitle">Übersicht aller verwendeten Tools, Frameworks und Technologien im GameCompass-Projekt</p>
      
      <div className="section">
        <p>Diese Liste dokumentiert alle Programme, Tools und Technologien, die während der Entwicklung des GameCompass-Projekts verwendet wurden.</p>
      </div>

      <div className="section">
        {categories.map((category, index) => (
          <div key={index} style={{ marginBottom: '30px' }}>
            <div
              style={{
                padding: '25px',
                backgroundColor: theme === 'dark' ? 'rgba(37, 37, 44, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ 
                margin: '0 0 20px 0', 
                color: theme === 'dark' ? '#f19115' : '#5c8791',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.8rem' }}>{category.icon}</span>
                {category.title}
              </h2>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {category.tools.map((tool, toolIndex) => (
                  <li key={toolIndex} style={{
                    padding: '10px 0',
                    borderBottom: toolIndex < category.tools.length - 1 
                      ? `1px solid ${theme === 'dark' ? 'rgba(158, 158, 158, 0.2)' : 'rgba(0, 0, 0, 0.1)'}` 
                      : 'none',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <span style={{ 
                      color: theme === 'dark' ? '#f19115' : '#5c8791',
                      fontWeight: 'bold',
                      minWidth: '8px'
                    }}>•</span>
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="section">
        <div style={{
          padding: '20px',
          backgroundColor: theme === 'dark' ? 'rgba(241, 145, 21, 0.1)' : 'rgba(92, 135, 145, 0.1)',
          borderRadius: '12px',
          border: `2px solid ${theme === 'dark' ? '#f19115' : '#5c8791'}`,
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#f19115' : '#5c8791'
          }}>
            Vollständige Tool-Liste für das GameCompass-Projekt (Stand: Juni 2025)
          </p>
        </div>
      </div>
    </div>
  );
}; 