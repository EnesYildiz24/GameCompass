import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ArchitekturChatSystem: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🏗️</span> <span className="gradient-text">Architektur des Chat-Systems</span></h1>
      <p className="subtitle">Grundlegende Architektur und Komponenten des GameCompass KI-Chat-Systems</p>
      
      <div className="section">
        <h2>📝 Übersicht</h2>
        <p>Das Chat-System von GameCompass besteht aus mehreren Komponenten, die nahtlos zusammenarbeiten, um Benutzeranfragen zu verarbeiten. Es umfasst Frontend-Komponenten (AudioChat und Chatbot), ein Backend-API-System und eine Integration mit dem Ollama 3.1 LLM.</p>
      </div>

      <div className="section">
        <h2>🏛️ Systemarchitektur</h2>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Frontend</strong></td>
                <td>React-Komponenten für Text- und Sprachinteraktion</td>
              </tr>
              <tr>
                <td><strong>Backend</strong></td>
                <td>Express-Router für die API-Verwaltung und Datenbankoperationen</td>
              </tr>
              <tr>
                <td><strong>Datenbank</strong></td>
                <td>MongoDB zur Speicherung von Chat-Verläufen und Sessions</td>
              </tr>
              <tr>
                <td><strong>LLM</strong></td>
                <td>Ollama 3.1 für die Verarbeitung natürlicher Sprache</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Datenfluss</h2>
        
        <div className="subsection">
          <h3>1. Benutzeranfrage (Frontend → Backend)</h3>
          <div className="step-card">
            <h4>AudioChat.tsx:</h4>
            <ul className="relationships-list">
              <li>Nimmt Spracheingabe über das Mikrofon auf</li>
              <li>Konvertiert Sprache zu Text</li>
              <li>Sendet Text an /api/chat</li>
            </ul>
          </div>
          <div className="step-card">
            <h4>Chatbot.tsx:</h4>
            <ul className="relationships-list">
              <li>Nimmt Texteingabe entgegen</li>
              <li>Verwaltet Chat-Sessions und Verlauf</li>
              <li>Sendet Anfragen an:
                <ul>
                  <li>/api/chat (neue Nachrichten)</li>
                  <li>/api/chat/sessions (verfügbare Sessions)</li>
                  <li>/api/chat/history/:sessionId (Nachrichten einer Session)</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="subsection">
          <h3>2. API-Verarbeitung (Backend)</h3>
          <div className="step-card">
            <h4>chat.ts:</h4>
            <ul className="relationships-list">
              <li>Empfängt Anfragen vom Frontend</li>
              <li>Speichert neue Nachrichten in der Datenbank</li>
              <li>Lädt Konversationsverlauf</li>
              <li>Bereitet die Anfrage für das LLM vor</li>
              <li>Fügt sprachspezifische Anweisungen hinzu</li>
            </ul>
          </div>
        </div>

        <div className="subsection">
          <h3>3. LLM-Verarbeitung (Ollama)</h3>
          <div className="step-card">
            <h4>Ollama 3.1:</h4>
            <ul className="relationships-list">
              <li>Empfängt Prompt mit Konversationsverlauf</li>
              <li>Verarbeitet die Anfrage basierend auf Kontext und Anweisungen</li>
              <li>Generiert eine kontextbezogene Antwort</li>
              <li>Sendet die Antwort zurück an das Backend</li>
            </ul>
          </div>
        </div>

        <div className="subsection">
          <h3>4. Antwortübermittlung (Backend → Frontend)</h3>
          <div className="step-card">
            <h4>Backend:</h4>
            <ul className="relationships-list">
              <li>Speichert die LLM-Antwort in der Datenbank</li>
              <li>Leitet die Antwort an das Frontend weiter</li>
            </ul>
          </div>
          <div className="step-card">
            <h4>Frontend (nach Empfang):</h4>
            <ul className="relationships-list">
              <li><strong>AudioChat.tsx:</strong>
                <ul>
                  <li>Konvertiert die Textantwort zu Sprache über ElevenLabs API</li>
                  <li>Spielt die generierte Sprachdatei ab</li>
                </ul>
              </li>
              <li><strong>Chatbot.tsx:</strong>
                <ul>
                  <li>Zeigt die Textantwort im Chat-Interface an</li>
                  <li>Aktualisiert den Chatverlauf</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Technische Details</h2>
        
        <div className="subsection">
          <h3>Frontend</h3>
          <ul className="relationships-list">
            <li><strong>Implementiert in:</strong> React mit TypeScript</li>
            <li><strong>Hauptkomponenten:</strong>
              <ul>
                <li>AudioChat.tsx – Sprachgesteuerter Chat mit ElevenLabs TTS</li>
                <li>Chatbot.tsx – Textbasierter Chat mit Session-Management</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="subsection">
          <h3>Backend</h3>
          <ul className="relationships-list">
            <li><strong>Implementiert in:</strong> Express.js mit TypeScript</li>
            <li><strong>Endpunkte:</strong>
              <ul>
                <li>POST /api/chat – Neue Nachrichten verarbeiten</li>
                <li>GET /api/chat/history/:sessionId – Chatverlauf abrufen</li>
                <li>DELETE /api/chat/history/:sessionId – Chatverlauf löschen</li>
                <li>GET /api/chat/sessions – Verfügbare Sessions abrufen</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="subsection">
          <h3>Datenbank</h3>
          <ul className="relationships-list">
            <li><strong>MongoDB Schema:</strong>
              <ul>
                <li>ChatHistory – Speichert Nachrichten und Sessions</li>
                <li>Felder: userId, sessionId, messages (Array)</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="subsection">
          <h3>Sprachunterstützung</h3>
          <div className="languages-grid">
            <div className="language-card">🇩🇪 Deutsch (de)</div>
            <div className="language-card">🇬🇧 Englisch (en)</div>
            <div className="language-card">🇪🇸 Spanisch (es)</div>
            <div className="language-card">🇫🇷 Französisch (fr)</div>
            <div className="language-card">🇷🇺 Russisch (ru)</div>
            <div className="language-card">🇹🇷 Türkisch (tr)</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>✨ Besonderheiten</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🎤 Zweiwege-Sprachinteraktion</h4>
            <ul>
              <li>Spracherkennung (Mikrofon → Text)</li>
              <li>Sprachsynthese (Text → Audio mit ElevenLabs)</li>
            </ul>
          </div>
          
          <div className="method-card">
            <h4>📱 Session-Management</h4>
            <ul>
              <li>Persistente Chat-Sessions</li>
              <li>Möglichkeit zum Wechseln zwischen Sessions</li>
              <li>Vollständige Verlaufsverwaltung</li>
            </ul>
          </div>
          
          <div className="method-card">
            <h4>🌍 Mehrsprachige Unterstützung</h4>
            <ul>
              <li>Automatische Spracherkennung</li>
              <li>Sprachspezifische Anweisungen für natürlichere Antworten</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 