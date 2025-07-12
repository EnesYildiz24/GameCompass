import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AdminModel: React.FC = () => {
  const { theme } = useTheme();

  const jsonExample = `{
  "id": "60ff7h8j5311236168a10h44",
  "email": "admin@example.com",
  "role": "admin",
  "provider": "local",
  "verified": true,
  "isPublisher": false,
  "permissions": ["user:read", "user:update", "order:cancel"],
  "createdAt": "2025-06-17T18:00:00.000Z",
  "updatedAt": "2025-06-17T18:05:00.000Z"
}`;

  return (
    <div className="model-detail-container">
      <h1><span>👑</span> <span className="gradient-text">Admin Model</span></h1>
      <p className="subtitle">Das Admin-Modell erweitert das User-Modell um administrative Berechtigungen. Es wird als Discriminator auf der User-Collection verwendet.</p>
      
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
                <td>z.B. email, role, verified, isPublisher</td>
                <td>–</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>permissions</code></td>
                <td>String[]</td>
                <td>Liste der spezifischen Admin-Rechte</td>
                <td>ja</td>
                <td>[]</td>
              </tr>
              <tr>
                <td><code>createdAt</code></td>
                <td>Date</td>
                <td>Automatisch angelegt (über timestamps: true im User)</td>
                <td>ja</td>
                <td>–</td>
              </tr>
              <tr>
                <td><code>updatedAt</code></td>
                <td>Date</td>
                <td>Automatisch aktualisiert (über timestamps: true)</td>
                <td>ja</td>
                <td>–</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>🔧 Validierungen & Hooks</h2>
        <ul className="relationships-list">
          <li><strong>Permissions Array:</strong> Jeder Eintrag muss eine Nicht-Leer-String sein. Optional: Validierung gegen vordefinierte Rechte (['user:read', 'user:update', ...]).</li>
          <li><strong>Discriminator:</strong> Wird über User.discriminator('admin', AdminSchema) angelegt; erbt Timestamps und alle User-Felder.</li>
        </ul>
      </div>

      <div className="section">
        <h2>⚙️ Statics & Methoden</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🔍 findByPermission()</h4>
            <p>Alle Admins mit bestimmter Berechtigung liefern</p>
          </div>
          
          <div className="method-card">
            <h4>✅ hasPermission()</h4>
            <p>Prüfen ob Admin bestimmte Berechtigung hat</p>
          </div>
          
          <div className="method-card">
            <h4>➕ addPermission()</h4>
            <p>Neue Berechtigung hinzufügen und speichern</p>
          </div>
          
          <div className="method-card">
            <h4>🗑️ removePermission()</h4>
            <p>Berechtigung entfernen und speichern</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Discriminator-Konzept</h2>
        <ul className="relationships-list">
          <li><strong>User-Erweiterung:</strong> Admin erweitert das User-Modell um permissions-Array ohne separate Collection.</li>
          <li><strong>Shared Collection:</strong> Alle User-Dokumente (Standard-User, Buyer und Admin) werden in derselben users-Collection gespeichert.</li>
          <li><strong>Type-Field:</strong> Ein internes __t-Feld unterscheidet zwischen User-Typen für das Discriminator-Pattern.</li>
          <li><strong>Schema-Vererbung:</strong> Alle User-Felder (email, role, timestamps) werden automatisch übernommen.</li>
          <li><strong>Selective Queries:</strong> Queries können gezielt auf Admin-Dokumente beschränkt werden durch den Discriminator.</li>
        </ul>
      </div>

      <div className="section">
        <h2>🛡️ Permission-System</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>👥 user:read</h4>
            <p>Benutzer-Daten einsehen</p>
          </div>
          
          <div className="method-card">
            <h4>✏️ user:update</h4>
            <p>Benutzer-Daten bearbeiten</p>
          </div>
          
          <div className="method-card">
            <h4>📦 order:view</h4>
            <p>Bestellungen einsehen</p>
          </div>
          
          <div className="method-card">
            <h4>❌ order:cancel</h4>
            <p>Bestellungen stornieren</p>
          </div>
          
          <div className="method-card">
            <h4>🎮 game:manage</h4>
            <p>Spiele verwalten</p>
          </div>
          
          <div className="method-card">
            <h4>🏪 system:admin</h4>
            <p>System-Administration</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>🔐 Admin-Features</h2>
        <div className="methods-grid">
          <div className="method-card">
            <h4>🎯 Granulare Rechte</h4>
            <p>Fein abgestufte Berechtigungen für spezifische Aktionen</p>
          </div>
          
          <div className="method-card">
            <h4>🔄 Dynamische Verwaltung</h4>
            <p>Permissions können zur Laufzeit hinzugefügt/entfernt werden</p>
          </div>
          
          <div className="method-card">
            <h4>🔍 Permission-Checks</h4>
            <p>Einfache Validierung von Admin-Berechtigungen</p>
          </div>

          <div className="method-card">
            <h4>👥 Multi-Admin-Support</h4>
            <p>Mehrere Admins mit unterschiedlichen Rechte-Sets</p>
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