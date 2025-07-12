import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const SpielModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60e8c2a15311236168a10b10",
  "name": "Cyber Quest",
  "description": "Ein actionreiches Rollenspiel in einer futuristischen Cyberwelt.",
  "price": 3999,
  "released": "2025-05-20T00:00:00.000Z",
  "developer": "FutureGames Studio",
  "availability": true,
  "background_image": "https://example.com/images/cyberquest.jpg",
  "genres": [{ "id": 1, "name": "RPG" }, { "id": 2, "name": "Action" }],
  "platforms": [{ "platform": { "name": "PC" } }, { "platform": { "name": "PS5" } }],
  "screenshots": [],
  "createdAt": "2025-06-17T14:00:00.000Z",
  "updatedAt": "2025-06-17T14:00:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>🎮</span> <span className="gradient-text">Spiel Model</span></h1>
      <p className="subtitle">Das Spiel-Modell speichert alle Metadaten zu einem Game im GameCompass-Marktplatz. Statistische Felder (wie Rating oder Screenshots-Count) werden nur gepflegt, wenn entsprechende Daten vorliegen.</p>
      
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
                <td>Titel des Spiels</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>description</code></td>
                <td>String</td>
                <td>Ausführliche Spielbeschreibung (max. 20000 Zeichen)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>price</code></td>
                <td>Number</td>
                <td>Basispreis in kleinstmöglicher Einheit (z.B. Cent)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>released</code></td>
                <td>Date</td>
                <td>Veröffentlichungsdatum</td>
                <td>nein</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>developer</code></td>
                <td>String</td>
                <td>Entwicklerstudio</td>
                <td>nein</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>availability</code></td>
                <td>Boolean</td>
                <td>Verfügbarkeit im Katalog</td>
                <td>ja</td>
                <td>false</td>
              </tr>
              <tr>
                <td><code>background_image</code></td>
                <td>String</td>
                <td>URL zum Titelbild</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>genres</code></td>
                <td>[{`{ id: Number, name: String }`}]</td>
                <td>Zugehörige Genres (ID & Name)</td>
                <td>ja</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>platforms</code></td>
                <td>[{`{ platform: { name: String } }`}]</td>
                <td>Unterstützte Plattformen</td>
                <td>ja</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>screenshots</code></td>
                <td>String[]</td>
                <td>URLs zu Screenshots (optional)</td>
                <td>nein</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>screenshots_count</code></td>
                <td>Number</td>
                <td>Anzahl der Screenshots (entfällt, wenn keine vorhanden)</td>
                <td>nein</td>
                <td>entfällt</td>
              </tr>
              <tr>
                <td><code>rating</code></td>
                <td>Number</td>
                <td>Durchschnittliche Bewertung (0.0–5.0, entfällt ohne Reviews)</td>
                <td>nein</td>
                <td>entfällt</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Automatisch angelegt (Zeitpunkt der Erstellung)</td>
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
          <li><strong>Name:</strong> Muss eindeutig sein (unique-Index empfohlen). Nicht leer und ≥ 1 Zeichen.</li>
          <li><strong>Description:</strong> Maximale Länge 20000.</li>
          <li><strong>Price:</strong> Muss ≥ 0 sein.</li>
          <li><strong>Availability:</strong> Default false.</li>
          <li><strong>Screenshots & Count:</strong> Pre-save Hook: falls screenshots gesetzt, wird screenshots_count automatisch auf screenshots.length gesetzt; andernfalls wird das Feld entfernt.</li>
          <li><strong>Rating:</strong> Wertebereich 0.0 bis 5.0. Berechnung extern (z.B. aus Bewertung-Collection); Feld nur speichern, wenn mindestens ein Review existiert.</li>
        </ul>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 Spiel.findByGenre(genreId: number)</h4>
            <p>Gibt alle Spiele eines Genres zurück: Promise&lt;Spiel[]&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>⭐ spiel.computeRating()</h4>
            <p>Berechnet den Durchschnitt aus verknüpften Bewertung-Dokumenten und aktualisiert das rating-Feld: Promise&lt;number&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>🖼️ spiel.addScreenshot(url: string)</h4>
            <p>Fügt einen Screenshot hinzu und aktualisiert screenshots_count: void</p>
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