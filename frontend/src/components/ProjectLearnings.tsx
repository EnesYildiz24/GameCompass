import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ProjectLearnings: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>💡</span> <span className="gradient-text">Project Learnings</span></h1>
      <p className="subtitle">Erkenntnisse, Herausforderungen und Learnings aus der GameCompass-Entwicklung</p>
      
      <div className="section">
        <h2>✅ Was lief besonders gut</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>🏗️ Modulare Architektur</h4>
            <p><strong>Erfolg:</strong> Klare Trennung zwischen Frontend/Backend, Service-Layer Pattern</p>
            <ul>
              <li>Saubere API-Abstraktion mit axios</li>
              <li>Wiederverwendbare React-Komponenten</li>
              <li>Mongoose-Models mit klarer Schema-Definition</li>
            </ul>
            <div className="code-block">
              <pre><code>{`// Beispiel: Saubere Service-Abstraktion
class AuthenticationService {
  static async login(credentials) { ... }
  static async register(userData) { ... }
  static async logout() { ... }
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>🤖 KI-Integration</h4>
            <p><strong>Erfolg:</strong> Lokales LLM mit ChromaDB für semantische Suche</p>
            <ul>
              <li>Ollama-Integration funktioniert reibungslos</li>
              <li>Vector-Search liefert relevante Ergebnisse</li>
              <li>Chat-System ist benutzerfreundlich</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>🎨 UI/UX Konsistenz</h4>
            <p><strong>Erfolg:</strong> Einheitliches Design-System mit Theme-Support</p>
            <ul>
              <li>Dark/Light Mode funktioniert überall</li>
              <li>Responsive Design auf allen Geräten</li>
              <li>Wiederverwendbare CSS-Klassen</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>⚠️ Herausforderungen & Probleme</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`,
            borderLeft: `6px solid #fb923c`
          }}>
            <h4 style={{ color: '#fb923c', marginTop: 0 }}>🔄 State Management Komplexität</h4>
            <p><strong>Problem:</strong> Props-Drilling zwischen tief verschachtelten Komponenten</p>
            <p><strong>Lösung:</strong> React Context für Theme, Auth-Status. Für größere Apps: Redux Toolkit</p>
            <div className="code-block">
              <pre><code>{`// Verbesserung: Zentrale State-Verwaltung
const useGameCompass = () => {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  
  return { games, user, cart, actions: { ... } };
};`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ef4444`,
            borderLeft: `6px solid #ef4444`
          }}>
            <h4 style={{ color: '#ef4444', marginTop: 0 }}>🔐 Authentication Edge Cases</h4>
            <p><strong>Problem:</strong> Token-Refresh, Session-Management, OAuth-Fehlerbehandlung</p>
            <p><strong>Learnings:</strong> Robuste Error-Boundaries und Fallback-Strategien sind essentiell</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`,
            borderLeft: `6px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>📱 Performance Optimierung</h4>
            <p><strong>Problem:</strong> Große Game-Listen, Bild-Loading, Bundle-Size</p>
            <p><strong>Lösung:</strong> Lazy Loading, Image-Optimization, Code-Splitting implementiert</p>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🧠 Technische Erkenntnisse</h2>
        
        <h3>📚 Framework & Tools</h3>
        <ul>
          <li><strong>Vite &gt; Create React App:</strong> Deutlich schnellere Builds und HMR</li>
          <li><strong>TypeScript:</strong> Reduzierte Bugs durch Type-Safety, bessere IDE-Unterstützung</li>
          <li><strong>Mongoose:</strong> Schema-Validation verhindert Datenbank-Inkonsistenzen</li>
          <li><strong>Axios:</strong> Interceptors für globales Error-Handling sehr praktisch</li>
          <li><strong>Passport.js:</strong> OAuth-Implementierung deutlich einfacher als Custom-Auth</li>
        </ul>

        <h3>🏗️ Architektur-Patterns</h3>
        <div className="code-block">
          <pre><code>{`// Bewährte Patterns aus dem Projekt:

1. ✅ Service Layer Pattern:
   - BusinessLogik von Controllern getrennt
   - Wiederverwendbar & testbar

2. ✅ Repository Pattern:
   - Datenbank-Abstraktion
   - Einfacher Wechsel zwischen DB-Systemen

3. ✅ Middleware Chain:
   - Authentication, Validation, Error-Handling
   - Komposierbar & erweiterbar

4. ⚠️ Component Composition:
   - Funktioniert gut, aber bei 60+ Komponenten
   - Ordner-Struktur wird wichtiger`}</code></pre>
        </div>

        <h3>🔧 Development Workflow</h3>
        <ul>
          <li><strong>Hot Reload:</strong> Massive Produktivitätssteigerung bei UI-Entwicklung</li>
          <li><strong>ESLint + Prettier:</strong> Konsistenter Code-Style im Team</li>
          <li><strong>Git Branches:</strong> Feature-Branches verhindern Merge-Konflikte</li>
          <li><strong>Environment Variables:</strong> Flexibilität zwischen dev/prod</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎯 Besonderheiten von GameCompass</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>🔍 Hybrid Search</h4>
            <p>Kombination aus klassischer DB-Suche und AI-powered Vector-Search</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>🎵 Audio-First</h4>
            <p>Voice-Chat Integration in Gaming-Platform ist innovativ</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>🤝 Multi-Provider Auth</h4>
            <p>Seamless Integration von Google, Facebook & traditionellem Login</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ef4444`
          }}>
            <h4 style={{ color: '#ef4444', marginTop: 0 }}>💳 Secure Payments</h4>
            <p>Stripe-Integration mit komplexer Bestelllogik & Inventory-Management</p>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📈 Team & Prozess Learnings</h2>
        
        <h3>👥 Zusammenarbeit</h3>
        <ul>
          <li><strong>Pair Programming:</strong> Besonders effektiv bei komplexen API-Integrationen</li>
          <li><strong>Code Reviews:</strong> Qualitätssicherung und Wissenstransfer</li>
          <li><strong>Sprint Planning:</strong> Agile Methoden auch in Uni-Projekten sinnvoll</li>
          <li><strong>Documentation-First:</strong> Wiki-Aufbau parallel zur Entwicklung</li>
        </ul>

        <h3>🚀 Was würden wir anders machen?</h3>
        <ol>
          <li><strong>Testing von Anfang an:</strong> Unit-Tests parallel schreiben</li>
          <li><strong>Design System früher:</strong> Component-Library vor ersten Features</li>
          <li><strong>Error Monitoring:</strong> Sentry o.ä. für Production-Debugging</li>
          <li><strong>Performance Budgets:</strong> Bundle-Size-Limits definieren</li>
          <li><strong>Accessibility:</strong> ARIA-Labels und Screen-Reader-Support</li>
        </ol>
      </div>

      <div className="section">
        <h2>🔮 Erkenntnisse für zukünftige Projekte</h2>
        
        <h3>✨ Erfolgsmuster, die wir wiederholen werden:</h3>
        <ul>
          <li><strong>TypeScript-First:</strong> Weniger Runtime-Fehler, bessere DX</li>
          <li><strong>Service-Layer-Architektur:</strong> Saubere Trennung, einfache Tests</li>
          <li><strong>Environment-based Config:</strong> Flexibilität zwischen Umgebungen</li>
          <li><strong>Component-based Styling:</strong> CSS-in-JS oder CSS-Modules</li>
          <li><strong>API-First Development:</strong> Backend-API vor Frontend-Integration</li>
        </ul>

        <h3>⚠️ Anti-Patterns die wir vermeiden werden:</h3>
        <ul>
          <li><strong>Premature Optimization:</strong> Erst funktional, dann performant</li>
          <li><strong>Monolithische Komponenten:</strong> Single Responsibility Principle</li>
          <li><strong>Hardcoded Values:</strong> Alles konfigurierbar machen</li>
          <li><strong>Missing Error Boundaries:</strong> Graceful Fallbacks implementieren</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎓 Persönliche Entwicklung</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #22c55e`
          }}>
            <strong style={{ color: '#22c55e' }}>Neu gelernte Skills:</strong> KI-Integration, Vector-Databases, Advanced React Patterns, OAuth-Implementation
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #3b82f6`
          }}>
            <strong style={{ color: '#3b82f6' }}>Vertiefte Kenntnisse:</strong> TypeScript, Node.js, MongoDB, React Context, CSS-in-JS
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #a855f7`
          }}>
            <strong style={{ color: '#a855f7' }}>Soft Skills:</strong> Projektmanagement, Team-Koordination, Dokumentation, Problem-Solving
          </div>

        </div>
      </div>
    </div>
  );
}; 