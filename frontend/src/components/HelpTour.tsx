import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const TourContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const TourCard = styled.div<{ theme: string }>`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : 'white'};
  color: ${props => props.theme === 'dark' ? '#e1e1e1' : '#333'};
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  text-align: center;
  position: relative;
  border: 2px solid #f19115;
`;

const Highlight = styled.div<{ rect: DOMRect | null }>`
  display: ${props => (props.rect ? 'block' : 'none')};
  position: fixed;
  top: ${props => props.rect?.top ?? 0}px;
  left: ${props => props.rect?.left ?? 0}px;
  width: ${props => props.rect?.width ?? 0}px;
  height: ${props => props.rect?.height ?? 0}px;
  border: 4px solid #f19115;
  border-radius: 12px;
  box-shadow:
    0 0 20px rgba(241, 145, 21, 0.8),
    inset 0 0 20px rgba(241, 145, 21, 0.3);
  pointer-events: none;
  z-index: 9999;
  animation: pulse 2s infinite;
  background: rgba(241, 145, 21, 0.1);
  
  @keyframes pulse {
    0% { 
      transform: scale(1); 
      opacity: 1;
      box-shadow: 0 0 20px rgba(241, 145, 21, 0.8), inset 0 0 20px rgba(241, 145, 21, 0.3);
    }
    50% { 
      transform: scale(1.05); 
      opacity: 0.8;
      box-shadow: 0 0 30px rgba(241, 145, 21, 1), inset 0 0 30px rgba(241, 145, 21, 0.5);
    }
    100% { 
      transform: scale(1); 
      opacity: 1;
      box-shadow: 0 0 20px rgba(241, 145, 21, 0.8), inset 0 0 20px rgba(241, 145, 21, 0.3);
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger'; theme: string }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background-color: #f19115;
        color: white;
        &:hover { background-color: #d97d0f; }
      `;
    } else if (props.variant === 'danger') {
      return `
        background-color: #dc3545;
        color: white;
        &:hover { background-color: #c82333; }
      `;
    } else {
      return `
        background-color: ${props.theme === 'dark' ? '#555' : '#e9ecef'};
        color: ${props.theme === 'dark' ? '#e1e1e1' : '#333'};
        &:hover { background-color: ${props.theme === 'dark' ? '#666' : '#d3d6db'}; }
      `;
    }
  }}
`;

const ProgressBar = styled.div<{ theme: string }>`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme === 'dark' ? '#555' : '#e9ecef'};
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #f19115;
  transition: width 0.3s ease;
`;

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetId?: string;
}

export function HelpTour({ onClose }: { onClose?: () => void } = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: '🎮 Willkommen zur GameCompass Tour!',
      description: 'Lass mich dir zeigen, wie du unsere Website optimal nutzen kannst. Klicke auf "Weiter", um zu beginnen.',
      icon: '🚀'
    },
    {
      id: 'logo',
      title: '🏠 GameCompass Logo & Home',
      description: 'Hier findest du unser Logo und den Titel "GAMECOMPASS". Ein Klick darauf bringt dich jederzeit zur Startseite zurück.',
      icon: '🏠',
      targetId: 'home-GAMECOMPASS_Oben'
    },
    {
      id: 'home',
      title: '🏠 Home - Zurück zur Startseite',
      description: 'Mit einem Klick auf "Home" kehrst du jederzeit zur Startseite zurück. Hier findest du die neuesten Angebote und Empfehlungen.',
      icon: '🏠',
      targetId: 'home-Home'
    },
    {
      id: 'games',
      title: '🎮 Spiele - Entdecke deine Lieblingsspiele',
      description: 'Im Bereich "Spiele" kannst du nach Spielen suchen, verschiedene Kategorien durchstöbern und deine nächsten Gaming-Abenteuer finden. Filtere nach Genre, Plattform oder Preis!',
      icon: '🎮',
      targetId: 'home-Entdecken'
    },
    {
      id: 'sell',
      title: '💰 Verkaufen - Verdiene mit deinen Spielen',
      description: 'Hast du Spiele, die du nicht mehr spielst? Im "Verkaufen"-Bereich kannst du deine eigenen Spiele zum Verkauf anbieten und damit Geld verdienen. Einfach, schnell und sicher!',
      icon: '💰',
      targetId: 'home-Verkaufen_2'
    },
    {
      id: 'about',
      title: '👥 Über uns - Lerne unser Team kennen',
      description: 'Erfahre mehr über GameCompass, unser Team und unsere Mission. Hier findest du Informationen über unsere Werte, unsere Geschichte und wie wir Gaming-Communities verbinden.',
      icon: '👥',
      targetId: 'home-support-oben'
    },
    {
      id: 'search',
      title: '🔍 Suchfunktion - Finde schnell dein Spiel',
      description: 'Mit der intelligenten Suchfunktion findest du blitzschnell das gewünschte Spiel. Gib einfach den Namen ein und erhalte sofortige Ergebnisse mit Preisen und Verfügbarkeit!',
      icon: '🔍',
      targetId: 'search-function'
    },
    {
      id: 'language',
      title: '🌐 Sprachauswahl - Deine Sprache, dein Erlebnis',
      description: 'GameCompass spricht deine Sprache! Wähle zwischen Deutsch, Englisch, Französisch, Spanisch, Türkisch und Russisch. Die Website passt sich komplett an deine gewählte Sprache an.',
      icon: '🌐',
      targetId: 'home-Sprache_icon_oben'
    },
    {
      id: 'darkmode',
      title: '🌙 Dark/Light Mode - Für jede Tageszeit',
      description: 'Wechsle zwischen hellem und dunklem Design. Der Dark Mode schont deine Augen beim Gaming in der Nacht, während der Light Mode perfekt für den Tag ist!',
      icon: '🌙',
      targetId: 'home-Lightmode'
    },
    {
      id: 'auth',
      title: '👤 Anmeldung & Profil - Dein persönlicher Bereich',
      description: 'Melde dich an oder registriere dich kostenlos! Mit einem Account kannst du Spiele kaufen und verkaufen, Bewertungen abgeben und dein persönliches Gaming-Profil erstellen.',
      icon: '👤',
      targetId: 'home-Anmelden'
    },
    {
      id: 'cart',
      title: '🛒 Warenkorb - Deine Gaming-Sammlung',
      description: 'Hier sammelst du alle Spiele, die du kaufen möchtest. Die kleine Zahl zeigt dir, wie viele Artikel in deinem Warenkorb sind. Ein Klick und du siehst alle Details!',
      icon: '🛒',
      targetId: 'home-Warenkorb'
    },
    {
      id: 'help',
      title: '❓ Hilfe-Center - Immer für dich da',
      description: 'Brauchst du Hilfe? Das Fragezeichen-Icon startet diese Tour erneut oder führt dich zu weiteren Hilfestellungen. Wir lassen dich nie allein!',
      icon: '❓',
      targetId: 'home-Help'
    },
    {
      id: 'wiki',
      title: '📚 Wiki & Dokumentation - Wissen für Gamer',
      description: 'Unser umfassendes Wiki enthält detaillierte Anleitungen, Gaming-Tipps und alles, was du über unsere Plattform wissen musst. Dein Nachschlagewerk für alle Fragen!',
      icon: '📚',
      targetId: 'home-Wiki'
    },
    {
      id: 'chatbot',
      title: '🤖 AI-Chatbot - Dein intelligenter Gaming-Berater',
      description: 'Unser KI-gestützter Chatbot ist dein persönlicher Gaming-Experte! Er hilft bei der Spielesuche, gibt Empfehlungen basierend auf deinen Vorlieben und beantwortet alle Fragen. Du findest ihn rechts unten auf jeder Seite.',
      icon: '🤖',
      targetId: 'chatbot-icon'
    },
    {
      id: 'voice',
      title: '🎤 Sprachassistent - Gaming per Sprache',
      description: 'Revolutionäre Sprachsteuerung! Sage einfach, welches Spiel du suchst, und unser Sprachassistent findet es für dich. Perfekt für hands-free Navigation beim Gaming. Neben dem Chatbot zu finden!',
      icon: '🎤',
      targetId: 'audio-chat-button'
    },
    {
      id: 'voice-settings',
      title: '🔊 Stimmeneinstellungen - Deine perfekte Stimme',
      description: 'Personalisiere dein Audio-Erlebnis! Wähle zwischen verschiedenen Stimmen für die Sprachausgabe. Ob männlich oder weiblich - finde die Stimme, die zu dir passt. Links neben dem Sprachassistenten.',
      icon: '🔊',
      targetId: 'voice-toggle'
    },
    {
      id: 'complete',
      title: '🎉 Tour abgeschlossen - Ready to Game!',
      description: 'Fantastisch! Du bist jetzt ein GameCompass-Profi und kennst alle Features unserer Plattform. Starte dein Gaming-Abenteuer und entdecke die besten Spiele-Deals!',
      icon: '🎉'
    }
  ];

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    setIsVisible(false);
    onClose?.();
  };

  const completeTour = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextStep();
      }
      if (e.key === 'ArrowLeft') {
        prevStep();
      }
      if (e.key === 'Escape') {
        skipTour();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep]);

  // ----------  NEU: Memoisiertes Update-Callback  ----------
  const updateRect = useCallback(() => {
    if (!currentTourStep.targetId) {
      setHighlightRect(null);
      return;
    }
    const el = document.getElementById(currentTourStep.targetId);
    if (!el) {
      setHighlightRect(null);
      return;
    }

    const r = el.getBoundingClientRect();
    const padded = new DOMRect(r.left - 6, r.top - 6, r.width + 12, r.height + 12);

    setHighlightRect(prev => {
      if (
        !prev ||
        prev.x !== padded.x ||
        prev.y !== padded.y ||
        prev.width !== padded.width ||
        prev.height !== padded.height
      ) {
        return padded;          // nur updaten, wenn sich etwas geändert hat
      }
      return prev;               // sonst keine State-Änderung ➜ kein Re-Render
    });
  }, [currentTourStep]);

  // ----------  Effect nur bei Step-Änderung  ----------
  useEffect(() => {
    updateRect();                       // initial für aktuellen Schritt

    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);
  // ---------------------------------------------------

  if (!isVisible) return null;

  return (
    <>
      <Highlight rect={highlightRect} />
      <TourContainer>
        <TourCard theme={theme}>
          <ProgressBar theme={theme}>
            <Progress progress={progress} />
          </ProgressBar>

          <div style={{ 
            fontSize: '14px', 
            color: theme === 'dark' ? '#aaa' : '#666',
            marginBottom: '15px'
          }}>
            Schritt {currentStep + 1} von {tourSteps.length}
          </div>

          <div style={{ fontSize: '60px', marginBottom: '20px' }}>
            {currentTourStep.icon}
          </div>

          <h2 style={{ 
            marginBottom: '15px',
            color: theme === 'dark' ? '#f19115' : '#f19115'
          }}>
            {currentTourStep.title}
          </h2>

          <p style={{ 
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '25px',
            color: theme === 'dark' ? '#e1e1e1' : '#333'
          }}>
            {currentTourStep.description}
          </p>

          <NavigationButtons>
            <div>
              {currentStep > 0 && (
                <Button
                  theme={theme}
                  variant="secondary"
                  onClick={prevStep}
                >
                  ← Zurück
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                theme={theme}
                variant="danger"
                onClick={skipTour}
              >
                Tour beenden
              </Button>

              {currentStep < tourSteps.length - 1 ? (
                <Button
                  theme={theme}
                  variant="primary"
                  onClick={nextStep}
                >
                  Weiter →
                </Button>
              ) : (
                <Button
                  theme={theme}
                  variant="primary"
                  onClick={completeTour}
                >
                  Fertig! 🎉
                </Button>
              )}
            </div>
          </NavigationButtons>

          <div style={{ 
            marginTop: '20px',
            fontSize: '12px',
            color: theme === 'dark' ? '#888' : '#999',
            borderTop: `1px solid ${theme === 'dark' ? '#555' : '#eee'}`,
            paddingTop: '15px'
          }}>
            💡 Tipp: Nutze die Pfeiltasten ←→ oder Enter zum Navigieren, ESC zum Beenden
          </div>
        </TourCard>
      </TourContainer>
    </>
  );
} 