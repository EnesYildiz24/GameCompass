import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const OfferModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60d1a5f85311236168a10a99",
  "game": "60c9d5e35311236168a10a55",
  "seller": "60c9d6e95311236168a10a66",
  "price": 2499,
  "condition": "used",
  "createdAt": "2025-06-17T10:15:00.000Z",
  "updatedAt": "2025-06-17T10:45:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>💰</span> <span className="gradient-text">Offer Model</span></h1>
      <p className="subtitle">Das Offer-Modell repräsentiert ein konkretes Verkaufsangebot zu einem Spiel. Es verbindet ein Spiel mit einem Verkäufer, hinterlegt Preis und Zustand und speichert automatische Timestamps.</p>
      
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
                <td><code>game</code></td>
                <td>ObjectId → Spiel</td>
                <td>Referenz zum Spiel, das angeboten wird</td>
                <td>ja</td>
                <td>Index</td>
              </tr>
              <tr>
                <td><code>seller</code></td>
                <td>ObjectId → User</td>
                <td>Referenz zum verkaufenden Nutzer</td>
                <td>ja</td>
                <td>Index</td>
              </tr>
              <tr>
                <td><code>price</code></td>
                <td>Number</td>
                <td>Angebotspreis in kleinster Währungseinheit (z.B. Cent)</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>condition</code></td>
                <td>String<br/>('new' | 'used')</td>
                <td>Zustand des Spiels (Neuware oder Gebraucht)</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Automatisch angelegt (Zeitpunkt der Erstellung)</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>updatedAt</code></td>
                <td>Date</td>
                <td>Automatisch aktualisiert (letzte Änderung)</td>
                <td>ja</td>
                <td>–</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Validierungen & Hooks</h2>
        <ul className="relationships-list">
          <li><strong>Referenzen:</strong> game muss auf ein existierendes Spiel-Dokument verweisen. seller muss auf ein existierendes User-Dokument verweisen.</li>
          <li><strong>Preis:</strong> Muss ein positiver Wert (≥ 0) sein. Optional: zusätzliche Validierung auf Obergrenze (z.B. max: 100000).</li>
          <li><strong>Zustand:</strong> Nur die Werte 'new' oder 'used' erlaubt.</li>
          <li><strong>Timestamps:</strong> Automatisch durch timestamps: true im Schema.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎯 Zustandstypen</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🆕 new</h4>
            <p>Neuware - Das Spiel ist ungeöffnet und in originalem Zustand</p>
          </div>
          
          <div className="method-card">
            <h4>🔄 used</h4>
            <p>Gebraucht - Das Spiel wurde bereits gespielt, ist aber funktionsfähig</p>
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