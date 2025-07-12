import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const GenreModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60e7b4f75311236168a10b00",
  "name": "Action",
  "description": "Spiele mit hohem Tempo und viel Interaktion",
  "germanName": "Action",
  "aliases": ["Aktionsspiele", "Action-Games"],
  "createdAt": "2025-06-17T13:00:00.000Z",
  "updatedAt": "2025-06-17T13:00:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>🎭</span> <span className="gradient-text">Genre Model</span></h1>
      <p className="subtitle">Das Genre-Modell definiert Kategorien für Spiele und dient zur Taxonomie und Filterung im GameCompass-Marktplatz. Statistische Felder werden nur gepflegt, wenn Daten vorliegen.</p>
      
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
                <td><code>name</code></td>
                <td>String</td>
                <td>Eindeutiger Name des Genres</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>description</code></td>
                <td>String</td>
                <td>Ausführliche Beschreibung</td>
                <td>nein</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>germanName</code></td>
                <td>String</td>
                <td>Deutscher Name (falls abweichend)</td>
                <td>nein</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>aliases</code></td>
                <td>String[]</td>
                <td>Alternative Bezeichnungen</td>
                <td>ja</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>popularity</code></td>
                <td>Number</td>
                <td>Popularitätswert (0–50), entfällt bei fehlenden Daten</td>
                <td>nein</td>
                <td>entfällt</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Zeitstempel der Erstellung</td>
                <td>ja</td>
                <td>Date.now()</td>
              </tr>
              <tr>
                <td><code>updatedAt</code></td>
                <td>Date</td>
                <td>Zeitstempel der letzten Änderung</td>
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
          <li><strong>Name:</strong> Muss eindeutig sein (unique-Index empfohlen). Nicht leer und ≥ 3 Zeichen.</li>
          <li><strong>Popularity:</strong> Nur Werte zwischen 0 und 50. Feld wird NICHT gespeichert, wenn kein Wert gesetzt ist.</li>
          <li><strong>Aliases:</strong> Leeres Array statt null bei keiner Alias-Angabe.</li>
          <li><strong>Timestamps:</strong> Automatisch durch timestamps: true im Schema.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎯 Genre-Eigenschaften</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🏷️ Taxonomie</h4>
            <p>Eindeutige Kategorisierung von Spielen für bessere Auffindbarkeit</p>
          </div>
          
          <div className="method-card">
            <h4>🔍 Filterung</h4>
            <p>Ermöglicht gezieltes Suchen und Filtern von Spielen</p>
          </div>
          
          <div className="method-card">
            <h4>🌐 Mehrsprachigkeit</h4>
            <p>Unterstützung deutscher Namen und alternativer Bezeichnungen</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📋 Beispiel (JSON) ohne Statistik</h2>
        <div className="code-block">
          <pre><code>{jsonExample}</code></pre>
        </div>
      </div>
    </div>
  );
}; 