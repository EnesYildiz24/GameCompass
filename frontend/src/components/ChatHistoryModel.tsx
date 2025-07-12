import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ChatHistoryModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60fa1c3b5311236168a10d88",
  "userId": "60d0fe4f5311236168a109ca",
  "sessionId": "sess_abc123xyz",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "Welche Genres magst du?",
      "timestamp": "2025-06-17T15:30:00.000Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "Ich empfehle dir RPGs und Adventure.",
      "timestamp": "2025-06-17T15:30:01.000Z"
    }
  ],
  "createdAt": "2025-06-17T15:30:00.000Z",
  "updatedAt": "2025-06-17T15:30:01.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>📜</span> <span className="gradient-text">ChatHistory & ChatMessage Models</span></h1>
      <p className="subtitle">Die ChatHistory-Kollektion speichert komplette Chat-Sessions, während ChatMessage einzelne Nachrichten innerhalb dieser Sessions abbildet. Gemeinsam ermöglichen sie die Persistenz von Nutzer- und KI-Interaktionen.</p>
      
      <div className="section">
        <h2>📋 Schema-Felder</h2>
        
        <h3>ChatMessage</h3>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Feld</th>
                <th>Typ</th>
                <th>Beschreibung</th>
                <th>Erforderlich</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td>ObjectId</td>
                <td>Automatisch generierter Primärschlüssel</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>role</code></td>
                <td>String</td>
                <td>Rolle der Nachricht: 'user' oder 'assistant'</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>content</code></td>
                <td>String</td>
                <td>Inhalt der Nachricht</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>timestamp</code></td>
                <td>Date</td>
                <td>Zeitstempel der Nachricht</td>
                <td>ja</td>
                <td>Date.now()</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>ChatHistory</h3>
        <div className="fields-table">
          <table>
            <thead>
              <tr>
                <th>Feld</th>
                <th>Typ</th>
                <th>Beschreibung</th>
                <th>Erforderlich</th>
                <th>Index</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td>ObjectId</td>
                <td>Automatisch generierter Primärschlüssel</td>
                <td>ja</td>
                <td>Primär</td>
              </tr>
              <tr>
                <td><code>userId</code></td>
                <td>ObjectId → User</td>
                <td>Optionale Referenz zum angemeldeten Nutzer</td>
                <td>nein</td>
                <td>Index</td>
              </tr>
              <tr>
                <td><code>sessionId</code></td>
                <td>String</td>
                <td>Eindeutige ID für jede Chat-Session</td>
                <td>ja</td>
                <td>einzigartig</td>
              </tr>
              <tr>
                <td><code>messages</code></td>
                <td>ChatMessage[]</td>
                <td>Array aller Nachrichten in dieser Session</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Automatisch angelegt (Zeitpunkt der Session-Erstellung)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>updatedAt</code></td>
                <td>Date</td>
                <td>Automatisch aktualisiert (letzte Änderung)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Validierungen & Hooks</h2>
        <ul className="relationships-list">
          <li><strong>Role-Enum:</strong> role in ChatMessage nur 'user' oder 'assistant'.</li>
          <li><strong>SessionID:</strong> sessionId muss nicht leer sein; Empfehlung: Länge ≥ 8 Zeichen.</li>
          <li><strong>Messages-Array:</strong> Vor save Hook: Sicherstellen, dass messages.length ≥ 1.</li>
          <li><strong>TTL-Index (optional):</strong> ChatHistorySchema.index({`{ updatedAt: 1 }, { expireAfterSeconds: 60*60*24*30 }`}) für automatisches Löschen nach 30 Tagen.</li>
        </ul>
      </div>

      <div className="section">
        <h2>💬 Message-Rollen</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>👤 user</h4>
            <p>Nachrichten von Benutzern - Fragen, Anfragen und Eingaben</p>
          </div>
          
          <div className="method-card">
            <h4>🤖 assistant</h4>
            <p>KI-Antworten - Empfehlungen, Antworten und Hilfestellungen</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 ChatHistory.findBySession(sessionId: string)</h4>
            <p>Ruft eine Session mitsamt Nachrichten ab: Promise&lt;ChatHistory | null&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>➕ chatHistory.addMessage(role: string, content: string)</h4>
            <p>Fügt eine neue ChatMessage zur Session hinzu und speichert sie: Promise&lt;void&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>🧹 ChatHistory.cleanupOld()</h4>
            <p>Statischer Task, der alte Sessions löscht (nach TTL oder Custom-Logik): Promise&lt;number&gt;</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Anwendungslogik</h2>
        <ul className="relationships-list">
          <li><strong>Session-Management:</strong> Jede Chat-Session erhält eine eindeutige sessionId für Persistenz über mehrere Anfragen.</li>
          <li><strong>Anonyme Chats:</strong> Auch nicht-angemeldete Nutzer können Chats führen - userId bleibt dann optional.</li>
          <li><strong>Nachrichtenfluss:</strong> Messages werden chronologisch im Array gespeichert für komplette Konversationshistorie.</li>
          <li><strong>Automatische Bereinigung:</strong> TTL-Index sorgt für automatisches Löschen alter Sessions zur Datenspeicher-Optimierung.</li>
          <li><strong>Skalierbarkeit:</strong> Trennung von ChatHistory (Session-Metadaten) und ChatMessage (einzelne Nachrichten) für bessere Performance.</li>
        </ul>
      </div>

      <div className="section">
        <h2>📋 Beispiel (JSON)</h2>
        <div className="code-block">
          <pre><code>{jsonExample}</code></pre>
        </div>
      </div>
    </div>
  );
}; 