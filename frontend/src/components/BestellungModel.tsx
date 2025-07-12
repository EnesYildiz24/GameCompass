import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const BestellungModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60fe5g7h5311236168a10g33",
  "userId": "60d0fe4f5311236168a109ca",
  "product": [
    {
      "spielId": "60e8c2a15311236168a10b10",
      "name": "Cyber Quest",
      "price": 3999,
      "amount": 2
    },
    {
      "spielId": "60e9d3a25311236168a10b11",
      "name": "Space Raiders",
      "price": 2999,
      "amount": 1
    }
  ],
  "price": 10997,
  "status": "bezahlt",
  "orderAt": "2025-06-17T17:30:00.000Z",
  "stripeSessionId": "cs_test_abc123",
  "stripePaymentIntentId": "pi_abc123",
  "createdAt": "2025-06-17T17:30:00.000Z",
  "updatedAt": "2025-06-17T17:31:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>📦</span> <span className="gradient-text">Bestellung (Order) Model</span></h1>
      <p className="subtitle">Das Bestellung-Modell speichert abgeschlossene und offene Bestellungen eines Nutzers inklusive der bestellten Produkte und Zahlungsinformationen.</p>
      
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
                <td>Referenz zum Nutzer, der die Bestellung aufgibt</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>product</code></td>
                <td>Array von Produkt-Objekten</td>
                <td>Liste der bestellten Artikel</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;<code>spielId</code></td>
                <td>ObjectId → Spiel</td>
                <td>Referenz zum bestellten Spiel</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;<code>name</code></td>
                <td>String</td>
                <td>Spieltitel</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;<code>price</code></td>
                <td>Number</td>
                <td>Einzelpreis in kleinstmöglicher Einheit (z.B. Cent)</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;<code>amount</code></td>
                <td>Number</td>
                <td>Anzahl der Einheiten pro Produkt</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>price</code></td>
                <td>Number</td>
                <td>Gesamtsumme aller Produkte (sum(price * amount))</td>
                <td>ja</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>status</code></td>
                <td>String (Enum: offen/bezahlt/storniert)</td>
                <td>Bestellstatus: offen (initial), bezahlt, storniert</td>
                <td>ja</td>
                <td>offen</td>
              </tr>
              <tr>
                <td><code>orderAt</code></td>
                <td>Date</td>
                <td>Zeitpunkt der Bestellung (timestamps.createdAt) oder explizit gesetzt</td>
                <td>ja</td>
                <td>timestamps</td>
              </tr>
              <tr>
                <td><code>stripeSessionId</code></td>
                <td>String</td>
                <td>Stripe Checkout Session ID</td>
                <td>nein</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>stripePaymentIntentId</code></td>
                <td>String</td>
                <td>Stripe Payment Intent ID</td>
                <td>nein</td>
                <td>—</td>
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
          <li><strong>Produkt-Array:</strong> Jedes Element muss spielId, name, price und amount enthalten. price ≥ 0, amount ≥ 1.</li>
          <li><strong>Gesamtpreis:</strong> Vor save Hook: automatische Berechnung this.price = this.product.reduce((sum, p) =&gt; sum + p.price * p.amount, 0).</li>
          <li><strong>Status-Transitions:</strong> State-Maschine enforcing: offen → bezahlt (bei erfolgreichem Stripe-WebHook). offen → storniert (manuelle Stornierung). Keine Rück-Transitionen erlaubt.</li>
          <li><strong>Stripe-Felder:</strong> Optional, werden bei Checkout-Prozess gefüllt.</li>
        </ul>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>👤 findByUser()</h4>
            <p>Alle Bestellungen eines Nutzers liefern</p>
          </div>
          
          <div className="method-card">
            <h4>📊 findByStatus()</h4>
            <p>Bestellungen nach Status filtern</p>
          </div>
          
          <div className="method-card">
            <h4>✅ markAsPaid()</h4>
            <p>Status auf 'bezahlt' setzen mit Stripe-IDs</p>
          </div>
          
          <div className="method-card">
            <h4>❌ cancel()</h4>
            <p>Status auf 'storniert' setzen</p>
          </div>
          
          <div className="method-card">
            <h4>💰 calculateTotal()</h4>
            <p>Aktuellen Gesamtpreis zurückgeben</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Order-Workflow</h2>
        <ul className="relationships-list">
          <li><strong>Order-Erstellung:</strong> Neue Bestellungen starten mit status: 'offen' und automatischer Preisberechnung aus dem product-Array.</li>
          <li><strong>Stripe-Integration:</strong> Checkout-Prozess füllt stripeSessionId und stripePaymentIntentId für sichere Zahlungsabwicklung.</li>
          <li><strong>Status-Management:</strong> Klare State-Machine verhindert ungültige Transitionen und gewährleistet Datenintegrität.</li>
          <li><strong>Product-Tracking:</strong> Embedded product-Array speichert Snapshot der Artikel zum Bestellzeitpunkt mit Preisen.</li>
          <li><strong>Automatische Berechnung:</strong> Gesamtpreis wird automatisch aus Einzelpreisen und Mengen berechnet und validiert.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🛒 Bestellstatus-Typen</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>⏳ offen</h4>
            <p>Initial-Status bei Bestellerstellung</p>
          </div>
          
          <div className="method-card">
            <h4>✅ bezahlt</h4>
            <p>Zahlung erfolgreich via Stripe abgeschlossen</p>
          </div>
          
          <div className="method-card">
            <h4>❌ storniert</h4>
            <p>Bestellung wurde manuell storniert</p>
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