import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Facebook: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>👥</span> <span className="gradient-text">Facebook OAuth-Route</span></h1>
      <p className="subtitle">GameCompass Backend - Express-Router zur Facebook AccessToken Authentifikation</p>
      
      <div className="section">
        <h2>📋 Beschreibung</h2>
        <p>Das Modul <code>/Backend/Integrations/Auth/Facebook.ts</code> implementiert den Express-Router zur Anmeldung per Facebook AccessToken und Ausgabe eines JWT-Cookies.</p>
      </div>

      <div className="section">
        <h2>🔗 Endpoint</h2>
        <div className="endpoint-info">
          <p><strong>Route:</strong> <code>POST /auth/facebook</code></p>
          <p><strong>Beschreibung:</strong> Nimmt ein Facebook <code>accessToken</code> entgegen, ruft die Graph API ab, erstellt oder aktualisiert den User und setzt ein JWT in einem HTTP-Only-Cookie.</p>
        </div>
      </div>

      <div className="section">
        <h2>📨 Request</h2>
        <div className="request-info">
          <h4>Body (JSON)</h4>
          <div className="code-block">
            <pre><code>{`{
  "accessToken": "string"
}`}</code></pre>
          </div>
          <p><strong>Erwartung:</strong> <code>accessToken</code> muss im Request-Body vorhanden sein, sonst 400.</p>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Ablauf</h2>
        <div className="flow-steps">
          <div className="step">
            <h4>1. Token-Validierung</h4>
            <p>Prüfen, ob <code>accessToken</code> bereitgestellt wurde.</p>
          </div>
          
          <div className="step">
            <h4>2. Facebook Graph API</h4>
            <p>GET <code>https://graph.facebook.com/me?fields=id,name,email&access_token={`{accessToken}`}</code></p>
            <p>Bei Fehler Response 400 + Fehlertext.</p>
          </div>
          
          <div className="step">
            <h4>3. User Upsert</h4>
            <p>Suche <code>User.findOne({`{ email }`})</code>.</p>
            <p><strong>Felder zum Updaten/Einfügen:</strong></p>
            <ul>
              <li><code>provider: 'facebook'</code></li>
              <li><code>providerId</code>: Facebook User-ID</li>
              <li><code>email</code>: Reales oder Fallback-Format</li>
              <li><code>verified: true</code></li>
              <li><code>username</code>: Neu generiert, falls User nicht existiert</li>
            </ul>
          </div>
          
          <div className="step">
            <h4>4. JWT-Erzeugung & Cookie</h4>
            <p><strong>Token:</strong> <code>jwt.sign({`{ sub: userId }`}, JWT_SECRET, {`{ expiresIn: '1h' }`})</code></p>
            <p><strong>Cookie <code>access_token</code>:</strong></p>
            <ul>
              <li><code>httpOnly: true</code></li>
              <li><code>secure</code>: nur in Produktion</li>
              <li><code>sameSite</code>: <code>none</code> in Produktion, sonst <code>lax</code></li>
              <li><code>expires</code>: 1 Stunde</li>
            </ul>
          </div>
          
          <div className="step">
            <h4>5. Erfolgs-Response</h4>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "role": "...",
    "verified": true
  }
}`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Konfiguration</h2>
        <div className="config-section">
          <h4>Umgebungsvariablen</h4>
          <div className="code-block">
            <pre><code>{`FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
JWT_SECRET=...
NODE_ENV=development|production`}</code></pre>
          </div>
          <div className="config-note">
            <h4>Redirects & CORS</h4>
            <p>Stelle sicher, dass dein Frontend die Cookie-Domain & CORS-Policy entsprechend konfiguriert.</p>
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
                <td>Kein <code>accessToken</code></td>
                <td><code>{`{ error: 'No accessToken provided' }`}</code></td>
              </tr>
              <tr>
                <td>400</td>
                <td>Graph API liefert Fehler</td>
                <td><code>{`{ error: 'Facebook API Error: ...' }`}</code></td>
              </tr>
              <tr>
                <td>401</td>
                <td>Verarbeitung oder DB-Fehler</td>
                <td><code>{`{ error: 'Login failed' }`}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 