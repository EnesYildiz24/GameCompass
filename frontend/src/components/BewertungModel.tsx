import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const BewertungModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60fd4f6f5311236168a10f22",
  "userId": "60d0fe4f5311236168a109ca",
  "spielId": "60e8c2a15311236168a10b10",
  "comment": "Tolles Spiel mit großer Open-World!",
  "stars": 5,
  "writtenAt": "2025-06-17T17:00:00.000Z",
  "editedAt": null,
  "createdAt": "2025-06-17T17:00:00.000Z",
  "updatedAt": "2025-06-17T17:00:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>⭐</span> <span className="gradient-text">Bewertung (Review) Model</span></h1>
      <p className="subtitle">Das Bewertung-Modell speichert Nutzer-Reviews zu Spielen. Es verknüpft eine Bewertung mit User und Spiel, erlaubt Kommentare und optional Sternebewertungen.</p>
      
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
                <td><code>userId</code></td>
                <td>ObjectId → User</td>
                <td>Referenz zum bewertenden Nutzer</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>spielId</code></td>
                <td>ObjectId → Spiel</td>
                <td>Referenz zum Spiel, das bewertet wird</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>comment</code></td>
                <td>String</td>
                <td>Textkommentar zur Bewertung</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>stars</code></td>
                <td>Number</td>
                <td>Sternebewertung (1–5), entfällt wenn nicht vergeben</td>
                <td>nein</td>
                <td>entfällt</td>
              </tr>
              <tr>
                <td><code>writtenAt</code></td>
                <td>Date</td>
                <td>Zeitpunkt, wann die Bewertung verfasst wurde</td>
                <td>ja</td>
                <td>Date.now()</td>
              </tr>
              <tr>
                <td><code>editedAt</code></td>
                <td>Date</td>
                <td>Zeitpunkt der letzten Bearbeitung</td>
                <td>nein</td>
                <td>entfällt</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Automatisch angelegt (Schema timestamps: true)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>updatedAt</code></td>
                <td>Date</td>
                <td>Automatisch aktualisiert (Schema timestamps: true)</td>
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
          <li><strong>Stars:</strong> Nur Werte zwischen 1 und 5. Feld wird NICHT gespeichert, sobald kein Wert gesetzt wird.</li>
          <li><strong>Unique Constraint (optional):</strong> Kombiniere userId + spielId als Compound-Index, um doppelte Reviews pro Spiel zu verhindern.</li>
          <li><strong>Timestamps:</strong> writtenAt und editedAt über Hooks pflegen: Vor save Hook: setzt writtenAt, falls neu. Vor findOneAndUpdate Hook: aktualisiert editedAt auf Date.now().</li>
        </ul>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🎮 findBySpiel()</h4>
            <p>Alle Bewertungen zu einem Spiel zurückgeben</p>
          </div>
          
          <div className="method-card">
            <h4>👤 findByUser()</h4>
            <p>Alle Bewertungen eines Nutzers abrufen</p>
          </div>
          
          <div className="method-card">
            <h4>✏️ updateComment()</h4>
            <p>Kommentar aktualisieren und editedAt setzen</p>
          </div>
          
          <div className="method-card">
            <h4>⭐ setStars()</h4>
            <p>Sternebewertung ändern (1-5 Sterne)</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Review-System</h2>
        <ul className="relationships-list">
          <li><strong>User-Spiel-Verknüpfung:</strong> Jede Bewertung verbindet einen Nutzer mit einem Spiel über ObjectId-Referenzen.</li>
          <li><strong>Optionale Sterne-Bewertung:</strong> Stars-Feld kann weggelassen werden für reine Text-Reviews ohne numerische Bewertung.</li>
          <li><strong>Bearbeitungshistorie:</strong> writtenAt und editedAt ermöglichen Tracking von ursprünglicher Erstellung und späteren Änderungen.</li>
          <li><strong>Unique Reviews:</strong> Optional Compound-Index verhindert mehrfache Bewertungen desselben Spiels durch denselben Nutzer.</li>
          <li><strong>Aggregation-Ready:</strong> Struktur ermöglicht einfache Berechnung von Durchschnittsbewertungen für Spiele.</li>
        </ul>
      </div>

      <div className="section">
        <h2>⭐ Bewertungs-Features</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>💬 Text-Reviews</h4>
            <p>Ausführliche Kommentare zu Spielerfahrungen</p>
          </div>
          
          <div className="method-card">
            <h4>⭐ Sternen-System</h4>
            <p>1-5 Sterne für schnelle numerische Bewertung</p>
          </div>
          
          <div className="method-card">
            <h4>📝 Bearbeitbar</h4>
            <p>Reviews können nachträglich aktualisiert werden</p>
          </div>

          <div className="method-card">
            <h4>🛡️ Eindeutigkeit</h4>
            <p>Ein Review pro Nutzer und Spiel (optional)</p>
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