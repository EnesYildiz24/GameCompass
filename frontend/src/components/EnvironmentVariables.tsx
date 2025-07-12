import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/EnvironmentVariables.css';

export const EnvironmentVariables: React.FC = () => {
  const { theme } = useTheme();

  const copyToClipboard = async (text: string, elementId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Visual feedback
      const button = document.getElementById(elementId);
      if (button) {
        button.innerHTML = '✅';
        setTimeout(() => {
          button.innerHTML = '📋';
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const frontendEnvText = `# Frontend .env.example
BASE_URL=https://localhost:5173
VITE_REAL_FETCH=true
VITE_API_SERVER_URL=https://localhost:3000
SSL_KEY_FILE=./cert/private.key
SSL_CRT_FILE=./cert/public.crt
VITE_ELEVENLABS_API_KEY=<YOUR_ELEVENLABS_API_KEY>
VITE_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>

VITE_FB_APP_ID=<YOUR_FB_APP_ID>
VITE_FB_APP_SECRET=<YOUR_FB_APP_SECRET>

VITE_RAWG_KEY=<YOUR_RAWG_API_KEY>
RAWG_BASE_URL=https://api.rawg.io/api`;

  const backendEnvText = `# Backend .env.example

# Server configuration
PORT=3000
HOST=localhost
NODE_ENV=development
BACKEND_URL=https://localhost:3000
CORS_ORIGIN=https://localhost:5173

# JWT Secret for authentication
JWT_SECRET="vjsndjvnenrjvn3nj!82429d3undCouldBeWorse!"
COOKIE_NAME=access_token
JWT_TTL=300

# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=Imba
DB_PASSWORD=Test111xs
DB_NAME=GameCompass

# MongoDB Verbindung
MONGO_URI=mongodb://localhost:27017/GameCompass

# SSL Configuration
SSL_KEY_FILE=./cert/private.key
SSL_CRT_FILE=./cert/public.crt

# Email Configuration
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL=<YOUR_EMAIL>
EMAIL_PASS=<YOUR_EMAIL_PASSWORD>

# Google OAuth
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_REDIRECT_URI=https://localhost:3000/auth/google/callback

# API Keys
RAWG_API_KEY=f1694e79bc1349b2b3a93170b5a24d45
RAWG_BASE_URL=https://api.rawg.io/api

# AI/LLM Configuration
AI_PROVIDER=llama3
OLLAMA_API_URL=http://localhost:11434

# Stripe Payment
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>`;

  return (
    <div className="env-vars-container">
      <h1><span className="env-emoji">⚙️</span> <span className="gradient-text">Umgebungsvariablen</span></h1>
      <p className="subtitle">
        Diese Datei enthält Beispielkonfigurationen für die <code>.env.example</code> Dateien im <strong>Frontend</strong> und <strong>Backend</strong> des GameCompass-Projekts.
      </p>

      <div className="section">
        <h2>🌐 Frontend (<code>frontend/.env.example</code>)</h2>
        <p>Alle Frontend-spezifischen Umgebungsvariablen mit <code>VITE_</code> Präfix für Vite-Zugriff im Browser.</p>
        
        <div className="table-container">
          <table className="env-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Zweck</th>
                <th>Beispielwert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>BASE_URL</code></td>
                <td>Frontend-Basis-URL</td>
                <td>https://localhost:5173</td>
              </tr>
              <tr>
                <td><code>VITE_API_SERVER_URL</code></td>
                <td>Backend-API-Endpunkt</td>
                <td>https://localhost:3000</td>
              </tr>
              <tr>
                <td><code>VITE_GOOGLE_CLIENT_ID</code></td>
                <td>Google OAuth Client ID</td>
                <td>649629314298-atc...</td>
              </tr>
              <tr>
                <td><code>VITE_FB_APP_ID</code></td>
                <td>Facebook App ID</td>
                <td>3419978304801828</td>
              </tr>
              <tr>
                <td><code>VITE_RAWG_KEY</code></td>
                <td>RAWG Gaming API Key</td>
                <td>f1694e79bc134...</td>
              </tr>
              <tr>
                <td><code>VITE_ELEVENLABS_API_KEY</code></td>
                <td>ElevenLabs Text-to-Speech</td>
                <td>sk_c86799d588df...</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="code-block-with-copy">
          <div className="code-header">
            <span className="code-title">Frontend .env Beispiel</span>
            <button 
              id="copy-frontend"
              className="copy-button"
              onClick={() => copyToClipboard(frontendEnvText, 'copy-frontend')}
              title="Code kopieren"
            >
              📋
            </button>
          </div>
          <div className="code-block">
            <pre><code>{frontendEnvText}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🌐 Backend (<code>backend/.env.example</code>)</h2>
        <p>Alle Server-seitigen Konfigurationen für Express, Datenbank, APIs und externe Services.</p>
        
        <div className="table-container">
          <table className="env-table">
            <thead>
              <tr>
                <th>Kategorie</th>
                <th>Variablen</th>
                <th>Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Server</strong></td>
                <td><code>PORT</code>, <code>HOST</code>, <code>NODE_ENV</code></td>
                <td>Basis-Server-Konfiguration</td>
              </tr>
              <tr>
                <td><strong>Authentifizierung</strong></td>
                <td><code>JWT_SECRET</code>, <code>JWT_TTL</code>, <code>COOKIE_NAME</code></td>
                <td>JSON Web Token Einstellungen</td>
              </tr>
              <tr>
                <td><strong>Database</strong></td>
                <td><code>MONGO_URI</code>, <code>DB_*</code></td>
                <td>MongoDB & SQL Database Verbindungen</td>
              </tr>
              <tr>
                <td><strong>OAuth</strong></td>
                <td><code>GOOGLE_CLIENT_*</code>, <code>FB_*</code></td>
                <td>Google & Facebook Login</td>
              </tr>
              <tr>
                <td><strong>Payment</strong></td>
                <td><code>STRIPE_*</code></td>
                <td>Stripe Zahlungsabwicklung</td>
              </tr>
              <tr>
                <td><strong>AI/LLM</strong></td>
                <td><code>OLLAMA_API_URL</code>, <code>AI_PROVIDER</code></td>
                <td>Ollama LLM Integration</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td><code>EMAIL_*</code></td>
                <td>SMTP E-Mail-Versand</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="code-block-with-copy">
          <div className="code-header">
            <span className="code-title">Backend .env Beispiel</span>
            <button 
              id="copy-backend"
              className="copy-button"
              onClick={() => copyToClipboard(backendEnvText, 'copy-backend')}
              title="Code kopieren"
            >
              📋
            </button>
          </div>
          <div className="code-block">
            <pre><code>{backendEnvText}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔐 Sicherheitshinweise</h2>
        <div className="security-warning">
          <span className="warning-icon">⚠️</span>
          <div>
            <strong>Wichtige Sicherheitsregeln:</strong>
            <ul>
              <li><strong>Niemals</strong> echte Credentials in <code>.env.example</code> Dateien!</li>
              <li>Lokale <code>.env</code> Dateien sind in <code>.gitignore</code> aufgeführt</li>
              <li>Für Produktion separate, sichere Umgebungsvariablen verwenden</li>
              <li>Secrets regelmäßig rotieren (JWT, API Keys, Stripe Keys)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>📋 Setup-Anleitung</h2>
        <div className="step-list">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Frontend Setup:</strong>
              <div className="code-block simple-code">
                <pre><code>cd frontend
cp .env.example .env.local
# Editiere .env.local mit deinen lokalen Werten</code></pre>
              </div>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Backend Setup:</strong>
              <div className="code-block simple-code">
                <pre><code>cd backend
cp .env.example .env
# Editiere .env mit deinen lokalen Werten</code></pre>
              </div>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>Validierung:</strong>
              <p>Starte beide Server und überprüfe die Konsole auf Fehlermeldungen bezüglich fehlender Umgebungsvariablen.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Häufige Probleme</h2>
        <div className="info-box">
          <span className="info-icon">💡</span>
          <div>
            <strong>CORS-Fehler:</strong> Überprüfe <code>CORS_ORIGIN</code> im Backend und <code>VITE_API_SERVER_URL</code> im Frontend.
          </div>
        </div>
        
        <div className="info-box">
          <span className="info-icon">💡</span>
          <div>
            <strong>Database Connection:</strong> Stelle sicher, dass MongoDB läuft und <code>MONGO_URI</code> korrekt ist.
          </div>
        </div>
        
        <div className="info-box">
          <span className="info-icon">💡</span>
          <div>
            <strong>SSL Zertifikate:</strong> Für HTTPS lokal generiere Zertifikate oder deaktiviere SSL im Development.
          </div>
        </div>
      </div>
    </div>
  );
}; 