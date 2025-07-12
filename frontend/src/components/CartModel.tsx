import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const CartModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60fb2d5e5311236168a10e99",
  "userId": "60d0fe4f5311236168a109ca",
  "items": [
    {
      "gameId": "60e8c2a15311236168a10b10",
      "name": "Cyber Quest",
      "price": 3999,
      "quantity": 2,
      "background_image": "https://example.com/images/cyberquest.jpg"
    }
  ],
  "updatedAt": "2025-06-17T16:00:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>🛒</span> <span className="gradient-text">Cart Model</span></h1>
      <p className="subtitle">Das Cart-Modell repräsentiert den Warenkorb eines Nutzers und enthält einzelne CartItem-Einträge. Es stellt sicher, dass pro Nutzer nur ein aktiver Warenkorb existiert und aktualisiert automatisch den Zeitstempel.</p>
      
      <div className="section">
        <h2>📋 Schema-Felder</h2>
        
        <h3>CartItem</h3>
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
                <td><code>gameId</code></td>
                <td>String</td>
                <td>ID des Spiels (oder Offer)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td>String</td>
                <td>Spieltitel</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>price</code></td>
                <td>Number</td>
                <td>Preis in kleinstmöglicher Einheit (z.B. Cent)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>quantity</code></td>
                <td>Number</td>
                <td>Menge des Artikels</td>
                <td>ja</td>
                <td>1</td>
              </tr>
              <tr>
                <td><code>background_image</code></td>
                <td>String</td>
                <td>URL zum Spiel-Cover</td>
                <td>nein</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Cart</h3>
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
                <td>Referenz zum Nutzer; pro Nutzer nur ein Warenkorb erlaubt</td>
                <td>ja</td>
                <td>einzigartig</td>
              </tr>
              <tr>
                <td><code>items</code></td>
                <td>CartItem[]</td>
                <td>Liste aller Warenkorb-Positionen</td>
                <td>ja</td>
                <td>—</td>
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
          <li><strong>Unique cart per user:</strong> Schema-Option unique: true auf userId stellt sicher, dass jeder Nutzer maximal einen Warenkorb hat.</li>
          <li><strong>Pre-Save Hook:</strong> Aktualisiert updatedAt auf Date.now() bei jedem Speichern.</li>
          <li><strong>Item-Validierung:</strong> quantity muss ≥ 1 sein. price muss ≥ 0 sein.</li>
          <li><strong>Post-Hooks (optional):</strong> post('save') und post('findOneAndUpdate') können für Analytics oder Cache-Invalidierung genutzt werden.</li>
        </ul>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 Cart.findByUser(userId: string)</h4>
            <p>Ruft den Warenkorb des angegebenen Nutzers ab: Promise&lt;Cart | null&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>➕ cart.addItem(item: CartItem)</h4>
            <p>Fügt ein neues CartItem hinzu oder erhöht die Menge, falls bereits vorhanden: Promise&lt;void&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>🗑️ cart.removeItem(gameId: string)</h4>
            <p>Entfernt einen Artikel aus dem Warenkorb: Promise&lt;void&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>🧹 cart.clear()</h4>
            <p>Leert alle Positionen im Warenkorb: Promise&lt;void&gt;</p>
          </div>
          
          <div className="method-card">
            <h4>💰 cart.getTotal()</h4>
            <p>Berechnet die Gesamtsumme aller Positionen (price * quantity): number</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Funktionsweise</h2>
        <ul className="relationships-list">
          <li><strong>Ein-Warenkorb-Prinzip:</strong> Pro Nutzer existiert maximal ein aktiver Warenkorb durch unique-Index auf userId.</li>
          <li><strong>Item-Management:</strong> CartItems werden als embedded Dokumente gespeichert für bessere Performance beim Abrufen.</li>
          <li><strong>Automatische Updates:</strong> Jede Änderung aktualisiert den updatedAt-Zeitstempel für Session-Management.</li>
          <li><strong>Quantity-Logik:</strong> Gleiche Spiele werden durch Erhöhung der Quantity kombiniert statt Duplikate zu erstellen.</li>
          <li><strong>Persistenz:</strong> Warenkörbe bleiben über Sessions hinaus bestehen bis zur Bestellung oder manuellen Löschung.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🛍️ Anwendungsfälle</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🛒 Shopping-Session</h4>
            <p>Nutzer können Spiele sammeln und später kaufen</p>
          </div>
          
          <div className="method-card">
            <h4>💾 Session-Persistenz</h4>
            <p>Warenkorb bleibt über Logout/Login hinaus erhalten</p>
          </div>
          
          <div className="method-card">
            <h4>🔄 Mengen-Management</h4>
            <p>Automatische Summierung gleicher Artikel</p>
          </div>

          <div className="method-card">
            <h4>📊 Checkout-Vorbereitung</h4>
            <p>Basis für Bestellungsverarbeitung und Zahlungsabwicklung</p>
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