import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ChatPromptModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60f3a8d25311236168a10c77",
  "type": "genre",
  "question": "Welches Genre bevorzugst du?",
  "nextPrompt": "experience",
  "options": ["Action", "RPG", "Adventure"],
  "responseType": "genre",
  "rules": ["only select one option"],
  "examples": [
    { "user": "Ich mag RPGs", "assistant": "Super, RPGs eröffnen viele Welten..." }
  ],
  "keywords": ["RPG", "Action", "Adventure"],
  "patterns": ["RPG", "Role-Playing"],
  "mappings": [
    { "pattern": "RPG", "gamingTerms": "Role-Playing Game" }
  ],
  "createdAt": "2025-06-17T15:00:00.000Z",
  "updatedAt": "2025-06-17T15:00:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>💬</span> <span className="gradient-text">ChatPrompt Model</span></h1>
      <p className="subtitle">Das ChatPrompt-Modell definiert vordefinierte KI-Prompts für den GameCompass-Chat, inklusive Fragen, Antworttypen und Beispiel-Dialogen.</p>
      
      <div className="section">
        <h2>📋 Schema-Felder</h2>
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
                <td><code>type</code></td>
                <td>String</td>
                <td>Kategorie des Prompts (z.B. 'genre', 'experience', 'preference')</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>question</code></td>
                <td>String</td>
                <td>Tatsächliche Frage oder Aufforderung an den Nutzer</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>nextPrompt</code></td>
                <td>String</td>
                <td>ID oder Key des nächsten Prompts im Flow</td>
                <td>nein</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>options</code></td>
                <td>String[]</td>
                <td>Auswahlmöglichkeiten (bei Multiple-Choice-Flow)</td>
                <td>nein</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>responseType</code></td>
                <td>String<br/>('simple' | 'genre' | 'final' | 'rules')</td>
                <td>Legt das Format der Antwort fest</td>
                <td>ja</td>
                <td>simple</td>
              </tr>
              <tr>
                <td><code>rules</code></td>
                <td>String[]</td>
                <td>Liste von Richtlinien oder System-Regeln für diese Prompt-Stufe</td>
                <td>ja</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>examples</code></td>
                <td>Array von {`{ user: String, assistant: String }`}</td>
                <td>Beispiel-Dialoge: je ein User-/Assistant-Paar</td>
                <td>ja</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>keywords</code></td>
                <td>String[]</td>
                <td>Schlagwörter zur KI-Triggerung oder Klassifikation</td>
                <td>nein</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>patterns</code></td>
                <td>String[]</td>
                <td>Regex-Muster zur Erkennung im User-Input</td>
                <td>nein</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>mappings</code></td>
                <td>Array von {`{ pattern: String, gamingTerms: String }`}</td>
                <td>Mapping von Erkennungs-Muster zu internen Gaming-Begriffen</td>
                <td>nein</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Zeitstempel der Erstellung (bei timestamps: true)</td>
                <td>ja</td>
                <td>automatisch</td>
              </tr>
              <tr>
                <td><code>updatedAt</code></td>
                <td>Date</td>
                <td>Zeitstempel der letzten Änderung (bei timestamps: true)</td>
                <td>ja</td>
                <td>automatisch</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Validierungen & Hooks</h2>
        <ul className="relationships-list">
          <li><strong>Type & Question:</strong> type: Nicht leer, minimales Length-Constraint empfehlen (&gt; 2 Zeichen). question: Mindestlänge (&gt; 5 Zeichen).</li>
          <li><strong>ResponseType:</strong> Nur die Enum-Werte aus ['simple', 'genre', 'final', 'rules'].</li>
          <li><strong>Examples:</strong> Vor save Hook: Sicherstellen, dass jedes assistant-Feld nicht leer ist.</li>
          <li><strong>Timestamps:</strong> Schema-Option timestamps: true aktivieren, um createdAt und updatedAt automatisch zu pflegen.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎯 Response-Typen</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>📝 simple</h4>
            <p>Einfache Textantwort ohne spezielle Formatierung</p>
          </div>
          
          <div className="method-card">
            <h4>🎭 genre</h4>
            <p>Genre-spezifische Antwort mit Gaming-Kontext</p>
          </div>
          
          <div className="method-card">
            <h4>🏁 final</h4>
            <p>Abschließende Antwort am Ende eines Chat-Flows</p>
          </div>
          
          <div className="method-card">
            <h4>📋 rules</h4>
            <p>Regelbasierte Antwort mit System-Richtlinien</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Funktionsweise</h2>
        <ul className="relationships-list">
          <li><strong>KI-Chat-Flow:</strong> ChatPrompts werden sequenziell durch nextPrompt-Verknüpfungen abgearbeitet und bilden zusammenhängende Gesprächsverläufe.</li>
          <li><strong>Pattern-Matching:</strong> Keywords und Patterns ermöglichen der KI, User-Input zu klassifizieren und passende Prompts auszuwählen.</li>
          <li><strong>Gaming-Terminologie:</strong> Mappings übersetzen allgemeine Begriffe in spezifische Gaming-Fachbegriffe für präzisere Empfehlungen.</li>
          <li><strong>Beispiel-basiertes Lernen:</strong> Examples-Array trainiert die KI mit konkreten Dialog-Beispielen für konsistentere Antworten.</li>
          <li><strong>Multiple-Choice-Support:</strong> Options-Array ermöglicht strukturierte Auswahlmöglichkeiten im Chat-Interface.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🔄 Anwendungsfälle</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🎮 Spielempfehlungen</h4>
            <p>Strukturierte Abfrage von Spielerpräferenzen für personalisierte Empfehlungen</p>
          </div>
          
          <div className="method-card">
            <h4>🛍️ Kaufberatung</h4>
            <p>Geführte Beratung beim Spielekauf basierend auf Budget und Vorlieben</p>
          </div>
          
          <div className="method-card">
            <h4>🆘 Support-Chat</h4>
            <p>Automatisierte Hilfeanfragen mit vordefinierte Lösungswegen</p>
          </div>
        </div>
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