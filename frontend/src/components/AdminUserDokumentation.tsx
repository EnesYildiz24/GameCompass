import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AdminUserDokumentation: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>👥</span> <span className="gradient-text">Admin & User Dokumentation</span></h1>
      <p className="subtitle">Benutzerrollen, Berechtigungen und Verwaltungsfunktionen in GameCompass</p>
      
      <div className="section">
        <h2>🔐 Benutzerrollen</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h3 style={{ color: '#22c55e', marginTop: 0 }}>👤 Standard User</h3>
            <p><strong>Basis-Berechtigungen für normale Nutzer</strong></p>
            <ul>
              <li>✅ Spiele suchen und durchstöbern</li>
              <li>✅ Spiele kaufen und herunterladen</li>
              <li>✅ Bewertungen schreiben und lesen</li>
              <li>✅ Warenkorb und Wishlist verwalten</li>
              <li>✅ KI-Chat nutzen</li>
              <li>✅ Profil bearbeiten</li>
              <li>❌ Admin-Funktionen</li>
              <li>❌ Andere User verwalten</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h3 style={{ color: '#3b82f6', marginTop: 0 }}>🛍️ Buyer (erweitert)</h3>
            <p><strong>User mit erweiterten Kauf-Features</strong></p>
            <ul>
              <li>✅ Alle Standard-User-Berechtigungen</li>
              <li>✅ Erweiterte Zahlungsmethoden</li>
              <li>✅ Versandadressen verwalten</li>
              <li>✅ Bestellhistorie erweitert</li>
              <li>✅ Bulk-Käufe für Unternehmen</li>
              <li>✅ Priority-Support</li>
            </ul>
            <div className="code-block">
              <pre><code>{`// Buyer Model Extension
interface Buyer extends User {
  shippingAddress: Address[];
  paymentMethods: PaymentMethod[];
  preferences: BuyerPreferences;
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ef4444`
          }}>
            <h3 style={{ color: '#ef4444', marginTop: 0 }}>👨‍💼 Admin</h3>
            <p><strong>Vollzugriff auf alle System-Funktionen</strong></p>
            <ul>
              <li>✅ User-Management (erstellen, bearbeiten, löschen)</li>
              <li>✅ Spiele-Datenbank verwalten</li>
              <li>✅ Bestellungen verwalten</li>
              <li>✅ Reviews moderieren</li>
              <li>✅ System-Analytics einsehen</li>
              <li>✅ KI-System konfigurieren</li>
              <li>✅ Payment-Settings</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>⚙️ Admin-Funktionen</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>👥 User Management</h4>
            <ul>
              <li>User-Konten einsehen und bearbeiten</li>
              <li>Benutzer sperren/entsperren</li>
              <li>Rollen zuweisen</li>
              <li>Aktivitäts-Logs anzeigen</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`
          }}>
            <h4 style={{ color: '#fb923c', marginTop: 0 }}>🎮 Game Management</h4>
            <ul>
              <li>Neue Spiele hinzufügen</li>
              <li>Spiel-Informationen bearbeiten</li>
              <li>Preise und Angebote verwalten</li>
              <li>Inventory-Management</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>📊 Analytics</h4>
            <ul>
              <li>Verkaufs-Statistiken</li>
              <li>User-Behavior Analysis</li>
              <li>Performance Monitoring</li>
              <li>Revenue Reports</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ef4444`
          }}>
            <h4 style={{ color: '#ef4444', marginTop: 0 }}>🛡️ Security</h4>
            <ul>
              <li>Security-Logs überwachen</li>
              <li>Failed-Login-Attempts</li>
              <li>Payment-Security</li>
              <li>Data-Breach-Monitoring</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🔑 Berechtigungs-System</h2>
        
        <h3>📋 Granulare Permissions</h3>
        <div className="code-block">
          <pre><code>{`// Permission-based Access Control
const permissions = {
  // User Management
  'user:read': ['admin'],
  'user:update': ['admin'],
  'user:delete': ['admin'],
  
  // Game Management  
  'game:create': ['admin'],
  'game:update': ['admin'],
  'game:delete': ['admin'],
  
  // Order Management
  'order:read': ['admin', 'buyer'],
  'order:cancel': ['admin'],
  'order:refund': ['admin'],
  
  // Review Management
  'review:moderate': ['admin'],
  'review:delete': ['admin'],
  
  // Analytics
  'analytics:view': ['admin'],
  'analytics:export': ['admin']
};`}</code></pre>
        </div>

        <h3>🛠️ Admin-Tools</h3>
        <ul>
          <li><strong>Dashboard:</strong> Übersicht über alle wichtigen Metriken</li>
          <li><strong>User-Search:</strong> Erweiterte Nutzer-Suche mit Filtern</li>
          <li><strong>Bulk-Actions:</strong> Massenoperationen für Effizienz</li>
          <li><strong>Audit-Log:</strong> Vollständige Aktivitäts-Protokolle</li>
          <li><strong>System-Health:</strong> Server-Performance monitoring</li>
        </ul>
      </div>

      <div className="section">
        <h2>📱 User Experience Features</h2>
        
        <h3>🔔 Benachrichtigungen</h3>
        <ul>
          <li><strong>Email-Alerts:</strong> Wichtige Account-Updates</li>
          <li><strong>Deal-Notifications:</strong> Wishlist-Preis-Alerts</li>
          <li><strong>Security-Alerts:</strong> Verdächtige Login-Versuche</li>
          <li><strong>Order-Updates:</strong> Bestellstatus-Änderungen</li>
        </ul>

        <h3>📊 Personal Dashboard</h3>
        <ul>
          <li><strong>Gaming-Statistics:</strong> Persönliche Spiel-Statistiken</li>
          <li><strong>Spending-Analysis:</strong> Ausgaben-Übersicht</li>
          <li><strong>Recommendation-Engine:</strong> Personalisierte Vorschläge</li>
          <li><strong>Social-Feed:</strong> Aktivitäten von Freunden</li>
        </ul>
      </div>

      <div className="section">
        <h2>🔐 Sicherheits-Features</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>🔑 Authentication</h4>
            <ul>
              <li>Multi-Factor Authentication (MFA)</li>
              <li>OAuth Integration (Google, Facebook)</li>
              <li>JWT Token Management</li>
              <li>Session-Timeout Handling</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>🛡️ Data Protection</h4>
            <ul>
              <li>GDPR-Compliance</li>
              <li>Data-Encryption at Rest</li>
              <li>Secure API Endpoints</li>
              <li>Regular Security Audits</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>💳 Payment Security</h4>
            <ul>
              <li>PCI-DSS Compliance</li>
              <li>Stripe-Secure-Processing</li>
              <li>Fraud-Detection</li>
              <li>Secure-Checkout-Flow</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📋 Admin Workflows</h2>
        
        <h3>🆕 Neuen User anlegen</h3>
        <ol>
          <li>Admin-Dashboard öffnen</li>
          <li>User-Management → "Neuer User"</li>
          <li>Grunddaten eingeben (Email, Name, Rolle)</li>
          <li>Berechtigungen zuweisen</li>
          <li>Welcome-Email automatisch senden</li>
        </ol>

        <h3>🎮 Spiel hinzufügen</h3>
        <ol>
          <li>Game-Management → "Neues Spiel"</li>
          <li>RAWG-API Sync nutzen oder manuell eingeben</li>
          <li>Preise und Verfügbarkeit setzen</li>
          <li>Screenshots und Beschreibung hinzufügen</li>
          <li>KI-System mit neuen Daten synchronisieren</li>
        </ol>

        <h3>📊 Reports generieren</h3>
        <ol>
          <li>Analytics-Dashboard öffnen</li>
          <li>Zeitraum und Filter auswählen</li>
          <li>Report-Typ wählen (Sales, Users, Performance)</li>
          <li>Export-Format wählen (PDF, Excel, CSV)</li>
          <li>Report herunterladen oder per Email senden</li>
        </ol>
      </div>

      <div className="section">
        <h2>🚨 Notfall-Szenarien</h2>
        
        <h3>🔒 Kompromittierter Account</h3>
        <ul>
          <li><strong>Sofort-Maßnahmen:</strong> Account sperren, Sessions invalidieren</li>
          <li><strong>Investigation:</strong> Login-Logs prüfen, verdächtige Aktivitäten</li>
          <li><strong>Recovery:</strong> Passwort-Reset, MFA aktivieren</li>
          <li><strong>Communication:</strong> User informieren, Security-Bericht</li>
        </ul>

        <h3>💳 Payment-Issues</h3>
        <ul>
          <li><strong>Fehlgeschlagene Zahlung:</strong> Stripe-Logs prüfen, Retry-Logic</li>
          <li><strong>Chargebacks:</strong> Dokumentation sammeln, Dispute handling</li>
          <li><strong>Fraud-Detection:</strong> Verdächtige Transaktionen flaggen</li>
          <li><strong>Refunds:</strong> Automated refund process über Stripe</li>
        </ul>
      </div>

      <div className="section">
        <h2>📈 Performance Monitoring</h2>
        
        <div className="code-block">
          <pre><code>{`// Key Metrics für Admin-Dashboard
const adminMetrics = {
  // User Metrics
  totalUsers: 15420,
  activeUsers: 8930,
  newUsersToday: 45,
  
  // Sales Metrics  
  totalRevenue: 125430.50,
  salesToday: 2340.80,
  avgOrderValue: 28.50,
  
  // System Health
  serverUptime: 99.8,
  responseTime: 120, // ms
  errorRate: 0.02,
  
  // AI System
  chatRequests: 3420,
  searchQueries: 8930,
  recommendationClicks: 1250
};`}</code></pre>
        </div>
      </div>
    </div>
  );
}; 