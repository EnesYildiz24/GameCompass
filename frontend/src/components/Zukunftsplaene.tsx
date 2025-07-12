import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const Zukunftsplaene: React.FC = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('design');

  return (
    <div className="service-detail-container">
      <h1><span>🚀</span> <span className="gradient-text">Zukunftspläne & Vision</span></h1>
      <p className="subtitle">Roadmap für die Weiterentwicklung von GameCompass - Was wir als nächstes umsetzen würden</p>
      
      <div className="section">
        <h2>🎯 Kurzfristige Ziele (3-6 Monate)</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['design', 'payment', 'mobile', 'social'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: activeCategory === category 
                  ? (theme === 'dark' ? '#f19115' : '#5c8791')
                  : (theme === 'dark' ? '#3a3b42' : '#f5f5f5'),
                color: activeCategory === category 
                  ? '#ffffff' 
                  : (theme === 'dark' ? '#e0dfe5' : '#333333'),
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {category === 'design' && '🎨 Design'}
              {category === 'payment' && '💰 Payment'}
              {category === 'mobile' && '📱 Mobile'}
              {category === 'social' && '👥 Social'}
            </button>
          ))}
        </div>

        {activeCategory === 'design' && (
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(139, 69, 19, 0.1)' : 'rgba(139, 69, 19, 0.1)',
            borderRadius: '12px',
            border: `2px solid #8b4513`,
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: '#8b4513', marginTop: 0 }}>🎨 UI/UX Redesign</h3>
            <ul>
              <li><strong>Moderne Card-based Layouts:</strong> Inspiration von Steam & Epic Games Store</li>
              <li><strong>Advanced Animations:</strong> Framer Motion für flüssige Übergänge</li>
              <li><strong>Responsive Grid System:</strong> CSS Grid + Flexbox Optimierung</li>
              <li><strong>Dark/Light Mode Enhancement:</strong> Automatische Theme-Erkennung</li>
              <li><strong>Game Cover Visualisierung:</strong> 3D-Card-Flip-Effekte</li>
              <li><strong>Advanced Search UI:</strong> Instant-Search mit Autocomplete</li>
            </ul>
            <div className="code-block">
              <pre><code>{`// Beispiel: Moderne Game Card
const GameCard = () => (
  <motion.div
    whileHover={{ scale: 1.05, rotateY: 5 }}
    className="game-card-3d"
  >
    <div className="card-image-container">
      <img src={game.background_image} />
      <div className="hover-overlay">
        <PlayButton />
        <WishlistButton />
      </div>
    </div>
  </motion.div>
);`}</code></pre>
            </div>
          </div>
        )}

        {activeCategory === 'payment' && (
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 215, 0, 0.1)',
            borderRadius: '12px',
            border: `2px solid #ffd700`,
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: '#ffd700', marginTop: 0 }}>💰 Krypto-Zahlungen</h3>
            <ul>
              <li><strong>Bitcoin (BTC) Integration:</strong> Lightning Network für schnelle Transaktionen</li>
              <li><strong>Ethereum (ETH) Support:</strong> Smart Contracts für automatische Escrow</li>
              <li><strong>Stablecoins (USDC, USDT):</strong> Preisstabilität für Nutzer</li>
              <li><strong>Web3 Wallet Connection:</strong> MetaMask, WalletConnect Integration</li>
              <li><strong>NFT Game Keys:</strong> Blockchain-basierte Ownership-Nachweise</li>
              <li><strong>DeFi Integration:</strong> Yield-Farming für GameCompass Tokens</li>
            </ul>
            <div className="code-block">
              <pre><code>{`// Web3 Payment Integration
import { ethers } from 'ethers';

const processWeb3Payment = async (gameId, price) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const gameMarketContract = new ethers.Contract(
    GAME_MARKET_ADDRESS,
    GameMarketABI,
    signer
  );
  
  const transaction = await gameMarketContract.purchaseGame(
    gameId,
    { value: ethers.utils.parseEther(price) }
  );
  
  return transaction.wait();
};`}</code></pre>
            </div>
          </div>
        )}

        {activeCategory === 'mobile' && (
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #22c55e`,
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: '#22c55e', marginTop: 0 }}>📱 Mobile-First Experience</h3>
            <ul>
              <li><strong>Progressive Web App (PWA):</strong> Installierbar auf allen Geräten</li>
              <li><strong>React Native App:</strong> Native iOS/Android Performance</li>
              <li><strong>Offline-First Architecture:</strong> Service Workers für Caching</li>
              <li><strong>Push Notifications:</strong> Game-Deals & Wishlist-Updates</li>
              <li><strong>Mobile-optimierte Navigation:</strong> Bottom Tab Bar</li>
              <li><strong>Touch-Gestures:</strong> Swipe-to-browse, Pull-to-refresh</li>
            </ul>
            <div className="code-block">
              <pre><code>{`// PWA Service Worker
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/games')) {
    event.respondWith(
      caches.open('games-cache').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchRes => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        });
      })
    );
  }
});`}</code></pre>
            </div>
          </div>
        )}

        {activeCategory === 'social' && (
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: `2px solid #a855f7`,
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: '#a855f7', marginTop: 0 }}>👥 Social Gaming Features</h3>
            <ul>
              <li><strong>Friend System:</strong> Freunde hinzufügen & Aktivitäten verfolgen</li>
              <li><strong>Game Libraries Sharing:</strong> Öffentliche Profile mit Spiele-Sammlungen</li>
              <li><strong>Community Reviews:</strong> Upvote/Downvote System für Bewertungen</li>
              <li><strong>Game Clubs:</strong> Communities für spezifische Spiele/Genres</li>
              <li><strong>Streaming Integration:</strong> Twitch/YouTube Live-Status</li>
              <li><strong>Achievement System:</strong> Gamification für Platform-Nutzung</li>
            </ul>
          </div>
        )}
      </div>

      <div className="section">
        <h2>🌟 Mittelfristige Visionen (6-12 Monate)</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          
          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            borderRadius: '12px',
            border: `2px solid #f43f5e`
          }}>
            <h4 style={{ color: '#f43f5e', marginTop: 0 }}>🤖 AI-Enhanced Features</h4>
            <ul>
              <li><strong>Personalisierte Empfehlungen:</strong> ML-basiert auf Spielverhalten</li>
              <li><strong>AI-Generated Reviews:</strong> Automatische Zusammenfassungen</li>
              <li><strong>Smart Price Alerts:</strong> Predictive Pricing für beste Deals</li>
              <li><strong>Voice Commerce:</strong> "Hey GameCompass, finde mir RPGs unter 20€"</li>
              <li><strong>Visual Game Search:</strong> Screenshot → Ähnliche Spiele finden</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
            border: `2px solid #06b6d4`
          }}>
            <h4 style={{ color: '#06b6d4', marginTop: 0 }}>🎮 Gaming Integration</h4>
            <ul>
              <li><strong>Steam Library Sync:</strong> Automatischer Import bestehender Spiele</li>
              <li><strong>Cloud Save Integration:</strong> Cross-Platform Save-Game-Sync</li>
              <li><strong>In-Game Overlay:</strong> GameCompass Widget in Spielen</li>
              <li><strong>Achievement Tracking:</strong> Plattform-übergreifende Erfolge</li>
              <li><strong>Remote Play Sharing:</strong> Spiele-Sessions mit Freunden teilen</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            border: `2px solid #fb923c`
          }}>
            <h4 style={{ color: '#fb923c', marginTop: 0 }}>🌍 Globalisierung</h4>
            <ul>
              <li><strong>Multi-Language Support:</strong> 15+ Sprachen mit KI-Übersetzung</li>
              <li><strong>Regionale Pricing:</strong> Kaufkraft-angepasste Preise</li>
              <li><strong>Local Payment Methods:</strong> Regional bevorzugte Zahlungsarten</li>
              <li><strong>Cultural Game Curation:</strong> Kulturell relevante Empfehlungen</li>
              <li><strong>Time Zone Aware Features:</strong> Regionale Release-Zeiten</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="section">
        <h2>🚀 Langfristige Innovation (1-2 Jahre)</h2>
        
        <h3>🥽 VR/AR Integration</h3>
        <ul>
          <li><strong>VR Game Previews:</strong> 360° Spiel-Environments erkunden</li>
          <li><strong>AR Game Discovery:</strong> QR-Codes scannen für Instant-Demos</li>
          <li><strong>Virtual Game Store:</strong> VR-Shopping-Experience</li>
          <li><strong>Mixed Reality Reviews:</strong> Holographische Game-Präsentationen</li>
        </ul>

        <h3>🔗 Blockchain & Web3</h3>
        <ul>
          <li><strong>NFT Game Licenses:</strong> Wirkliches Eigentum an digitalen Spielen</li>
          <li><strong>Decentralized Reviews:</strong> Tamper-proof Bewertungssystem</li>
          <li><strong>Gaming DAO:</strong> Community-gesteuerte Platform-Entscheidungen</li>
          <li><strong>Cross-Platform Asset Trading:</strong> Skin/Item-Handel zwischen Spielen</li>
        </ul>

        <h3>🧠 Advanced AI</h3>
        <ul>
          <li><strong>Game Creation AI:</strong> Automatische Indie-Game-Generierung</li>
          <li><strong>Predictive Gaming:</strong> Nächste Gaming-Trends vorhersagen</li>
          <li><strong>Emotional Game Matching:</strong> Spiele basierend auf Stimmung</li>
          <li><strong>AI Gaming Assistant:</strong> Permanent verfügbarer Gaming-Berater</li>
        </ul>
      </div>

      <div className="section">
        <h2>💡 Innovative Features (aus Codebase-Analyse)</h2>
        
        <div className="code-block">
          <pre><code>{`// Erkannte Potentiale aus der bestehenden Codebase:

1. 🤖 Erweiterte KI-Features:
   - Das ChromaDB + Ollama System ist bereits sehr fortgeschritten
   - Könnte erweitert werden für Gameplay-Vorhersagen
   - Sentiment-Analyse von Reviews für bessere Empfehlungen

2. 🎵 Audio-System Ausbau:
   - AudioChat ist bereits implementiert
   - Potential für Podcast-Style Game-Reviews
   - Voice-controlled Shopping-Experience

3. 💳 Payment-System Evolution:
   - Stripe ist solide implementiert
   - Subscription-Models für Game-Pass-Style Services
   - Buy-now-pay-later Gaming

4. 🔐 Advanced Authentication:
   - OAuth-System ist sehr flexibel aufgebaut
   - Gaming-Platform-logins (Steam, Epic, GOG)
   - Biometric Authentication

5. 📊 Analytics & Insights:
   - Bewertungssystem kann erweitert werden
   - Gaming-Pattern-Analyse
   - Predictive Analytics für Game-Erfolg`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>🎯 Implementierungs-Prioritäten</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #22c55e`
          }}>
            <strong style={{ color: '#22c55e' }}>Hoch Priorität:</strong> UI/UX Redesign, Mobile PWA, Krypto-Payment
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #fb923c`
          }}>
            <strong style={{ color: '#fb923c' }}>Mittel Priorität:</strong> Social Features, AI-Enhancement, Gaming-Integration
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            borderLeft: `4px solid #ef4444`
          }}>
            <strong style={{ color: '#ef4444' }}>Niedrig Priorität:</strong> VR/AR, Advanced Blockchain, AI Game Creation
          </div>

        </div>
      </div>

      <div className="section">
        <h2>📈 Business Model Evolution</h2>
        <ul>
          <li><strong>Premium Subscriptions:</strong> Erweiterte Features & Early Access</li>
          <li><strong>Creator Economy:</strong> Revenue-Sharing mit Game-Reviewern</li>
          <li><strong>B2B Services:</strong> White-Label Gaming-Platform für Unternehmen</li>
          <li><strong>Data Insights:</strong> Gaming-Trends für Publishers verkaufen</li>
          <li><strong>Game Development Fund:</strong> Investitionen in visionäre Indie-Games</li>
        </ul>
      </div>
    </div>
  );
}; 