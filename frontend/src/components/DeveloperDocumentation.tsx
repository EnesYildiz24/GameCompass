import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/DeveloperDocumentation.css';

export const DeveloperDocumentation: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="developer-docs-container">
      <h1><span className="code-emoji">👨‍💻</span> <span className="gradient-text">Entwicklerdokumentation</span></h1>
      <p className="subtitle">
        <strong>Hinweis:</strong> Diese Anleitung wurde zuletzt am <strong>26. April 2025</strong> auf macOS 12+ und Windows 11 verifiziert. 
        Bitte melde Abweichungen oder Fehler an Enes.
      </p>

      <div className="section">
        <h2>🚀 Projektüberblick</h2>
        <p><strong>GameCompass Website</strong> ist eine Full‑Stack‑Webanwendung, die aus zwei eigenständigen Node.js‑Paketen besteht:</p>
        
        <div className="table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Teilprojekt</th>
                <th>Zweck</th>
                <th>Start‑Skript</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>frontend/</strong></td>
                <td>React‑SPA (Vite + TypeScript)</td>
                <td><code>npm run dev</code></td>
              </tr>
              <tr>
                <td><strong>backend/</strong></td>
                <td>REST‑API (Express + TypeScript)</td>
                <td><code>npm start</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>💻 System‑ & Software­voraussetzungen</h2>
        <div className="table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Abhängigkeit</th>
                <th>Empfohlene Version</th>
                <th>Getestet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Node.js</strong></td>
                <td>≥ 18 LTS</td>
                <td>18.19.1, 20.11.1</td>
              </tr>
              <tr>
                <td><strong>npm</strong></td>
                <td>≥ 9</td>
                <td>9.6.7, 10.5.2</td>
              </tr>
              <tr>
                <td><strong>Git</strong></td>
                <td>≥ 2.30.0</td>
                <td>2.40.0, 2.49.0</td>
              </tr>
              <tr>
                <td><strong>mongosh</strong></td>
                <td>≥ 2.5.0</td>
                <td>2.5.0</td>
              </tr>
              <tr>
                <td><strong>TypeScript</strong></td>
                <td>≥ 5.8.0</td>
                <td>5.8.3</td>
              </tr>
              <tr>
                <td><strong>Docker</strong> <em>(optional)</em></td>
                <td>≥ 24</td>
                <td>28.1.1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <strong>macOS-Tipp:</strong> Verwende <strong>Volta</strong> (<a href="https://volta.sh" target="_blank">https://volta.sh</a>), 
          um Node‑ & npm‑Versionen projektspezifisch zu pinnen.
        </div>
      </div>

      <div className="section">
        <h2>📥 Repository klonen</h2>
        <div className="code-block">
          <pre><code>{`# per SSH
git clone git@gitlab.bht-berlin.de:gamecompass/website.git

# oder per HTTPS
git clone https://gitlab.bht-berlin.de/gamecompass/website.git

cd website`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>📦 Abhängigkeiten installieren</h2>
        <div className="info-box">
          <span className="info-icon">ℹ️</span>
          <strong>Kurzfassung:</strong> Führe <code>npm install</code> in jedem Teilprojekt aus, 
          bevor du die Entwicklungs‑ oder Startscripte ausführst.
        </div>
        
        <div className="code-block">
          <pre><code>{`# Root‑Projekt (optional, falls ein package.json im Root liegt)
# npm install

# Frontend‑Dependencies
cd frontend
npm install          # oder: npm ci

# Backend‑Dependencies
cd ../backend
npm install          # oder: npm ci

npm run build        # nach jeder Änderung des Backends`}</code></pre>
        </div>
        
        <p><strong>npm install</strong> löst SemVer‑Bereiche gemäß <em>package.json</em> auf – ideal für lokale Entwicklung.</p>
      </div>

      <div className="section">
        <h2>🗄️ Datenbank‑Setup (lokal)</h2>
        <p>Für die Entwicklung genügt eine lokale <strong>MongoDB + mongosh</strong>‑Shell.</p>
        
        <h3>Software installieren</h3>
        <div className="table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Paket</th>
                <th>Download‑Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MongoDB Community Server</strong></td>
                <td><a href="https://www.mongodb.com/try/download/community" target="_blank">https://www.mongodb.com/try/download/community</a></td>
              </tr>
              <tr>
                <td><strong>mongosh (Shell)</strong></td>
                <td><a href="https://www.mongodb.com/try/download/shell" target="_blank">https://www.mongodb.com/try/download/shell</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="tip-box">
          <span className="tip-icon">🪟</span>
          <strong>Windows‑Tipp:</strong> <code>mongosh.exe</code> nach <code>C:\Program Files\MongoDB\mongosh\bin</code> 
          kopieren und den Ordner zum <strong>PATH</strong> hinzufügen.
        </div>

        <h3>Erste Datenbank anlegen</h3>
        <div className="code-block">
          <pre><code>{`# Shell öffnen
mongosh
# neue Datenbank auswählen (wird on‑the‑fly erstellt)
> use GameCompass
# Beispiel‑Collection erzeugen
> db.users.insertOne({ username: "test", email: "test@example.com" })
# Kontrolle
> show collections      # → users
> db.users.find().pretty()
# Für Spiele
> db.spiels.find().pretty()
# Chat Pop up promps
> db.chatprompts.find().pretty()`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Lokale Entwicklung starten</h2>
        <p>Öffne zwei Terminal‑Tabs (oder nutze tmux/Zellij):</p>
        
        <div className="code-block">
          <pre><code>{`# Tab 1 – Frontend mit Vite + HMR
cd frontend
npm run dev          # http://localhost:5173

# Tab 2 – Backend API
cd backend
npm start            # http://localhost:3000 (siehe .env)`}</code></pre>
        </div>
        
        <p>Wenn beide Server laufen, konsumiert das Frontend API‑Requests automatisch von <code>VITE_API_BASE_URL</code> (siehe <strong>frontend/.env.local</strong>).</p>
      </div>

      <div className="section">
        <h2>🧪 Tests ausführen</h2>
        <p>Wir verwenden <strong>Vitest</strong> (getrennte Config je Teilprojekt).</p>
        
        <div className="code-block">
          <pre><code>{`# Frontend‑Tests (Watch‑Modus)
cd frontend
npm test            # alias für "vitest"

# Backend‑Tests
cd ../backend
npm test

# Coverage (je Projekt)
npx vitest run --coverage`}</code></pre>
        </div>
        
        <p>Berichte liegen unter <code>coverage/index.html</code>.</p>
      </div>

      <div className="section">
        <h2>✨ Codequalität</h2>
        <div className="table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Zweck</th>
                <th>Skript</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Prettier</strong></td>
                <td>Auto‑Formatierung</td>
                <td><code>npm run format</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p>Pre‑commit‑Hooks via <strong>Husky + lint‑staged</strong> sorgen für sauberen Code im Repo.</p>
      </div>

      <div className="section">
        <h2>🏗️ Build & Deployment</h2>
        <h3>Produktions­builds erzeugen</h3>
        
        <div className="code-block">
          <pre><code>{`# Frontend (Vite)
cd frontend
npm run build       # Ergebnis: frontend/dist

# Backend (z. B. esbuild)
cd ../backend
npm run build       # Ergebnis: backend/dist`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>🔐 Umgebungs­variablen</h2>
        <p>Alle sensitiven Daten gehören in <strong>backend/.env</strong> oder <strong>frontend/.env.local</strong> und dürfen <strong>nie</strong> ins Repository committed werden.</p>
        
        <h3>Beispiel backend/.env</h3>
        <div className="code-block">
          <pre><code>{`# Server configuration
PORT=3000
HOST=localhost

# JWT
JWT_SECRET=«dein‑jwt‑secret»
JWT_TTL=300
COOKIE_NAME=access_token
CORS_ORIGIN=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=«db‑user»
DB_PASSWORD=«db‑pass»
DB_NAME=GameCompass`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>💳 Stripe CLI (für lokale Webhooks)</h2>
        <p>Um Stripe-Webhooks lokal zu empfangen und zu testen, benötigst du die <strong>Stripe CLI</strong>.</p>
        
        <h3>Stripe CLI herunterladen und einrichten (Windows)</h3>
        <div className="step-list">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Gehe zu:</strong><br/>
              <a href="https://github.com/stripe/stripe-cli/releases/tag/v1.27.0" target="_blank">
                https://github.com/stripe/stripe-cli/releases/tag/v1.27.0
              </a>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Lade die Datei</strong> <code>stripe_1.27.0_windows_x86_64.zip</code> herunter und entpacke sie.
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>Kopiere die Datei <code>stripe.exe</code></strong> aus dem entpackten Archiv in deinen <code>backend</code>-Ordner des Projekts.
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">4</span>
            <div className="step-content">
              <strong>Führe die Stripe CLI im Backend-Ordner aus:</strong>
              <div className="code-block">
                <pre><code>.\stripe.exe listen --forward-to https://localhost:3000/api/stripe/webhook --skip-verify</code></pre>
              </div>
            </div>
          </div>
        </div>
        
        <h3>Hinweis für Mac/Linux-Nutzer</h3>
        <p>Unter macOS kannst du die CLI einfach im Terminal installieren:</p>
        <div className="code-block">
          <pre><code>{`brew install stripe/stripe-cli/stripe`}</code></pre>
        </div>
        <p>Dann kannst du Stripe CLI genauso verwenden:</p>
        <div className="code-block">
          <pre><code>{`stripe listen --forward-to https://localhost:3000/api/stripe/webhook --skip-verify`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>📁 Projektstruktur (Top‑Level)</h2>
        <div className="code-block">
          <pre><code>{`website/
├─ frontend/        # React (Vite + TS)
│  ├─ src/
│  ├─ public/
│  └─ vite.config.ts
├─ backend/         # Express (TS)
│  ├─ src/
│  ├─ test/
│  └─ tsconfig.json
├─ Dockerfile
├─ README.md
└─ ...`}</code></pre>
        </div>
      </div>
    </div>
  );
}; 