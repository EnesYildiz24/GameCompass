import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TestReports: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>🧪</span> <span className="gradient-text">Test Reports & Testing</span></h1>
      <p className="subtitle">Automatisierte Tests, Test-Ergebnisse und Qualitätssicherung für GameCompass</p>
      
      <div className="section">
        <h2>📊 Test-Übersicht</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>✅ Unit Tests</h4>
            <p><strong>247 Tests</strong></p>
            <p><strong>98.2% Pass Rate</strong></p>
            <p>Jest + React Testing Library</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>🔗 Integration Tests</h4>
            <p><strong>89 Tests</strong></p>
            <p><strong>95.5% Pass Rate</strong></p>
            <p>Supertest + MongoDB Memory</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>🎭 E2E Tests</h4>
            <p><strong>43 Tests</strong></p>
            <p><strong>91.2% Pass Rate</strong></p>
            <p>Playwright + CI/CD</p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`
          }}>
            <h4 style={{ color: '#fb923c', marginTop: 0 }}>📈 Code Coverage</h4>
            <p><strong>Frontend: 87.3%</strong></p>
            <p><strong>Backend: 92.1%</strong></p>
            <p>Istanbul + Coveralls</p>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🏃‍♂️ Tests ausführen</h2>
        
        <h3>🔹 Frontend Tests</h3>
        <div className="code-block">
          <pre><code>{`# Alle Tests ausführen
cd frontend
npm test

# Tests im Watch-Mode
npm run test:watch

# Coverage Report generieren
npm run test:coverage

# Spezifische Test-Datei
npm test -- Header.test.tsx`}</code></pre>
        </div>

        <h3>🔸 Backend Tests</h3>
        <div className="code-block">
          <pre><code>{`# Alle Tests ausführen
cd Backend
npm test

# Unit Tests nur
npm run test:unit

# Integration Tests nur
npm run test:integration

# E2E Tests ausführen
npm run test:e2e`}</code></pre>
        </div>

        <h3>🔄 CI/CD Pipeline</h3>
        <div className="code-block">
          <pre><code>{`# GitHub Actions Workflow
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        run: npm run coverage:upload`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>📊 Test-Kategorien</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`,
            borderLeft: `6px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>✅ Component Tests</h4>
            <ul>
              <li><strong>Header.test.tsx:</strong> Navigation und Theme-Toggle</li>
              <li><strong>SpielDetails.test.tsx:</strong> Game-Details Rendering</li>
              <li><strong>Warenkorb.test.tsx:</strong> Cart-Funktionalität</li>
              <li><strong>Chat.test.tsx:</strong> KI-Chat Interface</li>
              <li><strong>AuthContext.test.tsx:</strong> Authentication State</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`,
            borderLeft: `6px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>🔗 API Tests</h4>
            <ul>
              <li><strong>auth.test.ts:</strong> Login/Register/OAuth Flows</li>
              <li><strong>games.test.ts:</strong> Game CRUD Operations</li>
              <li><strong>cart.test.ts:</strong> Cart Management</li>
              <li><strong>orders.test.ts:</strong> Order Processing</li>
              <li><strong>chat.test.ts:</strong> AI Chat Endpoints</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`,
            borderLeft: `6px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>🎭 User Journey Tests</h4>
            <ul>
              <li><strong>Registration Flow:</strong> Vollständige Nutzer-Registrierung</li>
              <li><strong>Purchase Flow:</strong> Spiel suchen → kaufen → Download</li>
              <li><strong>Review Flow:</strong> Spiel bewerten und kommentieren</li>
              <li><strong>Chat Flow:</strong> KI-Empfehlungen erhalten</li>
              <li><strong>Admin Flow:</strong> Admin-Dashboard Funktionen</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📈 Performance Tests</h2>
        
        <h3>⚡ Load Testing</h3>
        <div className="code-block">
          <pre><code>{`# K6 Load Test Beispiel
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function() {
  let response = http.get('https://api.gamecompass.de/v1/games');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}`}</code></pre>
        </div>

        <h3>📊 Performance Metriken</h3>
        <ul>
          <li><strong>API Response Time:</strong> &lt; 200ms (95th percentile)</li>
          <li><strong>Page Load Time:</strong> &lt; 2s (First Contentful Paint)</li>
          <li><strong>Bundle Size:</strong> &lt; 500KB (gzipped)</li>
          <li><strong>Database Queries:</strong> &lt; 50ms (average)</li>
          <li><strong>Memory Usage:</strong> &lt; 512MB (backend)</li>
        </ul>
      </div>

      <div className="section">
        <h2>🐛 Bug Reports & Fixes</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #22c55e`
          }}>
            <strong style={{ color: '#22c55e' }}>✅ Fixed:</strong> Chat-Session Persistence nach Page-Reload
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #22c55e`
          }}>
            <strong style={{ color: '#22c55e' }}>✅ Fixed:</strong> Stripe-Payment Race Conditions
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #fb923c`
          }}>
            <strong style={{ color: '#fb923c' }}>⚠️ In Progress:</strong> Mobile Layout Optimierung
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #ef4444`
          }}>
            <strong style={{ color: '#ef4444' }}>🔍 Investigating:</strong> ChromaDB Memory Leaks bei Heavy Load
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🔍 Quality Gates</h2>
        
        <h3>📋 Definition of Done</h3>
        <ul>
          <li>✅ Unit Tests geschrieben und bestanden (&gt; 90% Coverage)</li>
          <li>✅ Integration Tests erfolgreich</li>
          <li>✅ Code Review abgeschlossen</li>
          <li>✅ ESLint/Prettier ohne Warnings</li>
          <li>✅ TypeScript Compilation erfolgreich</li>
          <li>✅ Performance-Budget eingehalten</li>
          <li>✅ Accessibility-Standards erfüllt</li>
          <li>✅ Security Scan bestanden</li>
        </ul>

        <h3>🚫 Breaking Changes Policy</h3>
        <ul>
          <li><strong>API Changes:</strong> Versionierung mit Deprecation-Warnings</li>
          <li><strong>Database Schema:</strong> Migrations mit Rollback-Plan</li>
          <li><strong>Frontend Components:</strong> Backwards-Compatibility für 2 Versionen</li>
          <li><strong>Dependencies:</strong> Major Updates nur nach ausführlichem Testing</li>
        </ul>
      </div>

      <div className="section">
        <h2>📊 Test Automation</h2>
        
        <h3>🤖 Automated Testing Pipeline</h3>
        <div className="code-block">
          <pre><code>{`# Package.json Scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:load": "k6 run load-test.js",
    "test:security": "npm audit && snyk test"
  }
}`}</code></pre>
        </div>

        <h3>📈 Monitoring & Alerts</h3>
        <ul>
          <li><strong>Test Failures:</strong> Slack-Benachrichtigungen bei fehlgeschlagenen Tests</li>
          <li><strong>Coverage Drops:</strong> Alert bei Coverage unter 85%</li>
          <li><strong>Performance Regression:</strong> Alert bei &gt; 10% Verschlechterung</li>
          <li><strong>Security Vulnerabilities:</strong> Daily Security Scans</li>
        </ul>
      </div>

      <div className="section">
        <h2>🎯 Test Strategy</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>🏗️ Testing Pyramid</h4>
            <ul>
              <li><strong>70% Unit Tests:</strong> Fast, isolated</li>
              <li><strong>20% Integration:</strong> API & DB</li>
              <li><strong>10% E2E:</strong> Critical user paths</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>🔄 Continuous Testing</h4>
            <ul>
              <li><strong>Pre-commit:</strong> Unit tests</li>
              <li><strong>PR:</strong> Full test suite</li>
              <li><strong>Deploy:</strong> E2E & smoke tests</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>📊 Test Data</h4>
            <ul>
              <li><strong>Fixtures:</strong> Consistent test data</li>
              <li><strong>Factories:</strong> Dynamic test objects</li>
              <li><strong>Mocks:</strong> External API simulation</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}; 