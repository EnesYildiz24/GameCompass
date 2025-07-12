import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const NodemailerComponent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>📧</span> <span className="gradient-text">E-Mail-Verifikation</span></h1>
      <p className="subtitle">GameCompass Backend - Nodemailer & JWT für Benutzer-Verifikation</p>
      
      <div className="section">
        <h2>📋 Beschreibung</h2>
        <p>Dieses Modul <code>/Backend/Integrations/Notifications/EmailVerification.ts</code> nutzt <strong>Nodemailer</strong> und <strong>JWT</strong>, um Verifizierungs-E-Mails an neue Nutzer zu senden.</p>
      </div>

      <div className="section">
        <h2>🔧 Funktion</h2>
        <div className="function-info">
          <h4>sendVerificationEmail(user: UserResource)</h4>
          <ul>
            <li>Signiert ein JWT mit <code>{`{ userId, type: 'email-verification' }`}</code> (Gültigkeit: 1 Tag)</li>
            <li>Baut einen Verifikations-Link:</li>
          </ul>
          <div className="code-block">
            <pre><code>{`\${BACKEND_URL}/verify-email?token=<JWT>`}</code></pre>
          </div>
          <p>Sendet die E-Mail mit Nodemailer.</p>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Konfiguration & Umgebungsvariablen</h2>
        <div className="config-table">
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>JWT_SECRET</code></td>
                <td>Secret für JWT-Signaturen</td>
              </tr>
              <tr>
                <td><code>BACKEND_URL</code></td>
                <td>Basis-URL deines Backends (für Links)</td>
              </tr>
              <tr>
                <td><code>EMAIL_SMTP_HOST</code></td>
                <td>SMTP-Server-Host (z.B. smtp.mailtrap.io)</td>
              </tr>
              <tr>
                <td><code>EMAIL_SMTP_PORT</code></td>
                <td>SMTP-Server-Port (z.B. 587)</td>
              </tr>
              <tr>
                <td><code>EMAIL</code></td>
                <td>Absender-Adresse / SMTP-User</td>
              </tr>
              <tr>
                <td><code>EMAIL_PASS</code></td>
                <td>SMTP-Passwort</td>
              </tr>
              <tr>
                <td><code>CORS_ORIGIN</code></td>
                <td>Ursprungs-URL für Verifikations-Link</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Ablauf</h2>
        <div className="flow-steps">
          <div className="step">
            <h4>1. Token erstellen</h4>
            <div className="code-block">
              <pre><code>{`const token = jwt.sign(
  { userId: user.id, type: 'email-verification' },
  JWT_SECRET,
  { expiresIn: '1d' }
);`}</code></pre>
            </div>
          </div>
          
          <div className="step">
            <h4>2. Link generieren</h4>
            <div className="code-block">
              <pre><code>{`const url = \`\${CORS_ORIGIN}/verify-email?token=\${encodeURIComponent(token)}\`;`}</code></pre>
            </div>
          </div>
          
          <div className="step">
            <h4>3. SMTP-Transporter</h4>
            <div className="code-block">
              <pre><code>{`const transporter = nodemailer.createTransporter({
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: false,
  auth: { user: EMAIL, pass: EMAIL_PASS },
});`}</code></pre>
            </div>
          </div>
          
          <div className="step">
            <h4>4. E-Mail senden</h4>
            <div className="code-block">
              <pre><code>{`await transporter.sendMail({
  from: \`"GameCompass" <\${EMAIL}>\`,
  to: user.email,
  subject: 'Bitte bestätige deine E-Mail-Adresse',
  html: \`
    <p>Hallo \${user.username},</p>
    <p>Klicke auf diesen Link, um deine E-Mail zu bestätigen:<br/>
       <a href="\${url}">\${url}</a></p>
  \`,
});`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>❌ Fehlerbehandlung</h2>
        <div className="error-info">
          <p>Nodemailer wirft bei Verbindungsfehlern oder Auth-Failures Exceptions.</p>
          <p>Fange <code>sendMail</code>-Fehler in aufrufender Funktion ab und gib eine verständliche Fehlermeldung an den Client weiter.</p>
        </div>
      </div>
    </div>
  );
}; 