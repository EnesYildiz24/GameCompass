import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const UserModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60d0fe4f5311236168a109ca",
  "username": "maxmuster",
  "email": "max@example.com",
  "role": "buyer",
  "provider": "local",
  "verified": true,
  "profileImage": "https://example.com/avatar.jpg",
  "isPublisher": true,
  "stripeAccountId": "acct_123xyz",
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "createdAt": "2025-06-17T09:30:00.000Z",
  "updatedAt": "2025-06-17T12:45:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>👤</span> <span className="gradient-text">User Model</span></h1>
      <p className="subtitle">
        Das User-Modell bildet die Grundlage für alle Nutzerkonten und unterstützt verschiedene Authentifizierungsarten (lokal, Google, Facebook) sowie Rollen wie Admin und Publisher. Es enthält zudem Stripe-Integrationen für Onboarding und Zahlungsabwicklung.
      </p>
      
      <div className="section">
        <h2>📋 1) Schema-Felder</h2>
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
                <td><code>username</code></td>
                <td>String</td>
                <td>Benutzername (nur bei provider: 'local')</td>
                <td>bedingt</td>
                <td>einzigartig</td>
              </tr>
              <tr>
                <td><code>email</code></td>
                <td>String</td>
                <td>Eindeutige E-Mail-Adresse</td>
                <td>ja</td>
                <td>einzigartig</td>
              </tr>
              <tr>
                <td><code>password</code></td>
                <td>String</td>
                <td>Passwort-Hash (nur bei provider: 'local')</td>
                <td>bedingt</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>role</code></td>
                <td>String ('admin' | 'buyer')</td>
                <td>User-Rolle: Admin hat erweiterte Rechte, Buyer Standard-Rechte</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>provider</code></td>
                <td>String ('local' | 'google' | 'facebook')</td>
                <td>Authentifizierungsanbieter</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>providerId</code></td>
                <td>String</td>
                <td>ID des externen Providers (z. B. Google-User-ID)</td>
                <td>bedingt</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>verified</code></td>
                <td>Boolean</td>
                <td>E-Mail-Adresse verifiziert (nur lokal)</td>
                <td>bedingt</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>profileImage</code></td>
                <td>String</td>
                <td>URL zum Profilbild</td>
                <td>nein</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>isPublisher</code></td>
                <td>Boolean</td>
                <td>Legt fest, ob der User als Verkäufer agieren darf</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>stripeAccountId</code></td>
                <td>String</td>
                <td>Verknüpftes Stripe-Account für Zahlungen und Payouts</td>
                <td>bedingt</td>
                <td>einzigartig</td>
              </tr>
              <tr>
                <td><code>chargesEnabled</code></td>
                <td>Boolean</td>
                <td>Stripe: Zahlungseinzug erlaubt</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>payoutsEnabled</code></td>
                <td>Boolean</td>
                <td>Stripe: Auszahlungen aktiviert</td>
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
        <h2>🔧 2) Validierungen & Hooks</h2>
        <div className="validation-grid">
          <div className="validation-card">
            <h4>📧 Email-Format</h4>
            <p>Validierung per Regex</p>
            <div className="code-snippet">
              <code>/\S+@\S+\.\S+/</code>
            </div>
          </div>
          
          <div className="validation-card">
            <h4>🔒 Password-Hashing</h4>
            <p>Vor save Hook mit bcrypt</p>
            <div className="code-snippet">
              <code>saltRounds = 12</code>
            </div>
          </div>
          
          <div className="validation-card">
            <h4>🔗 Provider-Kombination</h4>
            <p>Falls provider !== 'local', sind password und verified optional</p>
            <p>Falls provider === 'local', sind username, password und verified erforderlich</p>
          </div>
          
          <div className="validation-card">
            <h4>💳 Stripe-Onboarding</h4>
            <p>Bei isPublisher = true automatisch stripeAccountId anlegen, wenn noch nicht vorhanden</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ 3) Instanzmethoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 isCorrectPassword</h4>
            <p><strong>Signatur:</strong> <code>isCorrectPassword(candidatePassword: string): Promise&lt;boolean&gt;</code></p>
            <p>Vergleicht ein eingegebenes Passwort mit dem gespeicherten Hash.</p>
          </div>
          
          <div className="method-card">
            <h4>💰 canSell</h4>
            <p><strong>Signatur:</strong> <code>canSell(): boolean</code></p>
            <p>Liefert true, wenn <code>isPublisher && chargesEnabled && payoutsEnabled</code>.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📄 4) Beispiel (JSON)</h2>
        <div className="code-block">
          <pre><code>{jsonExample}</code></pre>
        </div>
      </div>
    </div>
  );
}; 