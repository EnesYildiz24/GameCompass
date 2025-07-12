import { useState, useRef, useEffect } from 'react';
import '../styles/WelcomePopup.css';

interface WelcomePopupProps {
  username: string;
  onClose: () => void;
  onSkillSelect: (level: 'beginner' | 'advanced') => void;
  skillLevel: 'beginner' | 'advanced' | null;
}

interface Game {
  name: string;
  rating: number;
  background_image?: string;
  price?: number;
  genres?: { name: string }[];
}

export function WelcomePopup({ username, onClose, onSkillSelect, skillLevel }: WelcomePopupProps) {
  const [showChat, setShowChat] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameRecommendations, setGameRecommendations] = useState<Game[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatisches Scrollen zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatMessages, showChat]);

  // Neue Funktion für Spiel-Navigation in neuem Tab
  const handleGameClick = async (gameName: string) => {
    try {
      // Suche nach Offers für dieses Spiel
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/offers`);
      const offers = await response.json();

      // Finde Offer für dieses Spiel
      const gameOffer = offers.find(
        (offer: any) => offer.game?.name?.toLowerCase() === gameName.toLowerCase()
      );

      if (gameOffer) {
        // Öffne in neuem Tab - Popup bleibt offen
        window.open(`/offer/${gameOffer._id}`, '_blank');
      } else {
        console.log('Kein Offer für dieses Spiel gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Offers:', error);
    }
  };

  const handleSkillSelect = async (level: 'beginner' | 'advanced') => {
    if (level === 'advanced') {
      onSkillSelect(level);
      onClose();
    } else {
      onSkillSelect(level);
      setShowChat(true);
      try {
        console.log('Fetching initial prompt...');
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER_URL}/api/chatpopup/prompt/initial`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Initial prompt data:', data);
        setCurrentPrompt(data);
        setChatMessages([{ role: 'assistant', content: data.question }]);
      } catch (error) {
        console.error('Fehler beim Laden des initialen Prompts:', error);
        setChatMessages([
          {
            role: 'assistant',
            content: 'Entschuldigung, es gab einen Fehler beim Starten des Chats.',
          },
        ]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessages = [...chatMessages, { role: 'user', content: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to API...');
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER_URL}/api/chatpopup/interact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userInput,
            currentPrompt,
            sessionId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Spiele separat speichern und anzeigen
      if (data.games) {
        setGameRecommendations(data.games);
        setChatMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `${data.aiResponse}\n\n🎮 Ich habe ${data.games.length} Spiele für dich gefunden! Schau sie dir im Empfehlungsfenster an.`,
          },
        ]);
      } else {
        setChatMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: data.aiResponse,
          },
        ]);
      }

      if (data.nextPrompt) {
        setCurrentPrompt(data.nextPrompt);
      }
    } catch (error) {
      console.error('Fehler bei der Chat-Verarbeitung:', error);
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung deiner Nachricht.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="popup-content">
          <div className="left-content">
            {!showChat ? (
              <>
                <div className="welcome-text">
                  <h2>Willkommen{username ? `, ${username}` : ''}!</h2>
                  <p>Wie schätzt du deine Spielerfahrung ein?</p>
                </div>

                <div className="skill-buttons">
                  <button
                    className={`skill-button ${skillLevel === 'beginner' ? 'selected' : ''}`}
                    onClick={() => handleSkillSelect('beginner')}
                  >
                    Anfänger - Mit Chat-Hilfe 🤖
                  </button>
                  <button
                    className={`skill-button ${skillLevel === 'advanced' ? 'selected' : ''}`}
                    onClick={() => handleSkillSelect('advanced')}
                  >
                    Fortgeschritten - Direkt loslegen 🚀
                  </button>
                </div>
              </>
            ) : (
              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                      {msg.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="message assistant loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Schreibe eine Nachricht..."
                    disabled={isLoading}
                  />
                  <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>
                    {isLoading ? '...' : 'Senden'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Spiele-Empfehlungsfenster - immer sichtbar wenn Chat aktiv */}
          <div className={`game-recommendations-sidebar ${showChat ? 'visible' : ''}`}>
            <h3>🎮 Empfehlungen</h3>
            {gameRecommendations.length > 0 ? (
              <div className="recommendations-list">
                {gameRecommendations.map((game, index) => (
                  <div
                    key={index}
                    className="game-card-mini clickable"
                    onClick={() => handleGameClick(game.name)}
                  >
                    {game.background_image && (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="game-image-mini"
                      />
                    )}
                    <div className="game-info-mini">
                      <h4>{game.name}</h4>
                      <div className="game-details-mini">
                        <span className="rating">⭐ {game.rating}</span>
                        {game.price && <span className="price">{game.price}€</span>}
                      </div>
                      {game.genres && (
                        <div className="genres-mini">
                          {game.genres
                            .slice(0, 2)
                            .map((g) => g.name)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--game-genres-color)',
                  fontSize: '0.9rem',
                }}
              >
                Noch keine Empfehlungen.
                <br />
                Erzähl mir von deinen Vorlieben!
              </p>
            )}
          </div>

          <div className="right-content">
            <img src="/images/Drache.png" alt="Gaming Drache" className="welcome-dragon" />
          </div>
        </div>
      </div>
    </div>
  );
}
