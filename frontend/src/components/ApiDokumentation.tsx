import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ApiDokumentation: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>📊</span> <span className="gradient-text">API Dokumentation</span></h1>
      <p className="subtitle">REST API Endpunkte, Authentifizierung und Datenformate für GameCompass</p>
      
      <div className="section">
        <h2>🌐 API Übersicht</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>🔗 Base URL</h4>
            <div className="code-block">
              <pre><code>https://api.gamecompass.de/v1</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>📋 Content-Type</h4>
            <div className="code-block">
              <pre><code>application/json</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>🔐 Authentication</h4>
            <div className="code-block">
              <pre><code>Bearer {'{'} token {'}'}</code></pre>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🔐 Authentication Endpoints</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`,
            borderLeft: `6px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>POST /auth/register</h4>
            <p><strong>Beschreibung:</strong> Neuen Benutzer registrieren</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}`}</code></pre>
            </div>

            <h5>Response (201):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "user": {
    "id": "64a...",
    "username": "gamer123",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`,
            borderLeft: `6px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>POST /auth/login</h4>
            <p><strong>Beschreibung:</strong> Benutzer anmelden</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "email": "user@example.com",
  "password": "securepassword"
}`}</code></pre>
            </div>

            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "user": {
    "id": "64a...",
    "username": "gamer123",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "24h"
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`,
            borderLeft: `6px solid #fb923c`
          }}>
            <h4 style={{ color: '#fb923c', marginTop: 0 }}>POST /auth/google</h4>
            <p><strong>Beschreibung:</strong> Google OAuth Login</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "tokenId": "google_jwt_token_here"
}`}</code></pre>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🎮 Games Endpoints</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`,
            borderLeft: `6px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>GET /games</h4>
            <p><strong>Beschreibung:</strong> Alle Spiele abrufen mit Filteroptionen</p>
            
            <h5>Query Parameters:</h5>
            <div className="code-block">
              <pre><code>?page=1&limit=20&genre=action&minPrice=10&maxPrice=50</code></pre>
            </div>

            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "games": [
      {
        "id": "64a...",
        "name": "Cyber Quest",
        "price": 29.99,
        "rating": 4.8,
        "genres": ["Action", "RPG"],
        "background_image": "https://...",
        "released": "2024-01-15"
      }
    ],
    "pagination": {
      "page": 1,
      "totalPages": 25,
      "totalItems": 500
    }
  }
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`,
            borderLeft: `6px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>GET /games/:id</h4>
            <p><strong>Beschreibung:</strong> Einzelnes Spiel mit Details abrufen</p>
            
            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "id": "64a...",
    "name": "Cyber Quest",
    "description": "Ein episches Sci-Fi RPG...",
    "price": 29.99,
    "rating": 4.8,
    "genres": ["Action", "RPG"],
    "platforms": ["PC", "PlayStation", "Xbox"],
    "screenshots": [
      "https://example.com/screenshot1.jpg"
    ],
    "developer": "Studio XYZ",
    "released": "2024-01-15",
    "system_requirements": {
      "minimum": {
        "os": "Windows 10",
        "processor": "Intel i5-8400",
        "memory": "8 GB RAM"
      }
    }
  }
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`,
            borderLeft: `6px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>POST /games/search</h4>
            <p><strong>Beschreibung:</strong> KI-gestützte Spielsuche</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "query": "Finde mir RPGs wie Skyrim",
  "limit": 10,
  "includeMetadata": true
}`}</code></pre>
            </div>

            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "results": [
      {
        "game": { /* game object */ },
        "relevanceScore": 0.92,
        "reasoning": "Ähnliches Open-World RPG Setting..."
      }
    ],
    "searchTime": "145ms"
  }
}`}</code></pre>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🛒 Cart & Orders Endpoints</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`,
            borderLeft: `6px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>GET /cart</h4>
            <p><strong>Beschreibung:</strong> Warenkorb des Users abrufen</p>
            <p><strong>Auth:</strong> Required</p>
            
            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "items": [
      {
        "gameId": "64a...",
        "game": { /* game object */ },
        "quantity": 1,
        "price": 29.99
      }
    ],
    "totalPrice": 59.98,
    "totalItems": 2
  }
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`,
            borderLeft: `6px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>POST /cart/items</h4>
            <p><strong>Beschreibung:</strong> Spiel zum Warenkorb hinzufügen</p>
            <p><strong>Auth:</strong> Required</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "gameId": "64a...",
  "quantity": 1
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ef4444`,
            borderLeft: `6px solid #ef4444`
          }}>
            <h4 style={{ color: '#ef4444', marginTop: 0 }}>POST /orders</h4>
            <p><strong>Beschreibung:</strong> Neue Bestellung erstellen</p>
            <p><strong>Auth:</strong> Required</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "items": [
    {
      "gameId": "64a...",
      "quantity": 1,
      "price": 29.99
    }
  ],
  "paymentMethod": "stripe",
  "shippingAddress": {
    "street": "Musterstraße 123",
    "city": "Berlin",
    "zipCode": "10115",
    "country": "DE"
  }
}`}</code></pre>
            </div>

            <h5>Response (201):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "orderId": "64a...",
    "status": "offen",
    "totalPrice": 29.99,
    "stripeSessionUrl": "https://checkout.stripe.com/...",
    "paymentIntentId": "pi_..."
  }
}`}</code></pre>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>⭐ Reviews Endpoints</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`,
            borderLeft: `6px solid #22c55e`
          }}>
            <h4 style={{ color: '#22c55e', marginTop: 0 }}>GET /games/:id/reviews</h4>
            <p><strong>Beschreibung:</strong> Bewertungen für ein Spiel abrufen</p>
            
            <h5>Query Parameters:</h5>
            <div className="code-block">
              <pre><code>?page=1&limit=10&sort=newest&minStars=4</code></pre>
            </div>

            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "64a...",
        "userId": "64a...",
        "username": "gamer123",
        "stars": 5,
        "comment": "Fantastisches Spiel!",
        "writtenAt": "2024-01-15T10:30:00Z",
        "helpful": 42
      }
    ],
    "averageRating": 4.2,
    "totalReviews": 1247
  }
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: `2px solid #3b82f6`,
            borderLeft: `6px solid #3b82f6`
          }}>
            <h4 style={{ color: '#3b82f6', marginTop: 0 }}>POST /reviews</h4>
            <p><strong>Beschreibung:</strong> Neue Bewertung erstellen</p>
            <p><strong>Auth:</strong> Required</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "gameId": "64a...",
  "stars": 5,
  "comment": "Absolut empfehlenswert! Tolle Grafik und Story."
}`}</code></pre>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🤖 AI Chat Endpoints</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`,
            borderLeft: `6px solid #a855f7`
          }}>
            <h4 style={{ color: '#a855f7', marginTop: 0 }}>POST /chat</h4>
            <p><strong>Beschreibung:</strong> KI-Chat Nachricht senden</p>
            <p><strong>Auth:</strong> Optional (bessere Personalisierung wenn eingeloggt)</p>
            
            <h5>Request Body:</h5>
            <div className="code-block">
              <pre><code>{`{
  "message": "Empfiehl mir ein gutes Indie-RPG",
  "sessionId": "uuid-session-id", // optional
  "context": {
    "previousGames": ["64a...", "64b..."], // optional
    "preferredGenres": ["RPG", "Indie"] // optional
  }
}`}</code></pre>
            </div>

            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "response": "Ich empfehle dir 'Disco Elysium'! Es ist ein...",
    "recommendations": [
      {
        "gameId": "64a...",
        "game": { /* game object */ },
        "reasoning": "Passt zu deinen Indie-RPG Präferenzen"
      }
    ],
    "sessionId": "uuid-session-id"
  }
}`}</code></pre>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`,
            borderLeft: `6px solid #fb923c`
          }}>
            <h4 style={{ color: '#fb923c', marginTop: 0 }}>GET /chat/history/:sessionId</h4>
            <p><strong>Beschreibung:</strong> Chat-Verlauf abrufen</p>
            <p><strong>Auth:</strong> Required</p>
            
            <h5>Response (200):</h5>
            <div className="code-block">
              <pre><code>{`{
  "success": true,
  "data": {
    "messages": [
      {
        "type": "user",
        "content": "Empfiehl mir ein RPG",
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "type": "assistant",
        "content": "Ich empfehle...",
        "timestamp": "2024-01-15T10:30:05Z"
      }
    ],
    "sessionInfo": {
      "startedAt": "2024-01-15T10:30:00Z",
      "messageCount": 12
    }
  }
}`}</code></pre>
            </div>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📋 Standard Response Codes</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          
          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #22c55e`
          }}>
            <strong style={{ color: '#22c55e' }}>200 OK:</strong> Erfolgreich
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #3b82f6`
          }}>
            <strong style={{ color: '#3b82f6' }}>201 Created:</strong> Ressource erstellt
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #fb923c`
          }}>
            <strong style={{ color: '#fb923c' }}>400 Bad Request:</strong> Ungültige Anfrage
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #ef4444`
          }}>
            <strong style={{ color: '#ef4444' }}>401 Unauthorized:</strong> Authentifizierung erforderlich
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #a855f7`
          }}>
            <strong style={{ color: '#a855f7' }}>404 Not Found:</strong> Ressource nicht gefunden
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #ef4444`
          }}>
            <strong style={{ color: '#ef4444' }}>500 Server Error:</strong> Interner Serverfehler
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🔧 Development Tools</h2>
        
        <h3>🧪 Testing</h3>
        <div className="code-block">
          <pre><code>{`# cURL Beispiel
curl -X GET "https://api.gamecompass.de/v1/games" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"

# JavaScript Fetch
const response = await fetch('/api/games', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});`}</code></pre>
        </div>

        <h3>📊 Rate Limiting</h3>
        <ul>
          <li><strong>Authenticated Users:</strong> 1000 requests/hour</li>
          <li><strong>Anonymous Users:</strong> 100 requests/hour</li>
          <li><strong>AI Chat:</strong> 50 requests/hour</li>
          <li><strong>Headers:</strong> X-RateLimit-Remaining, X-RateLimit-Reset</li>
        </ul>

        <h3>🔍 Postman Collection</h3>
        <p>Eine vollständige Postman-Collection mit allen Endpunkten und Beispielen ist verfügbar:</p>
        <div className="code-block">
          <pre><code>https://api.gamecompass.de/postman/collection.json</code></pre>
        </div>
      </div>
    </div>
  );
}; 