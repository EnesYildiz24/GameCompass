// src/components/LandingPage.tsx
import { useState, useEffect } from 'react';
import { Login } from './Login';
import { Modal, Button } from 'react-bootstrap';
import '../styles/LandingPage.css'; // CSS-Datei importieren
import { Chatbot } from './Chatbot';
import { AudioChat } from './AudioChat'; // AudioChat importieren
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import '../styles/theme.css'; // CSS-Datei für Theme-Variablen importieren
import { useLocation, useNavigate } from 'react-router-dom';
import { getAlleRAWGSpiele, getAllOffers } from '../backend/api';
import { SpielResource } from '../Resources';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomePopup } from '../components/WelcomePopup';

export function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [spiele, setSpiele] = useState<SpielResource[]>([]);
  const [spielIndex, setSpielIndex] = useState(0);
  const [cheapGames, setCheapGames] = useState<SpielResource[]>([]);
  const [cheapPage, setCheapPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedGames, setDisplayedGames] = useState<SpielResource[]>([]);
  const [, setNextGames] = useState<SpielResource[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [mostPurchasedGames, setMostPurchasedGames] = useState<SpielResource[]>([]);
  const [mostPurchasedPage, setMostPurchasedPage] = useState(0);
  const [isMostPurchasedTransitioning, setIsMostPurchasedTransitioning] = useState(false);
  const [displayedMostPurchased, setDisplayedMostPurchased] = useState<SpielResource[]>([]);
  const [, setNextMostPurchased] = useState<SpielResource[]>([]);
  const [isMostPurchasedHovering, setIsMostPurchasedHovering] = useState(false);
  const [isTitleTransitioning, setIsTitleTransitioning] = useState(false);
  const [isTitleHovering, setIsTitleHovering] = useState(false);
  const [displayedTitleSpiel, setDisplayedTitleSpiel] = useState<SpielResource | null>(null);
  const [, setNextTitleSpiel] = useState<SpielResource | null>(null);
  const gamesPerPage = 4;
  const cheapGamesMaxPage = Math.max(1, Math.ceil(cheapGames.length / gamesPerPage));
  const mostPurchasedMaxPage = Math.max(1, Math.ceil(mostPurchasedGames.length / gamesPerPage));
  const location = useLocation();

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null);

  // Neue States für die Sortierung
  const [sortType] = useState<'new' | 'used'>('new');

  // Filter für Querformat-Bilder - vereinfachte Version
  const querformatSpiele = spiele.filter((spiel) => spiel.background_image);

  // Funktion zum Filtern der Spiele nach Zustand
  const filterGamesByCondition = (games: SpielResource[]) => {
    return games.map((game) => ({
      ...game,
      condition: sortType === 'new' ? 'new' : 'used',
      price: sortType === 'new' ? game.price : (game.price || 0) * 0.7, // 30% Rabatt für gebrauchte Spiele
    }));
  };

  const handleCheapPrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      const newPage = (cheapPage - 1 + cheapGamesMaxPage) % cheapGamesMaxPage;
      const nextGames = cheapGames.slice(newPage * gamesPerPage, (newPage + 1) * gamesPerPage);
      setNextGames(nextGames);
      setTimeout(() => {
        setCheapPage(newPage);
        setDisplayedGames(nextGames);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleCheapNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection(1);
      const newPage = (cheapPage + 1) % cheapGamesMaxPage;
      setTimeout(() => {
        setCheapPage(newPage);
        setDisplayedGames(cheapGames.slice(newPage * gamesPerPage, (newPage + 1) * gamesPerPage));
        setIsTransitioning(false);
      }, 100);
    }
  };

  const handleMostPurchasedPrev = () => {
    if (!isMostPurchasedTransitioning) {
      setIsMostPurchasedTransitioning(true);
      const newPage = (mostPurchasedPage - 1 + mostPurchasedMaxPage) % mostPurchasedMaxPage;
      const nextGames = mostPurchasedGames.slice(
        newPage * gamesPerPage,
        (newPage + 1) * gamesPerPage
      );
      setNextMostPurchased(nextGames);
      setTimeout(() => {
        setMostPurchasedPage(newPage);
        setDisplayedMostPurchased(nextGames);
        setIsMostPurchasedTransitioning(false);
      }, 300);
    }
  };

  const handleMostPurchasedNext = () => {
    if (!isMostPurchasedTransitioning) {
      setIsMostPurchasedTransitioning(true);
      setDirection(1);
      const newPage = (mostPurchasedPage + 1) % mostPurchasedMaxPage;
      setTimeout(() => {
        setMostPurchasedPage(newPage);
        setDisplayedMostPurchased(
          mostPurchasedGames.slice(newPage * gamesPerPage, (newPage + 1) * gamesPerPage)
        );
        setIsMostPurchasedTransitioning(false);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (!isTitleTransitioning) {
      setIsTitleTransitioning(true);
      const newIndex = (spielIndex - 1 + querformatSpiele.length) % querformatSpiele.length;

      // First phase: fade out
      setTimeout(() => {
        // Second phase: change image and fade in
        setNextTitleSpiel(querformatSpiele[newIndex]);
        setSpielIndex(newIndex);
        setDisplayedTitleSpiel(querformatSpiele[newIndex]);
        setIsTitleTransitioning(false);
      }, 300);
    }
  };

  const handleNext = () => {
    if (!isTitleTransitioning && querformatSpiele.length > 0) {
      setIsTitleTransitioning(true);
      setDirection(1);
      const newIndex = (spielIndex + 1) % querformatSpiele.length;
      setTimeout(() => {
        setSpielIndex(newIndex);
        setDisplayedTitleSpiel(querformatSpiele[newIndex]);
        setIsTitleTransitioning(false);
      }, 100);
    }
  };

  const handleClose = () => setShowLoginModal(false);

  const handleGameClick = async (game: SpielResource, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('Game clicked:', game.name, 'ID:', game.id);

    try {
      // Suche nach Offers für dieses Spiel
      const offers = await getAllOffers();

      // Finde Offer für dieses Spiel
      const gameOffer = offers.find(
        (offer: any) => offer.game?.name?.toLowerCase() === game.name.toLowerCase()
      );

      if (gameOffer) {
        // Öffne SpielDetail in neuem Tab
        window.open(`/#/offer/${gameOffer._id}`, '_blank');
      } else {
        console.log('Kein Offer für dieses Spiel gefunden');
        // Falls kein Offer gefunden wird, navigiere zur Spiele-Liste mit Suche
        window.open(`/games?search=${encodeURIComponent(game.name)}`, '_blank');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Offers:', error);
      // Fallback zur Spiele-Liste
      window.open(`/games?search=${encodeURIComponent(game.name)}`, '_blank');
    }
  };

  // Handler für Abenteuer-Genre-Klick
  const handleAbenteuerClick = () => {
    navigate({
      pathname: '/games',
      search: '?genre=Adventure',
    });
  };

  // Handler für Racing-Genre-Klick
  const handleRacingClick = () => {
    navigate({
      pathname: '/games',
      search: '?genre=Racing',
    });
  };

  // Handler für Action-Genre-Klick
  const handleActionClick = () => {
    navigate({
      pathname: '/games',
      search: '?genre=Action',
    });
  };

  // Füge diese Animation-Varianten nach den bestehenden States hinzu
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  const heroVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
  };

  const transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  useEffect(() => {
    const state = location.state as { welcome?: boolean; username?: string } | null;
    console.log('STATE aus URL:', location.state);
    console.log('showWelcome', showWelcome, 'welcomeUser', welcomeUser);

    if (state?.welcome) {
      setShowWelcome(true);
      setWelcomeUser(state?.username ?? null);
    }
  }, [location, navigate]);

  const [direction, setDirection] = useState(0);

  useEffect(() => {
    getAlleRAWGSpiele()
      .then((spiele) => {
        setSpiele(spiele);

        // Filter games under 15 euros and ensure they have a background image
        const cheap = spiele.filter((spiel) => {
          const hasImage = !!spiel.background_image;
          const isCheap = (spiel.price || 0) < 15;
          return hasImage && isCheap;
        });
        setCheapGames(cheap);
        setDisplayedGames(cheap.slice(0, gamesPerPage));
        setNextGames(cheap.slice(0, gamesPerPage));

        // Sort games by rating and filter those with background images
        const mostPurchased = spiele
          .filter((spiel) => spiel.background_image)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setMostPurchasedGames(mostPurchased);
        setDisplayedMostPurchased(mostPurchased.slice(0, gamesPerPage));
        setNextMostPurchased(mostPurchased.slice(0, gamesPerPage));

        // Set initial title game
        const titleGames = spiele.filter((spiel) => spiel.background_image);
        setDisplayedTitleSpiel(titleGames[0]);
        setNextTitleSpiel(titleGames[1]);
      })
      .catch((error) => {
        console.error('Error loading games:', error);
      });
  }, []);

  // Aktualisiere die angezeigten Spiele basierend auf dem Sortierungstyp
  useEffect(() => {
    if (cheapGames.length > 0) {
      const filteredGames = filterGamesByCondition(cheapGames);
      setDisplayedGames(filteredGames.slice(0, gamesPerPage));
      setNextGames(filteredGames.slice(0, gamesPerPage));
    }
  }, [sortType, cheapGames]);

  // Auto-swipe effect for cheap games
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isHovering) {
      interval = setInterval(() => {
        handleCheapNext();
      }, 4500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cheapGamesMaxPage, isTransitioning, isHovering]);

  // Auto-swipe effect for most purchased games
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isMostPurchasedHovering) {
      interval = setInterval(() => {
        handleMostPurchasedNext();
      }, 4500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [mostPurchasedMaxPage, isMostPurchasedTransitioning, isMostPurchasedHovering]);

  // Auto-swipe effect for title image
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isTitleHovering && !isTitleTransitioning) {
      interval = setInterval(() => {
        handleNext();
      }, 6000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [querformatSpiele.length, isTitleHovering, isTitleTransitioning]);

  return (
    <>
      {showWelcome && (
        <WelcomePopup
          username={welcomeUser ?? ''}
          onClose={() => {
            setShowWelcome(false); // Popup aus
            navigate(location.pathname, {
              // JETZT History säubern
              replace: true,
              state: {},
            });
          }}
          onSkillSelect={() => {}}
          skillLevel={null}
        />
      )}
      <div>
        <main>
          <div className="svg-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1920 3893.05"
            >
              <defs>
                <style>
                  {`.cls-1, .cls-2, .cls-3 {
                  fill: #e6e5e9;
                }

                .cls-4 {
                  stroke: #fff;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: .2px;
                }

                .cls-4, .cls-5 {
                  fill: none;
                }

                .cls-6, .cls-5, .cls-7, .cls-2, .cls-8, .cls-3 {
                  opacity: .8;
                }

                .cls-6, .cls-2 {
                  font-family: Verdana, Verdana;
                  font-size: 14px;
                }

                .cls-9, .cls-10 {
                  fill: #fff;
                }

                .cls-5 {
                  stroke: #e6e5e9;
                  stroke-miterlimit: 10;
                  stroke-width: 2.07px;
                }

                .cls-10, .cls-11 {
                  fill-rule: evenodd;
                }

                .cls-12 {
                  fill: #1d1d1b;
                  font-size: 25px;
                }

                .cls-12, .cls-8 {
                  font-family: Verdana-Bold, Verdana;
                  font-weight: 700;
                }

                .cls-13 {
                  letter-spacing: -.02em;
                }

                .cls-11, .cls-14 {
                  fill: #010101;
                }

                .cls-8 {
                  fill: #e0dfe5;
                  font-size: 20.71px;
                }

                .cls-15 {
                  fill: #34353b;
                }

                .cls-16 {
                  fill: #5c8791;
                }
                .cls-14 {
                   fill:#FFFFFF;
                    }

                .cls-17 {
                  fill: #fcc10c;
                }`}
                </style>
              </defs>
              <g id="Header">
                <image
                  width="8000"
                  height="4073"
                  transform="scale(.24)"
                  xlinkHref={
                    theme === 'dark' ? 'images/drachensymbol2.png' : 'images/drachensymbol1.png'
                  }
                />
              </g>
              {displayedTitleSpiel && (
                <foreignObject x="310" y="1100" width="1234" height="600">
                  <div
                    className="hero-carousel"
                    onMouseEnter={() => setIsTitleHovering(true)}
                    onMouseLeave={() => setIsTitleHovering(false)}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '50px',
                    }}
                  >
                    <AnimatePresence custom={direction}>
                      <motion.div
                        key={spielIndex}
                        custom={direction}
                        variants={heroVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={transition}
                        onClick={(e) => handleGameClick(displayedTitleSpiel, e)}
                        style={{
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        <img
                          src={displayedTitleSpiel.background_image}
                          alt={displayedTitleSpiel.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50px',
                          }}
                        />
                        <div className="hero-game-info">
                          <div>{displayedTitleSpiel.name}</div>
                          <div>{displayedTitleSpiel.price?.toFixed(2)} €</div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </foreignObject>
              )}
              <g
                id="oben_links_swipe"
                data-name="oben links swipe"
                style={{ cursor: 'pointer' }}
                onClick={handlePrev}
              >
                <path
                  className="cls-14"
                  d="M145.39,1494.94c.78,0,1.54-.11,2.28-.32.75-.21,1.45-.53,2.11-.94.66-.41,1.25-.9,1.77-1.48.52-.58.95-1.21,1.3-1.91.34-.7-.59-1.43-.73-2.19-.14-.76.17-1.53.1-2.31-.07-.77-.25-1.52-.54-2.25-.28-.72-.66-1.39-1.13-2.01l-25.77-33.72,25.78-33.72c.33-.44.62-.9.86-1.4.24-.49.43-1.01.57-1.54.14-.53.23-1.07.26-1.62.03-.55.01-1.09-.06-1.64-.07-.54-.2-1.08-.38-1.59-.18-.52-.41-1.02-.68-1.49-.28-.47-.6-.92-.96-1.33s-.76-.78-1.2-1.12c-.44-.33-.9-.62-1.39-.86s-1-.43-1.53-.57c-.53-.14-1.07-.23-1.62-.26s-1.09-.01-1.64.06-1.07.2-1.59.38c-.52.18-1.01.41-1.49.68-.47.28-.92.6-1.33.96s-.78.76-1.11,1.2l-29.6,38.79c-.28.36-.52.74-.73,1.14-.21.4-.39.82-.54,1.25s-.25.87-.33,1.32c-.07.45-.11.9-.11,1.35s.04.91.11,1.35c.07.45.18.89.33,1.32.15.43.32.85.54,1.25.21.4.46.78.73,1.14l29.6,38.79c.39.51.84.97,1.33,1.38.5.41,1.04.76,1.61,1.04.58.28,1.18.5,1.81.64.63.14,1.26.21,1.91.21Z"
                />
              </g>
              <g
                id="oben_rechts_swipe"
                data-name="oben rechts swipe"
                style={{ cursor: 'pointer' }}
                onClick={handleNext}
              >
                <path
                  className="cls-14"
                  d="M1735.03,1493.75c-.78,0-1.54-.11-2.28-.32-.75-.21-1.45-.53-2.11-.94-.66-.41-1.25-.9-1.77-1.48-.52-.58-.95-1.21-1.3-1.91-.34-.7-.59-1.43-.73-2.19-.14-.76-.17-1.53-.1-2.31.07-.77.25-1.52.54-2.25.28-.72.66-1.39,1.13-2.01l25.77-33.72-25.78-33.72c-.33-.44-.62-.9-.86-1.4-.24-.49-.43-1.01-.57-1.54-.14-.53-.23-1.07-.26-1.62-.03-.55-.01-1.09.06-1.64.07-.54.2-1.08.38-1.59.18-.52.41-1.02.68-1.49.28-.47.6-.92.96-1.33s.76-.78,1.2-1.12c.44-.33.9-.62,1.39-.86s1-.43,1.53-.57c.53-.14,1.07-.23,1.62-.26s1.09-.01,1.64.06,1.07.2,1.59.38c.52.18,1.01.41,1.49.68.47.28.92.6,1.33.96s.78.76,1.11,1.2l29.6,38.79c.28.36.52.74.73,1.14.21.4.39.82.54,1.25s.25.87.33,1.32c.07.45.11.9.11,1.35s-.04.91-.11,1.35c-.07.45-.18.89-.33,1.32-.15.43-.32.85-.54,1.25-.21.4-.46.78-.73,1.14l-29.6,38.79c-.39.51-.84.97-1.33,1.38-.5.41-1.04.76-1.61,1.04-.58.28-1.18.5-1.81.64-.63.14-1.26.21-1.91.21Z"
                />
              </g>
              <g id="genres_links_swipe" data-name="genres links swipe">
                <path
                  className="cls-14"
                  d="M191.93,2947.07c.5,0,.99-.07,1.47-.21.48-.14.93-.34,1.35-.6.42-.26.8-.58,1.14-.95.33-.37.61-.78.83-1.23.22-.45.38-.92.47-1.41.09-.49.11-.98.06-1.48-.05-.5-.16-.98-.35-1.44-.18-.46-.42-.89-.73-1.29l-16.54-21.64,16.54-21.64c.21-.28.4-.58.55-.9.15-.32.28-.65.37-.99.09-.34.15-.69.17-1.04.02-.35,0-.7-.04-1.05-.05-.35-.13-.69-.24-1.02-.11-.33-.26-.65-.44-.96-.18-.3-.38-.59-.62-.85s-.49-.5-.77-.72c-.28-.21-.58-.4-.89-.55s-.64-.28-.98-.37c-.34-.09-.69-.15-1.04-.17s-.7,0-1.05.04-.69.13-1.02.24c-.33.11-.65.26-.95.44-.3.18-.59.38-.85.62s-.5.49-.71.77l-18.99,24.89c-.18.23-.33.48-.47.73-.14.26-.25.52-.35.8s-.16.56-.21.85c-.05.29-.07.58-.07.87,0,.29.02.58.07.87.05.29.12.57.21.85.09.28.21.54.35.8.14.26.29.5.47.73l18.99,24.89c.25.33.54.62.86.89.32.26.66.49,1.04.67.37.18.76.32,1.16.41.4.09.81.14,1.22.14Z"
                />
              </g>
              <g id="genres_rechts_swap" data-name="genres rechts swap">
                <path
                  className="cls-14"
                  d="M1684.75,2947.07c-.5,0-.99-.07-1.47-.21-.48-.14-.93-.34-1.35-.6-.42-.26-.8-.58-1.14-.95-.33-.37-.61-.78-.83-1.23-.22-.45-.38-.92-.47-1.41-.09-.49-.11-.98-.06-1.48.05-.5.16-.98.35-1.44.18-.46.42-.89.73-1.29l16.54-21.64-16.54-21.64c-.21-.28-.4-.58-.55-.9-.15-.32-.28-.65-.37-.99-.09-.34-.15-.69-.17-1.04-.02-.35,0-.7.04-1.05.05-.35.13-.69.24-1.02.11-.33.26-.65.44-.96.18-.3.38-.59.62-.85s.49-.5.77-.72c.28-.21.58-.4.89-.55s.64-.28.98-.37c.34-.09.69-.15,1.04-.17s.7,0,1.05.04.69.13,1.02.24c.33.11.65.26.95.44.3.18.59.38.85.62s.5.49.71.77l18.99,24.89c.18.23.33.48.47.73.14.26.25.52.35.8s.16.56.21.85c.05.29.07.58.07.87s-.02.58-.07.87c-.05.29-.12.57-.21.85-.09.28-.21.54-.35.8-.14.26-.29.5-.47.73l-18.99,24.89c-.25.33-.54.62-.86.89-.32.26-.66.49-1.04.67-.37.18-.76.32-1.16.41-.4.09-.81.14-1.22.14Z"
                />
              </g>
              <g
                id="meistgespielt_links_swipe"
                data-name="meistgespielt links swipe"
                style={{ cursor: 'pointer' }}
                onClick={handleCheapPrev}
                className={isTransitioning ? 'arrow-transitioning' : ''}
              >
                <path
                  className="cls-14"
                  d="M191.93,2947.07c.5,0,.99-.07,1.47-.21.48-.14.93-.34,1.35-.6.42-.26.8-.58,1.14-.95.33-.37.61-.78.83-1.23.22-.45.38-.92.47-1.41.09-.49.11-.98.06-1.48-.05-.5-.16-.98-.35-1.44-.18-.46-.42-.89-.73-1.29l-16.54-21.64,16.54-21.64c.21-.28.4-.58.55-.9.15-.32.28-.65.37-.99.09-.34.15-.69.17-1.04.02-.35,0-.7-.04-1.05-.05-.35-.13-.69-.24-1.02-.11-.33-.26-.65-.44-.96-.18-.3-.38-.59-.62-.85s-.49-.5-.77-.72c-.28-.21-.58-.4-.89-.55s-.64-.28-.98-.37c-.34-.09-.69-.15-1.04-.17s-.7,0-1.05.04-.69.13-1.02.24c-.33.11-.65.26-.95.44-.3.18-.59.38-.85.62s-.5.49-.71.77l-18.99,24.89c-.18.23-.33.48-.47.73-.14.26-.25.52-.35.8s-.16.56-.21.85c-.05.29-.07.58-.07.87,0,.29.02.58.07.87.05.29.12.57.21.85.09.28.21.54.35.8.14.26.29.5.47.73l18.99,24.89c.25.33.54.62.86.89.32.26.66.49,1.04.67.37.18.76.32,1.16.41.4.09.81.14,1.22.14Z"
                />
              </g>
              <g
                id="meistgespielt_rechts_swipe"
                data-name="meistgespielt rechts swipe"
                style={{ cursor: 'pointer' }}
                onClick={handleCheapNext}
                className={isTransitioning ? 'arrow-transitioning' : ''}
              >
                <path
                  className="cls-14"
                  d="M1684.75,2947.07c-.5,0-.99-.07-1.47-.21-.48-.14-.93-.34-1.35-.6-.42-.26-.8-.58-1.14-.95-.33-.37-.61-.78-.83-1.23-.22-.45-.38-.92-.47-1.41-.09-.49-.11-.98-.06-1.48.05-.5.16-.98.35-1.44.18-.46.42-.89.73-1.29l16.54-21.64-16.54-21.64c-.21-.28-.4-.58-.55-.9-.15-.32-.28-.65-.37-.99-.09-.34-.15-.69-.17-1.04-.02-.35,0-.7.04-1.05.05-.35.13-.69.24-1.02.11-.33.26-.65.44-.96.18-.3.38-.59.62-.85s.49-.5.77-.72c.28-.21.58-.4.89-.55s.64-.28.98-.37c.34-.09.69-.15,1.04-.17s.7,0,1.05.04.69.13,1.02.24c.33.11.65.26.95.44.3.18.59.38.85.62s.5.49.71.77l18.99,24.89c.18.23.33.48.47.73.14.26.25.52.35.8s.16.56.21.85c.05.29.07.58.07.87s-.02.58-.07.87c-.05.29-.12.57-.21.85-.09.28-.21.54-.35.8-.14.26-.29.5-.47.73l-18.99,24.89c-.25.33-.54.62-.86.89-.32.26-.66.49-1.04.67-.37.18-.76.32-1.16.41-.4.09-.81.14-1.22.14Z"
                />
              </g>

              {/* Spiele unter 15€ Section */}
              <g className="cheap-games-container">
                <foreignObject x="280" y="2750" width="1327" height="415.88">
                  <div
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <AnimatePresence custom={direction}>
                      {displayedGames.map((game, index) => (
                        <motion.div
                          key={`cheap-${cheapPage}-${game.id}`}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ ...transition, delay: index * 0.1 }}
                          onClick={(e) => handleGameClick(game, e)}
                          className="game-card"
                          style={{
                            width: '315.92px',
                            height: '100%',
                            background: theme === 'dark' ? '#343a40' : '#e9ecef',
                            flexShrink: 0,
                            zIndex: 1,
                          }}
                        >
                          <img
                            src={game.background_image}
                            alt={game.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="game-info">
                            <div>{game.name}</div>
                            <div>{(game.price || 0).toFixed(2)} €</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </foreignObject>
              </g>

              {/* Most Purchased Games Section */}
              <g className="most-purchased-games-container">
                <foreignObject x="280" y="2200" width="1327" height="415.88">
                  <div
                    onMouseEnter={() => setIsMostPurchasedHovering(true)}
                    onMouseLeave={() => setIsMostPurchasedHovering(false)}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <AnimatePresence custom={direction}>
                      {displayedMostPurchased.map((game, index) => (
                        <motion.div
                          key={`popular-${mostPurchasedPage}-${game.id}`}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ ...transition, delay: index * 0.1 }}
                          onClick={(e) => handleGameClick(game, e)}
                          className="game-card"
                          style={{
                            width: '315.92px',
                            height: '100%',
                            background: theme === 'dark' ? '#343a40' : '#e9ecef',
                            flexShrink: 0,
                            zIndex: 1,
                          }}
                        >
                          <img
                            src={game.background_image}
                            alt={game.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="game-info">
                            <div>{game.name}</div>
                            <div>{(game.price || 0).toFixed(2)} €</div>
                            <div>Rating: {game.rating?.toFixed(1) || 'N/A'}</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </foreignObject>
              </g>

              <g id="Beliebte_Genres" data-name="Beliebte Genres">
                <text className="cls-12" transform="translate(236.6 1800.49)">
                  <tspan x="0" y="0">
                    {t('sections.popularGenres')}
                  </tspan>
                </text>
              </g>
              <g id="Meistgespielt">
                <text className="cls-12" transform="translate(239.27 2674.62)">
                  <tspan x="0" y="0">
                    {t('sections.cheapGames')}
                  </tspan>
                </text>
              </g>
              <g id="Kostenlose_Spiele" data-name="Kostenlose Spiele">
                <text className="cls-12" transform="translate(239.27 3209.21)">
                  <tspan x="0" y="0">
                    {t('')}
                  </tspan>
                </text>
              </g>
              <g
                id="Strategy"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate({ pathname: '/games', search: '?genre=Strategy' })}
              >
                <image
                  width="1024"
                  height="1024"
                  transform="translate(959.01 1815.16) scale(.31 .29)"
                  xlinkHref="images/strategy.png"
                />
                <rect
                  x={959.01}
                  y={1815.16}
                  width={1024 * 0.7}
                  height={1024 * 0.29}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x="512"
                  y="520"
                  transform="translate(959.01 1815.16) scale(.31 .29)"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  style={{
                    fontFamily: 'Verdana',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    fill: '#fff',
                  }}
                >
                  {t('genres.strategy')}
                </text>
              </g>
              <g id="Action" style={{ cursor: 'pointer' }} onClick={handleActionClick}>
                <image
                  width="4267"
                  height="4267"
                  transform="translate(1306.79 1812.39) scale(.07)"
                  xlinkHref="images/action.png"
                />
                <rect
                  x={1306.79}
                  y={1812.39}
                  width={4267 * 0.07}
                  height={4267 * 0.07}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x="2133.5"
                  y="2210.5"
                  transform="translate(1306.79 1812.39) scale(.07)"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  style={{
                    fontFamily: 'Verdana',
                    fontWeight: 'bold',
                    fontSize: '380px',
                    fill: '#fff',
                  }}
                >
                  {t('genres.action')}
                </text>
              </g>
              <g id="Rennspiele" style={{ cursor: 'pointer' }} onClick={handleRacingClick}>
                <image
                  width="1024"
                  height="1024"
                  transform="translate(598.36 1815.82) scale(.31 .29)"
                  xlinkHref="images/rennspiele.png"
                />
                <rect
                  x={598.36}
                  y={1815.82}
                  width={1024 * 0.31}
                  height={1024 * 0.29}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x="512"
                  y="515"
                  transform="translate(598.36 1815.82) scale(.31 .29)"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  style={{
                    fontFamily: 'Verdana',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    fill: '#fff',
                  }}
                >
                  {t('genres.racing')}
                </text>
              </g>
              <g id="Abenteuer" style={{ cursor: 'pointer' }} onClick={handleAbenteuerClick}>
                <image
                  width="1536"
                  height="1024"
                  transform="translate(182.42 1816.13) scale(.28)"
                  xlinkHref="images/abenteuer.png"
                />
                <rect
                  x={182.42}
                  y={1816.13}
                  width={1536 * 0.28}
                  height={1024 * 0.28}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x="790"
                  y="530"
                  transform="translate(182.42 1816.13) scale(.28)"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  style={{
                    fontFamily: 'Verdana',
                    fontWeight: 'bold',
                    fontSize: '80px',
                    fill: '#fff',
                  }}
                >
                  {t('genres.adventure')}
                </text>
              </g>

              {/* Neue Buttons für Sortierung */}
              <g id="sort_buttons" transform="translate(360.77 3250)">
                <foreignObject x="0" y="0" width="1200" height="415.88">
                  <div
                    style={{
                      display: 'flex',
                      gap: '30px',
                      padding: '10px',
                      background:
                        theme === 'dark' ? 'rgba(52, 58, 64, 0.98)' : 'rgba(233, 236, 239, 0.98)',
                      borderRadius: '25px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                      position: 'relative',
                      zIndex: 1,
                      maxWidth: '1000px',
                      margin: '0 auto',
                    }}
                  >
                    <button
                      onClick={() => navigate({ pathname: '/games', search: '?condition=new' })}
                      style={{
                        padding: '20px',
                        backgroundColor: sortType === 'new' ? '#007bff' : 'transparent',
                        color:
                          sortType === 'new' ? 'white' : theme === 'dark' ? '#e9ecef' : '#343a40',
                        border: `3px solid ${sortType === 'new' ? '#007bff' : theme === 'dark' ? '#e9ecef' : '#343a40'}`,
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        willChange: 'transform',
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        height: '350px',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor =
                          sortType === 'new' ? '#0056b3' : theme === 'dark' ? '#495057' : '#e9ecef';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor =
                          sortType === 'new' ? '#007bff' : 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          fontSize: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '120px',
                          height: '120px',
                          background:
                            sortType === 'new' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '50%',
                          padding: '20px',
                        }}
                      >
                        ✨
                      </div>
                      <div
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          letterSpacing: '1px',
                        }}
                      >
                        {t('condition.new')}
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          textAlign: 'center',
                          maxWidth: '80%',
                          lineHeight: '1.5',
                          opacity: 0.9,
                        }}
                      >
                        {t('condition.newDescription')}
                      </div>
                    </button>
                    <button
                      onClick={() => navigate({ pathname: '/games', search: '?condition=used' })}
                      style={{
                        padding: '20px',
                        backgroundColor: sortType === 'used' ? '#007bff' : 'transparent',
                        color:
                          sortType === 'used' ? 'white' : theme === 'dark' ? '#e9ecef' : '#343a40',
                        border: `3px solid ${sortType === 'used' ? '#007bff' : theme === 'dark' ? '#e9ecef' : '#343a40'}`,
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        willChange: 'transform',
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        height: '350px',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor =
                          sortType === 'used'
                            ? '#0056b3'
                            : theme === 'dark'
                              ? '#495057'
                              : '#e9ecef';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor =
                          sortType === 'used' ? '#007bff' : 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          fontSize: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '120px',
                          height: '120px',
                          background:
                            sortType === 'used' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '50%',
                          padding: '20px',
                        }}
                      >
                        🔄
                      </div>
                      <div
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          letterSpacing: '1px',
                        }}
                      >
                        {t('condition.used')}
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          textAlign: 'center',
                          maxWidth: '80%',
                          lineHeight: '1.5',
                          opacity: 0.9,
                        }}
                      >
                        {t('condition.usedDescription')}
                      </div>
                    </button>
                  </div>
                </foreignObject>
              </g>
              <g id="Meistgekauft">
                <text className="cls-12" transform="translate(240.77 2160.69)">
                  <tspan x="0" y="0">
                    {t('sections.bestRated')}
                  </tspan>
                </text>
              </g>
              <g
                id="meistgekauft_links_swipe_svg"
                data-name="meistgekauft links swipe svg"
                style={{ cursor: 'pointer' }}
                onClick={handleMostPurchasedPrev}
                className={isMostPurchasedTransitioning ? 'arrow-transitioning' : ''}
              >
                <path
                  className="cls-14"
                  d="M191.93,2947.07c.5,0,.99-.07,1.47-.21.48-.14.93-.34,1.35-.6.42-.26.8-.58,1.14-.95.33-.37.61-.78.83-1.23.22-.45.38-.92.47-1.41.09-.49.11-.98.06-1.48-.05-.5-.16-.98-.35-1.44-.18-.46-.42-.89-.73-1.29l-16.54-21.64,16.54-21.64c.21-.28.4-.58.55-.9.15-.32.28-.65.37-.99.09-.34.15-.69.17-1.04.02-.35,0-.7-.04-1.05-.05-.35-.13-.69-.24-1.02-.11-.33-.26-.65-.44-.96-.18-.3-.38-.59-.62-.85s-.49-.5-.77-.72c-.28-.21-.58-.4-.89-.55s-.64-.28-.98-.37c-.34-.09-.69-.15-1.04-.17s-.7,0-1.05.04-.69.13-1.02.24c-.33.11-.65.26-.95.44-.3.18-.59.38-.85.62s-.5.49-.71.77l-18.99,24.89c-.18.23-.33.48-.47.73-.14.26-.25.52-.35.8s-.16.56-.21.85c-.05.29-.07.58-.07.87,0,.29.02.58.07.87.05.29.12.57.21.85.09.28.21.54.35.8.14.26.29.5.47.73l18.99,24.89c.25.33.54.62.86.89.32.26.66.49,1.04.67.37.18.76.32,1.16.41.4.09.81.14,1.22.14Z"
                  transform="translate(0, -550)"
                />
              </g>
              <g
                id="meistgekauft_rechts_swipe_svg"
                data-name="meistgekauft rechts swipe svg"
                style={{ cursor: 'pointer' }}
                onClick={handleMostPurchasedNext}
                className={isMostPurchasedTransitioning ? 'arrow-transitioning' : ''}
              >
                <path
                  className="cls-14"
                  d="M1684.75,2947.07c-.5,0-.99-.07-1.47-.21-.48-.14-.93-.34-1.35-.6-.42-.26-.8-.58-1.14-.95-.33-.37-.61-.78-.83-1.23-.22-.45-.38-.92-.47-1.41-.09-.49-.11-.98-.06-1.48.05-.5.16-.98.35-1.44.18-.46.42-.89.73-1.29l16.54-21.64-16.54-21.64c-.21-.28-.4-.58-.55-.9-.15-.32-.28-.65-.37-.99-.09-.34-.15-.69-.17-1.04-.02-.35,0-.7.04-1.05.05-.35.13-.69.24-1.02.11-.33.26-.65.44-.96.18-.3.38-.59.62-.85s.49-.5.77-.72c.28-.21.58-.4.89-.55s.64-.28.98-.37c.34-.09.69-.15,1.04-.17s.7,0,1.05.04.69.13,1.02.24c.33.11.65.26.95.44.3.18.59.38.85.62s.5.49.71.77l18.99,24.89c.18.23.33.48.47.73.14.26.25.52.35.8s.16.56.21.85c.05.29.07.58.07.87s-.02.58-.07.87c-.05.29-.12.57-.21.85-.09.28-.21.54-.35.8-.14.26-.29.5-.47.73l-18.99,24.89c-.25.33-.54.62-.86.89-.32.26-.66.49-1.04.67-.37.18-.76.32-1.16.41-.4.09-.81.14-1.22.14Z"
                  transform="translate(0, -550)"
                />
              </g>
            </svg>
          </div>
        </main>

        <Modal show={showLoginModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('landing.modal.loginTitle')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Login />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('landing.modal.close')}
            </Button>
          </Modal.Footer>
        </Modal>

        <Chatbot />
        <div style={{ position: 'fixed', bottom: '20px', right: '90px', zIndex: 1000 }}>
          <AudioChat />
        </div>
      </div>{' '}
    </>
  );
}
