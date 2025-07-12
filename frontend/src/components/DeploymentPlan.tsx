import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mermaid } from './Mermaid';
import '../styles/DeploymentPlan.css';

export const DeploymentPlan: React.FC = () => {
  const { theme } = useTheme();

  const mermaidChart = `flowchart TD\n    INTERNET([Internet])\n    LB["DO Load Balancer\\nAuto-TLS"]\n\n    INTERNET -->|HTTPS| LB\n    LB -->|"/"| FE["Frontend\\n(App Platform)"]\n    LB -->|"/api"| BE["Backend\\n(App Platform)"]\n\n    subgraph VPC\n        OL["Ollama Droplet"]\n        MDB[("Managed MongoDB")]\n        BE -->|"/ollama"| OL\n        BE --> MDB\n        OL --> MDB\n    end`;

  return (
    <div className="deployment-plan-container">
      <h1><span className="rocket-emoji">🚀</span> <span className="gradient-text">Deployment Plan – GameCompass (DigitalOcean)</span></h1>
      <p className="subtitle"><strong>Ziel:</strong> Schlankes, aber skalierbares Setup auf DigitalOcean. Alle Kern‑Services laufen getrennt; Stripe bleibt extern.</p>

      <div className="section">
        <h2>📊 Komponenten‑Matrix</h2>
        <div className="table-container">
          <table className="deployment-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Dienst / Ressource</th>
                <th>DO‑Produkt</th>
                <th>Größe (Richtwert)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frontend</td>
                <td>React / Next Build</td>
                <td><strong>App Platform</strong></td>
                <td>Basic (1 vCPU / 1 GB)</td>
              </tr>
              <tr>
                <td>Backend API</td>
                <td>Express (Node)</td>
                <td><strong>App Platform</strong></td>
                <td>Basic (2 vCPU / 2 GB)</td>
              </tr>
              <tr>
                <td>Datenbank</td>
                <td>MongoDB</td>
                <td><strong>Managed DB</strong></td>
                <td>Shared Tier (1 GB RAM)</td>
              </tr>
              <tr>
                <td>LLM‑Service</td>
                <td>Ollama 3.1</td>
                <td><strong>Droplet</strong></td>
                <td>s‑4vCPU‑8GB (CPU, VPC)</td>
              </tr>
              <tr>
                <td>TLS / Routing</td>
                <td>Let's Encrypt + LB</td>
                <td>auto (App Platform)</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Zahlungen</td>
                <td>Stripe (extern)</td>
                <td>—</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

              <div className="section">
          <h2>🌐 Netzwerk-Topologie</h2>
          <Mermaid chart={mermaidChart} theme={theme as 'light' | 'dark'} />
        </div>

      <div className="section">
        <h2>⚙️ Betriebs‑Szenarien</h2>
        <div className="table-container">
          <table className="deployment-table">
            <thead>
              <tr>
                <th>Stufe</th>
                <th>Einsatzzweck</th>
                <th>Kosten ≈/Monat</th>
                <th>Bemerkung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dev / MVP</strong></td>
                <td>1 Droplet + Compose</td>
                <td>24 – 48 USD</td>
                <td>Alles auf einer VM</td>
              </tr>
              <tr>
                <td><strong>Prod klein</strong></td>
                <td>Plan oben</td>
                <td>65 – 90 USD</td>
                <td>Auto‑TLS, geringer Ops‑Aufwand</td>
              </tr>
              <tr>
                <td><strong>Prod GPU</strong></td>
                <td>zusätzl. GPU‑Droplet</td>
                <td>+ ≈ 550 USD</td>
                <td>Schnellere LLM‑Inference</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔐 Secrets & Webhooks</h2>
        <ul className="secrets-list">
          <li>
            <strong>Umgebungsvariablen:</strong> 
            <code>MONGO_URI</code>, <code>JWT_SECRET</code>, <code>STRIPE_SECRET_KEY</code>, <code>GOOGLE_CLIENT_ID</code>, …
          </li>
          <li>
            <strong>Stripe‑Webhook:</strong> 
            <code>https://api.&lt;yourdomain&gt;.com/webhooks/stripe</code>
          </li>
        </ul>
      </div>
    </div>
  );
}; 