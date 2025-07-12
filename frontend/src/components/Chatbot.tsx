import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.css';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp?: Date;
}

interface ChatSession {
  id: string;
  preview: string;
  timestamp: Date;
}

interface Game {
  name: string;
  rating: number;
  background_image?: string;
  price?: number;
  genres?: { name: string }[];
}

// ✨ NEUE Interfaces für KI-Provider
interface AIProvider {
  name: string;
  model: string;
}

interface ProviderInfo {
  available: string[];
  current: string;
  providers: Record<string, AIProvider>;
}

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [gameRecommendations, setGameRecommendations] = useState<Game[]>([]);
  // ✨ NEUE State für KI-Provider
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialisiere die Willkommensnachricht bei Sprachänderung
  useEffect(() => {
    setMessages([{ sender: 'bot', text: t('chatbot.welcome') }]);
  }, [i18n.language, t]);

  // Lade die SessionID aus dem lokalen Speicher
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadChatHistory(savedSessionId);
    } else {
      // Erstelle eine neue SessionID, wenn keine vorhanden ist
      createNewChat();
    }
    
    // Lade alle verfügbaren Chat-Sessions
    loadAvailableSessions();
    // ✨ NEU: Lade verfügbare KI-Provider
    loadAvailableProviders();
  }, []);

  useEffect(() => {
    const handleUserLogin = () => {
      // Lade den gespeicherten Chatverlauf für den angemeldeten Benutzer
      const savedSessionId = localStorage.getItem('chatSessionId');
      if (savedSessionId) {
        setSessionId(savedSessionId);
        loadChatHistory(savedSessionId);
      }
    };

    // Füge einen Event-Listener hinzu, um auf Benutzeranmeldungen zu reagieren
    window.addEventListener('userLogin', handleUserLogin);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  const loadAvailableSessions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat/sessions`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Konvertiere die Daten in das richtige Format
        const formattedSessions = data.sessions.map((session: any) => ({
          id: session.sessionId,
          preview: session.preview,
          timestamp: session.updatedAt ? new Date(session.updatedAt) : new Date()
        }));
        
        setChatSessions(formattedSessions);
      }
    } catch (error) {
      console.error('Fehler beim Laden der verfügbaren Sessions:', error);
    }
  };

  const loadChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat/history/${sid}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.history && data.history.length > 0) {
          const formattedMessages = data.history.map((msg: any) => ({
            sender: msg.role === 'user' ? 'user' : 'bot',
            text: msg.content,
            timestamp: new Date(msg.timestamp)
          }));
          
          setMessages([
            { sender: 'bot', text: t('chatbot.welcome') },
            ...formattedMessages
          ]);
        } else {
          // Wenn keine Nachrichten vorhanden sind, nur die Willkommensnachricht anzeigen
          setMessages([{ sender: 'bot', text: t('chatbot.welcome') }]);
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden des Chatverlaufs:', error);
    }
  };

  const createNewChat = () => {
    // Erstelle eine neue SessionID
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
    
    // Setze die Nachrichten zurück
    setMessages([{ sender: 'bot', text: t('chatbot.welcome') }]);
    
    // Aktualisiere die Liste der verfügbaren Sessions
    loadAvailableSessions();
  };

  const switchSession = (sid: string) => {
    setSessionId(sid);
    localStorage.setItem('chatSessionId', sid);
    loadChatHistory(sid);
  };

  const clearChatHistory = async (sid: string = sessionId || '') => {
    if (!sid) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat/history/${sid}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Wenn die aktuelle Session gelöscht wurde, erstelle eine neue
        if (sid === sessionId) {
          createNewChat();
        }
        
        // Aktualisiere die Liste der verfügbaren Sessions
        loadAvailableSessions();
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Chatverlaufs:', error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // ✨ NEUE Funktion zum Umschalten der Provider-Einstellungen
  const toggleProviderSettings = () => {
    setShowProviderSettings(!showProviderSettings);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // ✨ BEREINIGTE sendMessage Funktion ohne Provider-Info in Nachrichten
  const sendMessage = async (message: string) => {
    if (!message.trim() || !sessionId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          message,
          language: i18n.language,
          sessionId,
          // ✨ NEU: Sende ausgewählten Provider mit
          provider: selectedProvider
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t('chatbot.error.unauthorized'));
        }
        throw new Error(`API-Anfrage fehlgeschlagen: ${response.status}`);
      }

      const data = await response.json();
      
      // Aktualisiere die SessionID, falls eine neue zurückgegeben wurde
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
      }
      
      // Setze Spielempfehlungen
      if (data.games) {
        setGameRecommendations(data.games);
      }
      
      // ✨ BEREINIGTE Bot-Antwort ohne Provider-Info
      const botResponse = data.response;
      
      setMessages([...messages, { sender: 'user', text: message }, { sender: 'bot', text: botResponse }]);
      
      // Aktualisiere die Liste der verfügbaren Sessions
      loadAvailableSessions();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      
      let errorMessage = t('chatbot.error');
      if (error instanceof Error) {
        if (error.message.includes('unauthorized') || error.message.includes('401')) {
          errorMessage = t('chatbot.error.loginRequired');
        }
      }
      
      setMessages([
        ...messages,
        { sender: 'user', text: message },
        { sender: 'bot', text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      sendMessage(input);
    }
  };

  // Automatisches Scrollen zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  // Formatiere das Datum für die Anzeige
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    
    try {
      return date.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Fehler beim Formatieren des Datums:', error);
      return '';
    }
  };

  // Füge handleGameClick Funktion hinzu
  const handleGameClick = async (gameName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/offers`);
      const offers = await response.json();
      
      const gameOffer = offers.find((offer: any) => 
        offer.game?.name?.toLowerCase() === gameName.toLowerCase()
      );
      
      if (gameOffer) {
        window.open(`/offer/${gameOffer._id}`, '_blank');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Offers:', error);
    }
  };

  // ✨ NEUE Funktion zum Laden der verfügbaren KI-Provider
  const loadAvailableProviders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat/providers`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setProviderInfo(data);
        setSelectedProvider(data.current);
      }
    } catch (error) {
      console.error('Fehler beim Laden der KI-Provider:', error);
    }
  };

  // ✨ NEUE Funktion zum Wechseln des KI-Providers
  const switchProvider = async (provider: string) => {
    try {
      console.log(`🔄 Wechsle zu Provider: ${provider}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/chat/provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedProvider(provider);
        setMessages([
          ...messages,
          { 
            sender: 'bot', 
            text: `🤖 KI-Provider gewechselt zu: ${providerInfo?.providers[provider]?.name} (${providerInfo?.providers[provider]?.model})` 
          }
        ]);
        console.log(`✅ Provider erfolgreich gewechselt:`, data);
      } else {
        // Versuche JSON zu parsen, falls möglich
        let errorMessage = 'Unbekannter Fehler';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || 'Unbekannter Fehler';
        } catch {
          // Falls JSON-Parsing fehlschlägt, verwende den Status-Text
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        
        console.error(`❌ Provider-Wechsel fehlgeschlagen:`, errorMessage);
        setMessages([
          ...messages,
          { sender: 'bot', text: `❌ Fehler beim Provider-Wechsel: ${errorMessage}` }
        ]);
      }
    } catch (error) {
      console.error('Fehler beim Wechseln des Providers:', error);
      setMessages([
        ...messages,
        { sender: 'bot', text: `❌ Fehler beim Wechseln des KI-Providers: ${(error as Error).message}` }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div id="chatbot-icon" className={`chatbot-icon ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140.95 140.95">
          <path
            className="chat-icon-bg"
            d="M70.48,140.95c38.86,0,70.48-31.62,70.48-70.48C140.95,31.62,109.34,0,70.48,0S0,31.62,0,70.47s31.62,70.48,70.48,70.48"
          />
          <path
            className="chat-icon-bubble"
            d="M39.6,34.66h61.75c9.88,0,17.89,8.01,17.89,17.89v24.01c0,9.88-8.01,17.89-17.89,17.89h-.57s0,22.22,0,22.22l-22.22-22.22h-38.96c-9.88,0-17.89-8.01-17.89-17.89v-24.01c0-9.88,8.01-17.89,17.89-17.89"
          />
          <path
            className="chat-icon-outline"
            d="M100.78,118.79c-.55,0-1.09-.21-1.5-.62l-21.6-21.6h-38.09c-11.03,0-20-8.97-20-20v-24.02c0-11.03,8.97-20,20-20h61.75c11.03,0,20,8.97,20,20v24.02c0,10.51-8.15,19.15-18.46,19.94v20.16c0,.85-.51,1.63-1.31,1.95-.26.11-.54.16-.81.16M39.6,36.78c-8.7,0-15.77,7.08-15.77,15.78v24.02c0,8.7,7.08,15.77,15.77,15.77h38.96c.56,0,1.1.22,1.5.62l18.61,18.61v-17.11c0-1.17.95-2.11,2.11-2.11h.57c8.7,0,15.77-7.08,15.77-15.77v-24.02c0-8.7-7.08-15.78-15.77-15.78h-61.75Z"
          />
          <path
            className="chat-icon-dots"
            d="M86.06,63.28c0,3.94,3.2,7.14,7.14,7.14s7.14-3.2,7.14-7.14c0-3.95-3.2-7.14-7.14-7.14-3.95,0-7.14,3.2-7.14,7.14"
          />
          <path
            className="chat-icon-dots"
            d="M63.33,63.28c0,3.94,3.2,7.14,7.14,7.14,3.94,0,7.14-3.2,7.14-7.14,0-3.95-3.2-7.14-7.14-7.14s-7.14,3.2-7.14,7.14"
          />
          <path
            className="chat-icon-dots"
            d="M40.62,63.28c0,3.94,3.2,7.14,7.14,7.14s7.14-3.2,7.14-7.14c0-3.95-3.2-7.14-7.14-7.14-3.95,0-7.14,3.2-7.14,7.14"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>GameCompass Assistent</h3>
            <div className="chatbot-controls">
              {/* ✨ VERBESSERTER KI-Provider Button mit aktuellem Provider */}
              <button 
                className="provider-button" 
                onClick={toggleProviderSettings} 
                title={`KI-Provider: ${providerInfo?.providers[selectedProvider]?.name || selectedProvider}`}
              >
                <div className="provider-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7v10c0 5.55 4.45 10 10 10s10-4.45 10-10V7L12 2z"></path>
                    <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                  </svg>
                  <span className="provider-label">KI</span>
                </div>
                <span className="current-provider-name">
                  {providerInfo?.providers[selectedProvider]?.name?.split(' ')[0] || selectedProvider}
                </span>
              </button>
              
              <button className="close-button" onClick={toggleChat}>
                ×
              </button>
            </div>
          </div>
          
          <div className="chatbot-content">
            {/* ✨ NEU: Provider-Einstellungen Panel */}
            {showProviderSettings && providerInfo && (
              <div className="provider-settings-panel">
                <div className="provider-settings-header">
                  <h4>🤖 KI-Provider</h4>
                  <span className="current-provider">
                    Aktuell: {providerInfo.providers[selectedProvider]?.name || selectedProvider}
                  </span>
                </div>
                <div className="provider-list">
                  {providerInfo.available.map((provider) => (
                    <div
                      key={provider}
                      className={`provider-option ${provider === selectedProvider ? 'active' : ''}`}
                      onClick={() => switchProvider(provider)}
                    >
                      <div className="provider-info">
                        <strong>{providerInfo.providers[provider]?.name}</strong>
                        <small>{providerInfo.providers[provider]?.model}</small>
                      </div>
                      {provider === selectedProvider && (
                        <span className="provider-status">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="chatbot-history-panel">
              <div className="chatbot-history-header">
                <h4>{t('chatbot.history')}</h4>
              </div>
              <div className="chatbot-history-list">
                <button className="new-chat-button" onClick={createNewChat}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {t('chatbot.newChat')}
                </button>
                
                {chatSessions.length > 0 ? (
                  chatSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className={`history-session ${session.id === sessionId ? 'active' : ''}`}
                    >
                      <div className="history-session-content" onClick={() => switchSession(session.id)}>
                        <div>
                          {session.preview.includes("Hallo! Wie kann ich") || 
                           session.preview.includes("Hello! How can I") || 
                           session.preview.includes("¡Hola! ¿Cómo puedo") || 
                           session.preview.includes("Bonjour ! Comment puis-je") || 
                           session.preview.includes("Привет! Как я могу") || 
                           session.preview.includes("Merhaba! Size nasıl") 
                            ? t('chatbot.welcome') 
                            : session.preview}
                        </div>
                        <small>{formatDate(session.timestamp)}</small>
                      </div>
                      <button 
                        className="delete-session-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          clearChatHistory(session.id);
                        }}
                        title={t('chatbot.deleteChat')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div>{t('chatbot.noHistory')}</div>
                )}
              </div>
            </div>
            
            <div className="chatbot-main">
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender}`}>
                    {message.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="chatbot-input">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Schreibe eine Nachricht..."
                  ref={inputRef}
                  disabled={isLoading}
                />
                <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}>
                  {isLoading ? '...' : 'Senden'}
                </button>
              </div>
            </div>

            <div className="game-recommendations-sidebar visible">
              <h3>🎮 Empfehlungen</h3>
              {gameRecommendations.length > 0 ? (
                <div className="recommendations-list">
                  {gameRecommendations.map((game, index) => (
                    <div 
                      key={index} 
                      className="game-card-mini clickable"
                      onClick={() => handleGameClick(game.name)}
                      style={{ cursor: 'pointer' }}
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
                            {game.genres.slice(0, 2).map(g => g.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--game-genres-color)', fontSize: '0.9rem' }}>
                  Noch keine Empfehlungen.<br />
                  Erzähl mir von deinen Vorlieben!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
