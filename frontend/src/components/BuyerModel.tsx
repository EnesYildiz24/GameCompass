import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const BuyerModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60fc3e5f5311236168a10f11",
  "email": "lisa@example.com",
  "role": "buyer",
  "provider": "local",
  "verified": true,
  "isPublisher": false,
  "shippingAddress": "Musterstraße 12, 12345 Musterstadt, Deutschland",
  "paymentMethods": "[{"type":"card","last4":"4242","exp_month":12,"exp_year":2026}]",
  "createdAt": "2025-06-17T16:30:00.000Z",
  "updatedAt": "2025-06-17T16:35:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>🛍️</span> <span className="gradient-text">Buyer Model</span></h1>
      <p className="subtitle">Das Buyer-Modell erweitert das User-Modell um Checkout-relevante Informationen (Versandadresse und Zahlungsmethoden). Es wird als Discriminator auf dem User-Collection verwendet.</p>
      
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
                <td>Erbt alle Felder aus <code>User</code></td>
                <td>–</td>
                <td>z.B. email, role, verified etc.</td>
                <td>–</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>shippingAddress</code></td>
                <td>String</td>
                <td>Standard-Versandadresse des Käufers</td>
                <td>nein</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>paymentMethods</code></td>
                <td>String</td>
                <td>JSON-String oder Bezeichner gespeicherter Zahlungsmethoden (z.B. Stripe)</td>
                <td>nein</td>
                <td>–</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Validierungen & Hooks</h2>
        <ul className="relationships-list">
          <li><strong>ShippingAddress:</strong> Optional, aber bei Checkout erforderlich; Format-Validierung je nach Länderstandard möglich.</li>
          <li><strong>PaymentMethods:</strong> Optional, speichert meist Token oder Masked Account-Infos; Empfehlung: JSON-Validierung per try/catch.</li>
          <li><strong>Discriminator:</strong> Wird über User.discriminator('buyer', BuyerSchema) angelegt; keine eigenen Timestamps, erbt von User.</li>
        </ul>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 findByUserId()</h4>
            <p>Buyer-Dokument anhand der userId abrufen</p>
          </div>
          
          <div className="method-card">
            <h4>💳 addPaymentMethod()</h4>
            <p>Neue Zahlungsmethode hinzufügen</p>
          </div>
          
          <div className="method-card">
            <h4>🗑️ removePaymentMethod()</h4>
            <p>Zahlungsmethode anhand Token entfernen</p>
          </div>
          
          <div className="method-card">
            <h4>🏠 updateShippingAddress()</h4>
            <p>Standard-Versandadresse aktualisieren</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Discriminator-Konzept</h2>
        <ul className="relationships-list">
          <li><strong>User-Erweiterung:</strong> Buyer erweitert das User-Modell um Checkout-spezifische Felder ohne separate Collection.</li>
          <li><strong>Shared Collection:</strong> Alle User-Dokumente (Standard-User und Buyer) werden in derselben users-Collection gespeichert.</li>
          <li><strong>Type-Field:</strong> Ein internes __t-Feld unterscheidet zwischen User-Typen für das Discriminator-Pattern.</li>
          <li><strong>Schema-Vererbung:</strong> Alle User-Felder (email, role, timestamps) werden automatisch übernommen.</li>
          <li><strong>Selective Queries:</strong> Queries können gezielt auf Buyer-Dokumente beschränkt werden durch den Discriminator.</li>
        </ul>
      </div>

      <div className="section">
        <h2>💳 Zahlungsmethoden-Konzept</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔒 Token-basiert</h4>
            <p>Sichere Speicherung von Zahlungsmethoden über externe Tokens (Stripe, PayPal)</p>
          </div>
          
          <div className="method-card">
            <h4>🎭 Masked Info</h4>
            <p>Nur die letzten 4 Ziffern und Kartentyp für UI-Darstellung</p>
          </div>
          
                     <div className="method-card">
             <h4>📝 JSON-Format</h4>
             <p>Flexible Struktur für verschiedene Zahlungsanbieter</p>
           </div>
          
          <div className="method-card">
            <h4>🏪 Checkout-Integration</h4>
            <p>Nahtlose Integration in den Bestellprozess</p>
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