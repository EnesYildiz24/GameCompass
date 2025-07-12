import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Google: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🔍</span> <span className="gradient-text">Google OAuth-Route</span></h1>
      <p className="subtitle">GameCompass Backend - Express-Router für Google ID Token Authentifikation</p>
      
      <div className="section">
        <h2>📋 Beschreibung</h2>
        <p>Das Modul <code>/Backend/Integrations/Auth/Google.ts</code> stellt den Express-Router für die Anmeldung per Google ID Token bereit und setzt einen JWT-Cookie.</p>
      </div>

      <div className="section">
        <h2>🔗 Endpoints</h2>
        <div className="endpoints-list">
          <div className="endpoint-item">
            <h4>POST /auth/google</h4>
            <p>Nimmt ein Google <code>credential</code> (ID Token) entgegen und führt folgende Schritte aus:</p>
            <ul>
              <li>Verifiziert das Token bei Google</li>
              <li>Erstellt oder aktualisiert den User</li>
              <li>Gibt einen JWT in einem HTTP-Only-Cookie zurück</li>
            </ul>
          </div>
          
          <div className="endpoint-item">
            <h4>GET /auth/me</h4>
            <p>Gibt die Informationen des aktuell angemeldeten Users zurück.</p>
            <p>Benötigt das JWT-Cookie und Middleware <code>requireAuth</code>.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📨 POST /auth/google - Request</h2>
        <div className="request-info">
          <h4>Body (JSON)</h4>
          <div className="code-block">
            <pre><code>{`{
  "credential": "string"
}`}</code></pre>
          </div>
          <p><strong>Erwartung:</strong> <code>credential</code> muss im Body vorhanden sein, sonst 400.</p>
        </div>
      </div>

      <div className="section">
        <h2>🔄 POST /auth/google - Ablauf</h2>
        <div className="flow-steps">
          <div className="step">
            <h4>1. Token-Validierung</h4>
            <p>Verifiziere ID Token mit <code>client.verifyIdToken({`{ idToken: credential, audience: GOOGLE_CLIENT_ID }`})</code>.</p>
            <p>Prüfe <code>payload.email_verified</code>; bei <code>false</code> → 400.</p>
          </div>
          
          <div className="step">
            <h4>2. User Upsert</h4>
            <p><strong>Filter:</strong> <code>{`{ email: payload.email }`}</code></p>
            <p><strong>Update:</strong></p>
            <ul>
              <li><code>provider: 'google'</code></li>
              <li><code>providerId: payload.sub</code></li>
              <li><code>email</code>, <code>username</code>, <code>verified: true</code></li>
            </ul>
            <p><strong>Option:</strong> <code>upsert: true, new: true</code></p>
          </div>
          
          <div className="step">
            <h4>3. JWT-Erzeugung & Cookie</h4>
            <p><strong>Token:</strong> <code>jwt.sign({`{ sub, role, username }`}, JWT_SECRET, {`{ expiresIn: '1h' }`})</code></p>
            <p><strong>Cookie <code>access_token</code>:</strong></p>
            <ul>
              <li><code>httpOnly: true</code></li>
              <li><code>secure</code>: <code>true</code> in Produktion</li>
              <li><code>sameSite</code>: <code>none</code> in Produktion, sonst <code>lax</code></li>
              <li><code>path: '/'</code></li>
              <li><code>expires</code>: in 1 Stunde</li>
            </ul>
          </div>
          
          <div className="step">
            <h4>4. Erfolgs-Response</h4>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "role": "..."
  }
}`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>👤 GET /auth/me - Ablauf</h2>
        <div className="flow-steps">
          <div className="step">
            <h4>1. Middleware</h4>
            <p><code>requireAuth</code> überprüft JWT und setzt <code>req.user</code>.</p>
          </div>
          
          <div className="step">
            <h4>2. User laden</h4>
            <p><code>User.findById(req.user._id)</code>.</p>
          </div>
          
          <div className="step">
            <h4>3. Response</h4>
            <div className="code-block">
              <pre><code>{`{
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "role": "...",
    "verified": true,
    "stripeAccountId": "...",
    "chargesEnabled": true,
    "payoutsEnabled": true
  }
}`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Konfiguration & Umgebungsvariablen</h2>
        <div className="config-section">
          <div className="code-block">
            <pre><code>{`GOOGLE_CLIENT_ID=...
JWT_SECRET=...
NODE_ENV=development|production`}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>❌ Fehler & Statuscodes</h2>
        <div className="error-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Bedingung</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>400</td>
                <td>Kein <code>credential</code> im Body</td>
                <td><code>{`{ error: 'No credential token provided' }`}</code></td>
              </tr>
              <tr>
                <td>400</td>
                <td><code>email_verified</code> ist <code>false</code></td>
                <td><code>{`{ error: 'Google account not verified' }`}</code></td>
              </tr>
              <tr>
                <td>401</td>
                <td>Ungültiger Token</td>
                <td><code>{`{ error: 'Invalid Google token' }`}</code></td>
              </tr>
              <tr>
                <td>500</td>
                <td>DB- oder Serverfehler</td>
                <td><code>{`{ error: 'User lookup/create failed' }`}</code> oder <code>{`{ error: 'Server error' }`}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 