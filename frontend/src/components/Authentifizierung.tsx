import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Authentifizierung.css';

export const Authentifizierung: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="auth-container">
      <h1><span className="auth-emoji">🔐</span> <span className="gradient-text">Authentifizierung (SSO)</span></h1>
      <p className="subtitle">
        Single Sign-On Integration für nahtlose und sichere Benutzeranmeldung im GameCompass System.
      </p>

      <div className="section">
        <h2>🔑 OAuth 2.0 Flow</h2>
        <p>Standardisierter Authentifizierungsflow für alle SSO-Anbieter:</p>
        
        <div className="oauth-flow">
          <div className="flow-step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h4>Redirect</h4>
              <p>Weiterleitung zum OAuth-Anbieter</p>
            </div>
          </div>
          <div className="flow-step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h4>Authorization</h4>
              <p>Benutzer-Autorisierung beim Anbieter</p>
            </div>
          </div>
          <div className="flow-step">
            <span className="step-number">3</span>
            <div className="step-content">
              <h4>Callback</h4>
              <p>Rückleitung mit Authorization Code</p>
            </div>
          </div>
          <div className="flow-step">
            <span className="step-number">4</span>
            <div className="step-content">
              <h4>Token Exchange</h4>
              <p>Code gegen Access Token tauschen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Konfiguration</h2>
        <div className="config-overview">
          <div className="config-card">
            <h4>🌐 Redirect URIs</h4>
            <p>Konfigurierte Callback-URLs für OAuth-Anbieter</p>
            <ul>
              <li><code>/auth/facebook/callback</code></li>
              <li><code>/auth/google/callback</code></li>
            </ul>
          </div>
          
          <div className="config-card">
            <h4>🔑 Scopes</h4>
            <p>Angeforderte Berechtigungen von SSO-Anbietern</p>
            <ul>
              <li>E-Mail-Adresse</li>
              <li>Basis-Profildaten</li>
              <li>Öffentliche Profilinformationen</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🛡️ Sicherheit</h2>
        <div className="security-measures">
          <div className="security-item">
            <span className="security-icon">🔒</span>
            <div>
              <h4>State Parameter</h4>
              <p>CSRF-Schutz durch zufällige State-Parameter</p>
            </div>
          </div>
          
          <div className="security-item">
            <span className="security-icon">⏰</span>
            <div>
              <h4>Token Expiration</h4>
              <p>Automatische Token-Invalidierung nach Ablaufzeit</p>
            </div>
          </div>
          
          <div className="security-item">
            <span className="security-icon">🔄</span>
            <div>
              <h4>Token Refresh</h4>
              <p>Automatische Erneuerung abgelaufener Tokens</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔵 Google OAuth</h2>
        <div className="oauth-provider">
          <div className="provider-info">
            <h4>📋 Zweck</h4>
            <p>Ermöglicht Nutzern, sich mit ihrem Google-Konto anzumelden und Basic-Profile-Informationen abzurufen.</p>
          </div>
          
          <div className="provider-config">
            <h4>⚙️ Konfiguration</h4>
            <div className="config-code">
              <pre><code>{`GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret`}</code></pre>
            </div>
            <p><strong>Redirect-URI:</strong> <code>https://yourdomain.com/auth/google/callback</code></p>
          </div>

          <div className="provider-files">
            <h4>📁 Wichtige Dateien & Methoden</h4>
            <ul>
              <li><code>/Backend/Integrations/Auth/Google.ts</code></li>
              <li><code>initGoogleStrategy()</code>: Initialisiert die Passport-Strategy</li>
              <li><code>verifyCallback(accessToken, refreshToken, profile, done)</code>: Mapping zu unserem User-Schema</li>
            </ul>
          </div>

          <div className="provider-example">
            <h4>💻 Express-Route Beispiel</h4>
            <div className="config-code">
              <pre><code>{`import passport from 'passport';
import '../Integrations/Auth/Google';

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔵 Facebook OAuth</h2>
        <div className="oauth-provider">
          <div className="provider-info">
            <h4>📋 Zweck</h4>
            <p>Ermöglicht Nutzern, sich mit ihrem Facebook-Konto anzumelden und Profil-Daten abzurufen.</p>
          </div>
          
          <div className="provider-config">
            <h4>⚙️ Konfiguration</h4>
            <div className="config-code">
              <pre><code>{`FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret`}</code></pre>
            </div>
            <p><strong>Redirect-URI:</strong> <code>https://yourdomain.com/auth/facebook/callback</code></p>
          </div>

          <div className="provider-files">
            <h4>📁 Wichtige Dateien & Methoden</h4>
            <ul>
              <li><code>/Backend/Integrations/Auth/Facebook.ts</code></li>
              <li><code>initFacebookStrategy()</code>: Initialisiert die Passport-Strategy</li>
              <li><code>verifyCallback(accessToken, refreshToken, profile, done)</code>: Mapping zu unserem User-Schema</li>
            </ul>
          </div>

          <div className="provider-example">
            <h4>💻 Express-Route Beispiel</h4>
            <div className="config-code">
              <pre><code>{`import passport from 'passport';
import '../Integrations/Auth/Facebook';

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔗 Integration-Übersicht</h2>
        <div className="integration-overview">
          <div className="integration-card">
            <h4>🚀 Unterstützte Anbieter</h4>
            <ul>
              <li>✅ Google OAuth 2.0</li>
              <li>✅ Facebook OAuth 2.0</li>
              <li>🔄 Weitere Anbieter geplant</li>
            </ul>
          </div>
          
          <div className="integration-card">
            <h4>🛠️ Passport.js Integration</h4>
            <p>Verwendet Passport.js Strategies für einheitliche OAuth-Implementierung mit standardisierten verify-Callbacks.</p>
          </div>
          
          <div className="integration-card">
            <h4>🔄 User-Mapping</h4>
            <p>Automatische Zuordnung von OAuth-Profildaten zu unserem User-Schema mit Fallback-Behandlung.</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 