import { useNavigate } from 'react-router-dom';
import { logout, getAllOffers } from '../backend/api';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Login } from './Login';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { OfferResource } from '../Resources';
import { HelpTour } from './HelpTour';

// Styled Components für das Profilmenü
const ProfileMenu = styled.div`
  position: absolute;
  top: 80px;
  right: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  min-width: 150px;
`;

const ProfileMenuItem = styled.div`
  cursor: pointer;
  padding: 8px 12px;
  font-family: Verdana, sans-serif;
  font-weight: bold;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const LogoutMenuItem = styled(ProfileMenuItem)`
  color: #ff0000;
  margin-top: 5px;
  border-top: 1px solid #eee;
  padding-top: 10px;
`;

export function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false); // State für Help-Tour
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const helpPopupRef = useRef<HTMLDivElement>(null); // Neue Ref für Help-Popup
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<OfferResource[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Lade das Profilbild beim Initialisieren und wenn sich der Benutzer ändert
  useEffect(() => {
    if (user) {
      // Prüfe zuerst, ob der Benutzer ein Profilbild hat
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      } else {
        // Wenn nicht, versuche es aus dem localStorage zu laden
        const savedImage = localStorage.getItem(`profileImage_${user.id}`);
        if (savedImage) {
          setProfileImage(savedImage);
        } else {
          // Wenn kein Bild gefunden wurde, setze auf null
          setProfileImage(null);
        }
      }
    } else {
      // Wenn kein Benutzer angemeldet ist, setze das Profilbild auf null
      setProfileImage(null);
    }
  }, [user]);

  // Schließe das Profilmenü, wenn außerhalb geklickt wird
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Suche ausführen, wenn getippt wird
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const offers = await getAllOffers();
        const filtered = offers.filter((offer: OfferResource) =>
          offer.game?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 8));
        setShowDropdown(true);
      } catch (e) {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 200);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  // Event Listener für Fenstergrößenänderungen
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Schließe das Help-Popup, wenn außerhalb geklickt wird
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpPopupRef.current && !helpPopupRef.current.contains(event.target as Node)) {
        setShowHelpPopup(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      // Beim Abmelden das Profilbild zurücksetzen
      setProfileImage(null);
      setUser(null);
      setShowProfileMenu(false);
      navigate('/');
    } catch (err) {
      console.error('Logout fehlgeschlagen', err);
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
    setShowLanguageMenu(false);
  };

  // Funktion für dynamische Top-Position basierend auf aktueller Fenstergröße
  const getDropdownTopPosition = () => {
    if (windowWidth >= 1600) {
      return '115px'; // Desktop Vollbild - perfekt
    } else if (windowWidth >= 1400) {
      return '105px'; // Desktop verkleinert
    } else if (windowWidth >= 1200) {
      return '62px';  // Laptop/Tablet größer
    } else if (windowWidth >= 900) {
      return '85px';  // Laptop/Tablet kleiner
    } else if (windowWidth >= 768) {
      return '80px';  // Tablet
    } else {
      return '120px'; // Mobile
    }
  };

  return (
    <>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '40px' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1920 115.62"
          style={{ width: '100%', height: 'auto' }}
        >
          <defs>
            <style>
              {`.home-cls-1 { fill: #e6e5e9; }
              .home-cls-2 { fill: #f19115; }
              .home-cls-3 { fill: #fff; }
              .home-cls-4, .home-cls-5, .home-cls-6 { fill: #e0dfe5; }
              .home-cls-7, .home-cls-8 { fill: #9e9e9e; }
              .home-cls-7, .home-cls-6 { font-family: Verdana, Verdana; font-size: 18px; }
              .home-cls-9 { letter-spacing: 0em; }
              .home-cls-10, .home-cls-11 { fill: none; }
              .home-cls-11 { stroke: #e0dfe5; stroke-miterlimit: 10; stroke-width: 3px; }
              .home-cls-5 { font-family: Verdana-Bold, Verdana; font-size: 30px; font-weight: 700; }
              .home-cls-12 { letter-spacing: -.05em; }
              .home-cls-13 { fill: #5c8791; }
              .home-cls-14 { clip-path: url(#home-clippath); }
              .search-rect {
                fill: ${theme === 'dark' ? '#23242a' : '#fff'};
              }
              .search-dropdown-rect {
                fill: ${theme === 'dark' ? '#23242a' : '#fff'};
              }
              .search-icon {
                fill: ${theme === 'dark' ? '#e0dfe5' : '#9e9e9e'};
              }
              .search-text {
                fill: ${theme === 'dark' ? '#e0dfe5' : '#9e9e9e'};
                font-family: Verdana, sans-serif;
                font-size: 18px;
              }`}
            </style>
            <clipPath id="home-clippath">
              <rect className="home-cls-10" x="1221.18" y="41.13" width="69.16" height="34.58" />
            </clipPath>
          </defs>
          <g id="home-Balken">
            <g id="home-Balken_oben">
              <rect className="home-cls-13" width="1920" height="115.62" />
            </g>
          </g>

          {/* Suchfunktion direkt im SVG integriert */}
          <g id="search-function">
            <rect 
              className="search-rect" 
              x="1320" 
              y="30" 
              width="350" 
              height="54.83" 
              rx="19.82" 
              ry="19.82"
              onClick={() => setShowMobileSearch(true)}
              style={{ cursor: 'pointer' }}
            />
            <foreignObject x="1320" y="42" width="310" height="30">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder={t('nav.search')}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  color: theme === 'dark' ? '#fff' : '#23242a',
                  fontSize: '1.1rem',
                  outline: 'none',
                  padding: '0 15px',
                }}
              />
            </foreignObject>
          </g>

          {/* Anmelden Button (nur anzeigen, wenn kein Benutzer angemeldet ist) */}
          {!user && (
            <g id="home-Anmelden" onClick={() => setShowLogin(true)} style={{ cursor: 'pointer' }}>
              <g>
                <rect
                  className="home-cls-3"
                  x="1717.81"
                  y="29.97"
                  width="129.4"
                  height="54.83"
                  rx="19.82"
                  ry="19.82"
                />
                <text className="home-cls-7" transform="translate(1782.51 62.04)" textAnchor="middle">
                  <tspan x="0" y="0">
                    {t('nav.login')}
                  </tspan>
                </text>
              </g>
            </g>
          )}
          
          {/* Profil-Icon (nur anzeigen, wenn ein Benutzer angemeldet ist) */}
          {user && (
            <g 
              id="home2-profil-icon" 
              onClick={() => setShowProfileMenu(!showProfileMenu)} 
              style={{ cursor: 'pointer' }}
              transform="translate(1710, 22)"
            >
              <defs>
                <style>
                  {`.home2-cls-1 {
                    fill: ${theme === 'dark' ? '#3d3e42' : '#f19115'};
                  }
                  .home2-cls-2, .home2-cls-3 {
                    fill: #eceff1;
                  }
                  .home2-cls-2 {
                    fill-rule: evenodd;
                  }`}
                </style>
              </defs>
              {/* Immer den Hintergrundkreis anzeigen */}
              <circle id="profile-background" className="home2-cls-1" cx="38.31" cy="34.14" r="23.9"/>
              
              {profileImage ? (
                <foreignObject x="14.41" y="10.24" width="47.8" height="47.8">
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      alt="Profilbild"
                      src={profileImage}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </foreignObject>
              ) : (
                <>
                  <circle id="home2-weiß" className="home2-cls-3" cx="38.31" cy="27.13" r="10" transform="translate(-2.11 3.25) rotate(-4.73)"/>
                  <path id="home2-weiß-2" data-name="weiß" className="home2-cls-2" d="M55,50l-.4-.7c-3.2-5.5-9.2-9.2-16-9.2s-12.8,3.7-16,9.2l-.01.03-.37.66c4.2,4.2,10,6.8,16.4,6.8s12.2-2.6,16.4-6.8Z"/>
                </>
              )}
              <text 
                x="38.31" 
                y="70" 
                textAnchor="middle" 
                fill="#eceff1" 
                style={{ 
                  fontFamily: 'Verdana, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: '10px' 
                }}
              >
                {user.username}
              </text>
            </g>
          )}
          {/* Ausgang-Icon für Logout (nur anzeigen, wenn ein Benutzer angemeldet ist) */}
          {user && (
            <g 
              id="home3-ausgang-icon" 
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
              transform="translate(1797, 34.6) scale(0.3)"
            >
              <defs>
                <style>
                  {`.home3-cls-1 {
                    fill: #ffffff;
                  }`}
                </style>
              </defs>
              {/* Transparenter Hintergrund für bessere Klickbarkeit */}
              <rect 
                x="0" 
                y="0" 
                width="150" 
                height="150" 
                fill="transparent"
              />
              <g id="Ausgang-2" data-name="Ausgang">
                <path className="home3-cls-1" d="M81.82,150H20.45c-.67,0-1.34-.03-2-.1s-1.33-.16-1.99-.29-1.31-.29-1.95-.49c-.64-.19-1.27-.42-1.89-.68-.62-.26-1.22-.54-1.81-.86-.59-.32-1.16-.66-1.72-1.03-.56-.37-1.09-.77-1.61-1.2-.52-.43-1.01-.87-1.49-1.35-.47-.47-.92-.97-1.35-1.49-.42-.52-.82-1.06-1.2-1.61-.37-.56-.72-1.13-1.03-1.72-.32-.59-.6-1.2-.86-1.81-.26-.62-.48-1.25-.68-1.89-.19-.64-.36-1.29-.49-1.95-.13-.66-.23-1.32-.29-1.99-.07-.67-.1-1.33-.1-2V20.45c0-.67.03-1.34.1-2,.07-.67.16-1.33.29-1.99.13-.66.29-1.31.49-1.95.19-.64.42-1.27.68-1.89.26-.62.54-1.22.86-1.81.32-.59.66-1.16,1.03-1.72s.77-1.09,1.2-1.61c.43-.52.87-1.01,1.35-1.49.47-.47.97-.92,1.49-1.35s1.06-.82,1.61-1.2c.56-.37,1.13-.72,1.72-1.03.59-.32,1.2-.6,1.81-.86.62-.26,1.25-.48,1.89-.68.64-.19,1.29-.36,1.95-.49.66-.13,1.32-.23,1.99-.29.67-.07,1.33-.1,2-.1h61.36c.67,0,1.34.03,2,.1.67.07,1.33.16,1.99.29.66.13,1.31.29,1.95.49.64.19,1.27.42,1.89.68.62.26,1.22.54,1.81.86s1.16.66,1.72,1.03c.56.37,1.09.77,1.61,1.2s1.01.87,1.49,1.35.92.97,1.35,1.49c.42.52.82,1.06,1.2,1.61.37.56.72,1.13,1.03,1.72.32.59.6,1.2.86,1.81.26.62.48,1.25.68,1.89.19.64.36,1.29.49,1.95.13.66.23,1.32.29,1.99.07.67.1,1.33.1,2v23.86c0,.45-.04.89-.13,1.33s-.22.87-.39,1.28c-.17.41-.38.81-.63,1.18-.25.37-.53.72-.85,1.03-.32.32-.66.6-1.03.85-.37.25-.77.46-1.18.63-.41.17-.84.3-1.28.39-.44.09-.88.13-1.33.13s-.89-.04-1.33-.13c-.44-.09-.87-.22-1.28-.39s-.81-.38-1.18-.63c-.37-.25-.72-.53-1.03-.85-.32-.32-.6-.66-.85-1.03-.25-.37-.46-.77-.63-1.18-.17-.41-.3-.84-.39-1.28s-.13-.88-.13-1.33v-23.86c0-.45-.04-.89-.13-1.33-.09-.44-.22-.87-.39-1.28-.17-.41-.38-.81-.63-1.18-.25-.37-.53-.72-.85-1.03-.32-.32-.66-.6,1.03-.85.37-.25.77-.46,1.18-.63s.84-.3,1.28-.39c.44-.09.88-.13,1.33-.13s.89.04,1.33.13c.44.09.87.22,1.28.39.41.17.81.38,1.18.63.37.25.72.53,1.03.85.32.32.6.66.85,1.03.25.37.46.77.63,1.18.17.41.3.84.39,1.28.09.44.13.88.13,1.33,0,.45-.04.89-.13,1.33-.09.44-.22.87-.39,1.28s-.38.81-.63,1.18c-.25.37-.53.72-.85,1.03-.32.32-.66.6-1.03.85-.37.25-.77.46-1.18.63-.41.17-.84.3-1.28.39s-.88.13-1.33.13Z"/>
                <path className="home3-cls-1" d="M139.77,81.82H50.52c-.45,0-.89-.04-1.33-.13-.44-.09-.87-.22-1.28-.39-.41-.17-.81-.38-1.18-.63-.37-.25-.72-.53-1.03-.85-.32-.32-.6-.66-.85-1.03-.25-.37-.46-.77-.63-1.18s-.3-.84-.39-1.28c-.09-.44-.13-.88-.13-1.33s.04-.89.13-1.33c.09-.44.22-.87.39-1.28.17-.41.38-.81.63-1.18.25-.37.53-.72.85-1.03s.66-.6,1.03-.85.77-.46,1.18-.63c.41-.17.84-.3,1.28-.39.44-.09.88-.13,1.33-.13h89.25c.45,0,.89.04,1.33.13s.87.22,1.28.39c.41.17.81.38,1.18.63.37.25.72.53,1.03.85s.6.66.85,1.03c.25.37.46.77.63,1.18.17.41.3.84.39,1.28.09.44.13.88.13,1.33,0,.45-.04.89-.13,1.33-.09.44-.22.87-.39,1.28s-.38.81-.63,1.18c-.25.37-.53.72-.85,1.03-.32.32-.66.6-1.03.85-.37.25-.77.46-1.18.63-.41.17-.84.3-1.28.39s-.88.13-1.33.13Z"/>
                <path className="home3-cls-1" d="M122.73,102.27c-.67,0-1.33-.1-1.97-.3-.64-.2-1.24-.48-1.8-.86-.56-.37-1.05-.82-1.48-1.34-.43-.52-.77-1.09-1.02-1.71-.26-.62-.42-1.27-.48-1.94-.07-.67-.03-1.33.1-1.99.13-.66.35-1.29.67-1.88s.71-1.13,1.18-1.61l15.61-15.65-15.65-15.65c-.32-.32-.6-.66-.85-1.03-.25-.37-.46-.77-.63-1.18-.17-.41-.3-.84-.39-1.28-.09-.44-.13-.88-.13-1.33s.04-.89.13-1.33c.09-.44.22-.87.39-1.28.17-.41.38-.81.63-1.18.25-.37.53-.72.85-1.03.32-.32.66-.6,1.03-.85.37-.25.77-.46,1.18-.63s.84-.3,1.28-.39c.44-.09.88-.13,1.33-.13s.89.04,1.33.13c.44.09.87.22,1.28.39s.81.38,1.18.63c.37.25.72.53,1.03.85l20.45,20.45c.32.32.6.66.85,1.03.25.37.46.77.63,1.18.17.41.3.84.39,1.28.09.44.13.88.13,1.33s-.04.89-.13,1.33c-.09.44-.22.87-.39,1.28-.17.41-.38.81-.63,1.18-.25.37-.53.72-.85,1.03l-20.45,20.45c-.64.64-1.37,1.13-2.2,1.48-.83.35-1.7.52-2.6.53Z"/>
              </g>
            </g>
          )}
         
          <g
            id="home-Sprache_icon_oben"
            data-name="Sprache icon oben"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            style={{ cursor: 'pointer' }}
            transform="scale(1.2) translate(-315, -9.5)"
          >
            <circle cx="1884.3" cy="56.75" r="20" fill="transparent" />
            <path
              className="home-cls-4"
              d="M1892.13,60.34c.14-1.17.25-2.37.25-3.59s-.1-2.41-.25-3.59h6.05c.3,1.15.48,2.35.48,3.59s-.17,2.44-.48,3.59h-6.05ZM1888.97,70.31c1.08-2,1.89-4.14,2.47-6.38h5.29c-1.73,2.97-4.47,5.25-7.76,6.38h0ZM1888.51,60.34h-8.39c-.17-1.17-.29-2.37-.29-3.59s.12-2.41.29-3.59h8.39c.17,1.17.29,2.37.29,3.59s-.12,2.41-.29,3.59ZM1884.31,71.04c-1.49-2.15-2.65-4.55-3.42-7.11h6.85c-.77,2.56-1.94,4.96-3.42,7.11ZM1877.18,49.58h-5.29c1.72-2.97,4.47-5.26,7.76-6.39-1.08,2-1.89,4.15-2.47,6.39ZM1871.89,63.93h5.29c.58,2.24,1.4,4.39,2.47,6.39-3.3-1.13-6.04-3.42-7.76-6.39h0ZM1870.43,60.34c-.3-1.15-.47-2.35-.47-3.59s.17-2.44.47-3.59h6.05c-.14,1.17-.24,2.37-.24,3.59s.1,2.41.25,3.59h-6.06ZM1884.31,42.47c1.5,2.15,2.66,4.55,3.42,7.11h-6.85c.76-2.56,1.93-4.96,3.42-7.11ZM1896.72,49.58h-5.29c-.58-2.24-1.4-4.39-2.47-6.38,3.3,1.13,6.04,3.42,7.76,6.38ZM1884.3,38.82c-9.91,0-17.92,8.02-17.92,17.93s8.02,17.93,17.92,17.93,17.94-8.02,17.94-17.93-8.03-17.93-17.94-17.93Z"
            />
            {/* Abgerundetes Rechteck mit Sprachcode */}
            <rect
              x="1872.3"
              y="50.75"
              width="24"
              height="12"
              rx="6"
              ry="6"
              fill={theme === 'dark' ? '#34353b' : '#f19115'}
            />
            <text
              x="1884.3"
              y="57.3"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              style={{
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 'bold',
                fontSize: '9px'
              }}
            >
              {i18n.language.substring(0, 2).toUpperCase()}
            </text>
          </g>
          <g
            id="home-Entdecken"
            onClick={() => handleNavigation('/games')}
            style={{ cursor: 'pointer' }}
          >
            <text
              className="home-cls-6"
              transform={`translate(${i18n.language === 'en' ? 524 : 520} 67.41)`}
              textAnchor="middle"
            >
              <tspan x="0" y="0">
                {t('nav.games')}
              </tspan>
            </text>
          </g>
          <g
            id="home-support-oben"
            data-name="Support oben"
            onClick={() => handleNavigation('/about')}
            style={{ cursor: 'pointer' }}
          >
            <text
              className="home-cls-6"
              transform={`translate(${i18n.language === 'en' ? 690 : 720} 67.41)`}
              textAnchor="middle"
            >
              <tspan x="0" y="0">
                {t('nav.about')}
              </tspan>
            </text>
          </g>
          <g
            id="home-Verkaufen_2"
            data-name="Verkaufen"
            onClick={() => handleNavigation('/sell')}
            style={{ cursor: 'pointer' }}
          >
            <text
              className="home-cls-6"
              transform={`translate(${i18n.language === 'en' ? 605 : 615} 67.41)`}
              textAnchor="middle"
            >
              <tspan x="0" y="0">
                {t('nav.sell')}
              </tspan>
            </text>
          </g>
          <g id="home-Warenkorb" transform="translate(-37, 0)"
            onClick={() => handleNavigation('/cart')}
            style={{ cursor: 'pointer' }}>
            <g>
              <g>
                <path
                  className="home-cls-4" 
                  d="M848.74,53l-2.33,10.09c-.06.28-.17.55-.33.79-.15.24-.34.46-.57.64s-.48.32-.75.41c-.27.09-.55.14-.84.14h-15.97l-2.84-12.07h23.63ZM827.08,67.26h16.84c.54,0,1.06-.09,1.57-.26.51-.18.97-.43,1.39-.77s.77-.73,1.06-1.18c.29-.46.49-.94.61-1.47l2.64-11.43c.04-.16.04-.33,0-.49s-.11-.31-.21-.44c-.1-.13-.23-.23-.38-.31-.15-.07-.31-.11-.48-.11h-25.52l-.83-3.54c-.06-.25-.19-.45-.39-.61-.2-.16-.43-.24-.68-.24h-3.29c-.15,0-.29.03-.42.08-.13.06-.25.13-.36.24-.1.1-.18.22-.24.36-.06.13-.08.27-.08.42,0,.15.03.29.08.42.06.13.13.25.24.36.1.1.22.18.36.24.13.06.27.08.42.08Z"
                />
                <path
                  className="home-cls-4"
                  d="M829.27,77.14c-.15,0-.29-.03-.42-.08-.13-.06-.25-.13-.36-.24s-.18-.22-.24-.36c-.06-.13-.08-.27-.08-.42,0-.15.03-.29.08-.42.06-.13.13-.25.24-.36s.22-.18.36-.24c.13-.06.27-.08.42-.08s.29.03.42.08c.13.06.25.13.36.24s.18.22.24.36c.06.13.08.27.08.42,0,.15-.03.29-.08.42-.06.13-.13.25-.24.36s-.22.18-.36.24c-.13.06-.27.08-.42.08ZM829.27,72.75c-.22,0-.43.02-.64.06-.21.04-.42.1-.62.19-.2.08-.39.18-.57.3-.18.12-.35.26-.5.41-.15.15-.29.32-.41.5-.12.18-.22.37-.3.57-.08.2-.15.41-.19.62s-.06.43-.06.64c0,.22.02.43.06.64.04.21.1.42.19.62.08.2.18.39.3.57.12.18.26.35.41.5.15.15.32.29.5.41.18.12.37.22.57.3.2.08.41.15.62.19.21.04.43.06.64.06s.43-.02.64-.06c.21-.04.42-.1.62-.19.2-.08.39-.18.57-.3.18-.12.35-.26.5-.41s.29-.32.41-.5c.12-.18.22-.37.3-.57.08-.2.15-.41.19-.62.04-.21.06-.43.06-.64,0-.22-.02-.43-.06-.64s-.1-.42-.19-.62c-.08-.2-.18-.39-.3-.57s-.26-.35-.41-.5c-.15-.15-.32-.29-.5-.41-.18-.12-.37-.22-.57-.3s-.41-.15-.62-.19c-.21-.04-.43-.06-.64-.06Z"
                />
                <path
                  className="home-cls-4"
                  d="M842.44,77.14c-.15,0-.29-.03-.42-.08-.13-.06-.25-.13-.36-.24-.1-.1-.18-.22-.24-.36-.06-.13-.08-.27-.08-.42,0-.15.03-.29.08-.42.06-.13.13-.25.24-.36.1-.1.22-.18.36-.24.13-.06.27-.08.42-.08ZM842.44,72.75c-.22,0-.43.02-.64.06-.21.04-.42.1-.62.19s-.39.18-.57.3-.35.26-.5.41-.29.32-.41.5c-.12.18-.22.37-.3.57s-.15.41-.19.62-.06.43-.06.64c0,.22.02.43.06.64.04.21.1.42.19.62.08.2.18.39.3.57.12.18.26.35.41.5.15.15.32.29.5.41.18.12.37.22.57.3.2.08.41.15.62.19.21.04.43.06.64.06s.43-.02.64-.06c.21-.04.42-.1.62-.19.2-.08.39-.18.57-.3.18-.12.35-.26.5-.41s.29-.32.41-.5c.12-.18.22-.37.3-.57.08-.2.15-.41.19-.62.04-.21.06-.43.06-.64,0-.22-.02-.43-.06-.64s-.1-.42-.19-.62c-.08-.2-.18-.39-.3-.57s-.26-.35-.41-.5c-.15-.15-.32-.29-.5-.41-.18-.12-.37-.22-.57-.3s-.41-.15-.62-.19c-.21-.04-.43-.06-.64-.06Z"
                />
              </g>
              <circle className="home-cls-4" cx="848.74" cy="51.44" r="6.12" />
            </g>
          </g>

          {/* Hilfe-Icon zwischen Warenkorb und Wiki */}
          <g 
            id="home-Help" 
            transform="translate(-5, 8)"    // Geändert von 15 auf 8 (gleiche Höhe wie Wiki)
            onClick={() => setShowHelpPopup(true)}
            style={{ cursor: 'pointer' }}
          >
            <g>
              {/* Kreis für das Fragezeichen */}
              <circle 
                cx="860" 
                cy="50" 
                r="16"
                fill={theme === 'dark' ? '#e0dfe5' : '#e0dfe5'}
                stroke={theme === 'dark' ? '#b0afb5' : '#b0afb5'}
                strokeWidth="2"
              />
              
              {/* Fragezeichen */}
              <text 
                x="860" 
                y="53"
                textAnchor="middle" 
                dominantBaseline="middle"
                fill={theme === 'dark' ? '#f19115' : '#f19115'}
                style={{
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                ?
              </text>
              
              {/* Hilfe-Text unter dem Icon */}
              <text 
                x="860" 
                y="78.5" 
                textAnchor="middle" 
                dominantBaseline="middle"
                fill={theme === 'dark' ? '#e0dfe5' : '#e0dfe5'}
                className="home-cls-6"
                style={{
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                Hilfe
              </text>
              
              {/* Hover-Effekt Bereich */}
              <rect 
                x="840" 
                y="30" 
                width="40" 
                height="50" 
                fill="transparent"
                className="help-hover-area"
                style={{
                  transition: 'all 0.2s ease',
                }}
              />
            </g>
          </g>

          {/* Wiki-Logo */}
          <g 
            id="home-Wiki" 
            transform="translate(20, 8)"
            onClick={() => handleNavigation('/wiki')}
            style={{ cursor: 'pointer' }}
          >
            <g>
              {/* Hauptbuch */}
              <rect 
                className="home-cls-4" 
                x="875" 
                y="38" 
                width="22" 
                height="28" 
                rx="3" 
                ry="3"
                fill={theme === 'dark' ? '#e0dfe5' : '#e0dfe5'}
                stroke={theme === 'dark' ? '#b0afb5' : '#b0afb5'}
                strokeWidth="1"
              />
              
              {/* Buchrücken - Schatten für Tiefe */}
              <rect 
                className="home-cls-4" 
                x="872" 
                y="35" 
                width="22" 
                height="28" 
                rx="3" 
                ry="3"
                fill={theme === 'dark' ? '#c0bfc5' : '#c0bfc5'}
                stroke={theme === 'dark' ? '#a0a0a5' : '#a0a0a5'}
                strokeWidth="1"
              />
              
              {/* Vorderes Buch */}
              <rect 
                className="home-cls-4" 
                x="874" 
                y="37" 
                width="22" 
                height="28" 
                rx="3" 
                ry="3"
                fill={theme === 'dark' ? '#f0eff5' : '#f0eff5'}
                stroke={theme === 'dark' ? '#d0cfd5' : '#d0cfd5'}
                strokeWidth="1.2"
              />
              
              {/* Buchseiten - Innere Linien */}
              <line 
                x1="877" 
                y1="42" 
                x2="891" 
                y2="42" 
                stroke={theme === 'dark' ? '#a0a0a5' : '#a0a0a5'}
                strokeWidth="0.8"
              />
              <line 
                x1="877" 
                y1="46" 
                x2="889" 
                y2="46" 
                stroke={theme === 'dark' ? '#a0a0a5' : '#a0a0a5'}
                strokeWidth="0.8"
              />
              <line 
                x1="877" 
                y1="50" 
                x2="891" 
                y2="50" 
                stroke={theme === 'dark' ? '#a0a0a5' : '#a0a0a5'}
                strokeWidth="0.8"
              />
              <line 
                x1="877" 
                y1="54" 
                x2="889" 
                y2="54" 
                stroke={theme === 'dark' ? '#a0a0a5' : '#a0a0a5'}
                strokeWidth="0.8"
              />
              <line 
                x1="877" 
                y1="58" 
                x2="891" 
                y2="58" 
                stroke={theme === 'dark' ? '#a0a0a5' : '#a0a0a5'}
                strokeWidth="0.8"
              />
              
              {/* Bookmark - kleines Detail */}
              <rect 
                x="892" 
                y="37" 
                width="3" 
                height="12" 
                fill={theme === 'dark' ? '#5c8791' : '#5c8791'}
              />
              <polygon 
                points="892,49 895,49 893.5,52" 
                fill={theme === 'dark' ? '#5c8791' : '#5c8791'}
              />
              
              {/* Wiki-Text unter dem Buch */}
              <text 
                x="885" 
                y="78" 
                textAnchor="middle" 
                dominantBaseline="middle"
                fill={theme === 'dark' ? '#e0dfe5' : '#e0dfe5'}
                className="home-cls-6"
                style={{
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                Wiki
              </text>
              
              {/* Hover-Effekt Bereich */}
              <rect 
                x="870" 
                y="32" 
                width="30" 
                height="50" 
                fill="transparent"
                className="wiki-hover-area"
                style={{
                  transition: 'all 0.2s ease',
                }}
              />
            </g>
          </g>

          <g
            id="home-Lightmode"
            onClick={toggleTheme}
            style={{ cursor: 'pointer' }}
          >
            <path
              className="home-cls-1"
              d="M1273.1,75.71h-34.66c-.57,0-1.13-.03-1.7-.08-.56-.06-1.13-.14-1.68-.25-.56-.11-1.11-.25-1.65-.41s-1.08-.35-1.6-.57c-.52-.22-1.04-.46-1.54-.73-.5-.27-.99-.56-1.46-.87-.47-.31-.93-.65-1.37-1.01-.44-.36-.86-.74-1.26-1.14-.4-.4-.78-.82-1.14-1.26-.36-.4-.7-.82-1.01-1.36-.32-.47-.61-.96-.87-1.45-.27-.5-.51-1.01-.73-1.53-.22-.52-.41-1.06-.57-1.6-.16-.54-.3-1.09-.41-1.65-.11-.56-.19-1.11-.25-1.68-.06-.56-.08-1.13-.08-1.69s.03-1.13.08-1.69.14-1.12.25-1.68c.11-.56.25-1.1.41-1.65.16-.54.36-1.07.57-1.6s.46-1.03.73-1.53.56-.98.87-1.46c.32-.47.65-.92,1.01-1.36.36-.44.74-.86,1.14-1.26.4-.4.82-.78,1.26-1.14.44-.36.89-.7,1.37-1.01.47-.31.96-.61,1.46-.87.5-.27,1.01-.51,1.54-.73.52-.22,1.06-.41,1.6-.57.54-.16,1.09-.3,1.65-.41.56-.11,1.12-.19,1.68-.25.56-.06,1.13-.08,1.7-.08h34.66c.57,0,1.13.03,1.7.08.56.06,1.13.14,1.68.25.56.11,1.11.25,1.65.41.54.16,1.08.35,1.6.57.52.22,1.04.46,1.54.73.5.27.99.56,1.46.87.47.31.93.65,1.37,1.01.44.36.86.74,1.26,1.14.4.4.78.82,1.14,1.26.36.44.7.89,1.01,1.36.32.47.61.96.87,1.45.27.5.51,1.01.73,1.53.22.52.41,1.06.57,1.6.16.54.3,1.09.41,1.65s.19,1.11.25,1.68c.06.56.08,1.13.08,1.69,0,.57-.03,1.13-.08,1.69-.06.56-.14,1.12-.25,1.68s-.25,1.1-.41,1.65c-.16.54-.36,1.07-.57,1.6-.22.52-.46,1.03-.73,1.53-.27.5-.56.98-.87,1.45-.32.47-.65.92-1.01,1.36-.36.44-.74.86-1.14,1.26-.4.4-.82.78-1.26,1.14-.44.36-.89.7-1.37,1.01-.47.31-.96.61-1.46.87-.5.27-1.01.51-1.54.73-.52.22-1.06.41-1.6.57-.54.16-1.09.3-1.65.41-.56.11-1.12.19-1.68.25-.56.06-1.13.08-1.7.08Z"
            />
            <path 
              className="home-cls-8" 
              d="M1224.58,58.42c0,.45.02.9.07,1.36.04.45.11.9.2,1.34s.2.88.33,1.32c.13.43.28.86.46,1.28.17.42.37.83.58,1.23.21.4.45.79.7,1.16.25.38.52.74.81,1.09.29.35.59.69.91,1.01.32.32.66.62,1.01.91s.72.56,1.09.81.77.48,1.17.7c.4.21.81.41,1.23.58.42.17.85.33,1.28.46.43.13.87.24,1.32.33.45.09.89.15,1.35.2s.9.07,1.36.07.91-.02,1.36-.07c.45-.04.9-.11,1.35-.2.45-.09.89-.2,1.32-.33.43-.13.86-.28,1.28-.46.42-.17.83-.37,1.23-.58.4-.21.79-.45,1.17-.7.38-.25.74-.52,1.09-.81.35-.29.69-.59,1.01-.91.32-.32.63-.66.91-1.01.29-.35.56-.71.81-1.09.25-.38.49-.76.7-1.16.21-.4.41-.81.58-1.23.17-.42.33-.84.46-1.28.13-.43.24-.87.33-1.32.09-.44.16-.89.2-1.34.04-.45.07-.9.07-1.36s-.02-.9-.07-1.36c-.04-.45-.11-.9-.2-1.34-.09-.44-.2-.88-.33-1.32-.13-.43-.28-.86-.46-1.28-.17-.42-.37-.83-.58-1.23-.21-.4-.45-.79-.7-1.16-.25-.38-.52-.74-.81-1.09-.29-.35-.59-.69-.91-1.01-.32-.32-.66-.62-1.01-.91-.35-.29-.72-.56-1.09-.81-.38-.25-.77-.48-1.17-.7-.4-.21-.81-.41-1.23-.58-.42-.17-.85-.33-1.28-.46-.43-.13-.87-.24-1.32-.33-.45-.09-.89-.15-1.35-.2-.45-.04-.9-.07-1.36-.07s-.91.02-1.36.07c-.45.04-.9.11-1.35.2-.45.09-.89.2-1.32.33-.43.13-.86.28-1.28.46-.42.17-.83.37-1.23.58-.4.21-.79.45-1.17.7s-.74.52-1.09.81c-.35.29-.69.59-1.01.91-.32.32-.63.66-.91,1.01-.29.35-.56.71-.81,1.09-.25.38-.49.76-.7,1.16-.21.4-.41.81-.58,1.23-.17.42-.33.84-.46,1.28-.13.43-.24.87-.33,1.32-.09.44-.16.89-.2,1.34-.04.45-.07.9-.07,1.36Z"
              style={{
                transform: `translateX(${theme === 'dark' ? '34px' : '0px'})`,
                transition: 'transform 0.3s',
                fill: theme === 'dark' ? '#25252c' : '#9e9e9e'
              }}
            />
          </g>
          <g id="home-Home" onClick={() => handleNavigation('/')} style={{ cursor: 'pointer' }}>
            <text className="home-cls-6" transform="translate(440 67.41)" textAnchor="middle">
              <tspan x="0" y="0">
                Home
              </tspan>
            </text>
          </g>
          <g
            id="home-GAMECOMPASS_Oben"
            data-name="GAMECOMPASS Oben"
            onClick={() => handleNavigation('/')}
            style={{ cursor: 'pointer' }}
          >
            <text className="home-cls-5" transform="translate(114.78 70.39)">
              <tspan x="0" y="0">
                GAMECOMPASS
              </tspan>
            </text>
          </g>
          <g
            id="home-Logo_oben"
            data-name="Logo oben"
            onClick={() => handleNavigation('/')}
            style={{ cursor: 'pointer' }}
          >
            <g id="home-Logo_oben-2" data-name="Logo oben">
              <circle className="home-cls-11" cx="57.06" cy="60.78" r="23.64" />
              <polygon
                className="home-cls-4"
                points="57.12 26.34 55 36.55 59.25 36.55 57.12 26.34"
              />
              <polygon
                className="home-cls-4"
                points="57.18 94.97 59.3 84.76 55.06 84.76 57.18 94.97"
              />
              <polygon
                className="home-cls-4"
                points="23.1 60.47 33.31 62.59 33.31 58.35 23.1 60.47"
              />
              <polygon
                className="home-cls-4"
                points="90.91 60.47 80.7 58.35 80.7 62.59 90.91 60.47"
              />
              <polygon
                className="home-cls-4"
                points="78.94 39.1 72.59 42.45 75.59 45.45 78.94 39.1"
              />
              <polygon
                className="home-cls-4"
                points="35.71 38.9 38.77 45.39 41.9 42.53 35.71 38.9"
              />
              <polygon
                className="home-cls-4"
                points="36.06 81.98 42.41 78.63 39.41 75.63 36.06 81.98"
              />
              <polygon
                className="home-cls-4"
                points="78.2 82.08 74.85 75.73 71.85 78.73 78.2 82.08"
              />
              <g>
                <path
                  className="home-cls-2"
                  d="M51.69,58.68s-.01.07-.04.1c-.03.03-.06.04-.1.04h-1.65c-.09,0-.18.02-.26.05-.08.03-.16.08-.22.15-.06.06-.11.14-.15.22-.03.08-.05.17-.05.26v1.65s-.01.07-.04.1-.06.04-.1.04h-1.65s-.07-.01-.1-.04c-.03-.03-.04-.06-.04-.1v-1.65c0-.09-.02-.18-.05-.26-.03-.08-.08-.16-.15-.22-.06-.06-.14-.11-.22-.15-.08-.03-.17-.05-.26-.05h-1.65s-.07-.01-.1-.04-.04-.06-.04-.1v-1.65s.01-.07.04-.1c.03-.03.06-.04.1-.04h1.65c.09,0,.18-.02.26-.05.08-.03.16-.08.22-.15.06-.06.11-.14.15-.22.03-.08.05-.17.05-.26v-1.65s.01-.07.04-.1.06-.04.1-.04h1.65s.07.01.1.04c.03.03.04.06.04.1v1.65ZM51.55,55.52h-.96v-.96c0-.1,0-.2-.03-.3-.02-.1-.05-.19-.09-.28-.04-.09-.08-.18-.14-.26-.06-.08-.12-.16-.19-.23-.07-.07-.15-.13-.23-.19-.08-.06-.17-.1-.26-.14s-.19-.07-.28-.09c-.1-.02-.2-.03-.29-.03h-1.65c-.1,0-.2,0-.29.03-.1.02-.19.05-.28.09-.09.04-.18.08-.26.14-.08.06-.16.12-.23.19s-.13.15-.19.23c-.06.08-.1.17-.14.26-.04.09-.07.19-.09.28-.02.1-.03.2-.03.3v.96h-.96c-.1,0-.2,0-.29.03-.1.02-.19.05-.28.09-.09.04-.18.08-.26.14-.08.06-.16.12-.23.19-.07.07-.13.15-.19.23-.06.08-.1.17-.14.26-.04.09-.07.19-.09.28-.02.1-.03.2-.03.3v1.65c0,.1,0,.2.03.3.02.1.05.19.09.28.04.09.08.18.14.26.06.08.12.16.19.23.07.07.15.13.23.19.08.06.17.1.26.14.09.04.19.07.28.09s.2.03.29.03h.96v.96c0,.1,0,.2.03.3.02.1.05.19.09.28s.08.18.14.26c.06.08.12.16.19.23.07.07.15.13.23.19.08.06.17.1.26.14.09.04.19.07.28.09.1.02.2.03.29.03h1.65c.1,0,.2,0,.29-.03s.19-.05.28-.09c.09-.04.18-.08.26-.14.08-.06.16-.12.23-.19.07-.07.13-.15.19-.23.06-.08.1-.17.14-.26.04-.09.07-.19.09-.28.02-.1.03-.2.03-.3v-.96h.96c.1,0,.2,0,.29-.03.1-.02.19-.05.28-.09s.18-.08.26-.14c.08-.06.16-.12.23-.19.07-.07.13-.15.19-.23.06-.08.1-.17.14-.26.04-.09.07-.19.09-.28s.03-.2.03-.3v-1.65c0-.1,0-.2-.03-.3-.02-.1-.05-.19-.09-.28s-.08-.18-.14-.26c-.06-.08-.12-.16-.19-.23-.07-.07-.15-.13-.23-.19-.08-.06-.17-.1-.26-.14s-.19-.07-.28-.09c-.1-.02-.2-.03-.29-.03Z"
                />
                <path
                  className="home-cls-2"
                  d="M64.89,62.75c-.12,0-.24-.03-.35-.08-.11-.05-.21-.12-.29-.2-.08-.09-.15-.19-.19-.3-.04-.11-.07-.23-.07-.35s.03-.24.07-.35c.05-.11.11-.21.2-.3.09-.09.18-.15.3-.2.11-.05.23-.07.35-.07.12,0,.24.03.35.08.11.05.21.12.29.2.08.09.15.19.19.3.04.11.07.23.07.35,0,.12-.03.24-.07.35-.05.11-.11.21-.2.29-.09.08-.19.15-.3.19-.11.04-.23.07-.35.07h0ZM64.94,59.53c-.15,0-.3.01-.45.04-.15.03-.29.07-.43.12-.14.06-.27.12-.4.21-.13.08-.24.17-.35.28-.11.1-.2.22-.29.34-.09.12-.16.25-.22.39-.06.14-.11.28-.14.43-.03.15-.05.3-.05.45,0,.15,0,.3.04.45.03.15.07.29.12.43.05.14.12.27.2.4.08.13.17.24.28.35.1.11.22.21.34.29.12.09.25.16.39.22.14.06.28.11.43.14.15.03.29.05.44.05,3.02-.06,3.13-4.47.08-4.6Z"
                />
                <path
                  className="home-cls-2"
                  d="M60.91,58.76c-.12,0-.23-.03-.34-.08-.11-.05-.2-.12-.28-.21-.08-.09-.14-.19-.19-.3-.04-.11-.06-.23-.06-.35,0-.12.03-.23.08-.34.05-.11.11-.21.2-.29.09-.08.18-.15.29-.19.11-.04.23-.07.35-.07.12,0,.24.02.35.07s.21.12.3.2c.09.09.15.19.2.3.04.11.07.23.06.36,0,.12-.03.24-.08.35-.05.11-.12.21-.2.29-.09.08-.19.15-.3.19-.11.04-.23.07-.35.07ZM60.98,55.55c-3.04.03-3.09,4.54-.05,4.58.15,0,.3-.02.44-.05s.29-.07.42-.13c.14-.06.27-.13.39-.21.12-.08.24-.18.34-.28.11-.11.2-.22.28-.34.08-.12.15-.25.21-.39.06-.14.1-.28.13-.42.03-.15.05-.29.05-.44s-.01-.3-.04-.44-.07-.29-.12-.43c-.06-.14-.12-.27-.2-.4-.08-.13-.17-.24-.28-.35s-.22-.2-.34-.29-.25-.16-.39-.22c-.14-.06-.28-.11-.42-.14-.15-.03-.29-.05-.44-.05Z"
                />
                <path
                  className="home-cls-2"
                  d="M68.84,58.76c-.12,0-.24-.03-.35-.08-.11-.05-.21-.12-.29-.2s-.15-.19-.19-.3c-.04-.11-.06-.23-.06-.35,0-.12.03-.24.08-.35.05-.11.11-.21.2-.29.09-.08.19-.15.3-.19.11-.04.23-.07.35-.07.12,0,.24.03.35.08.11.05.21.12.29.2.08.09.15.19.19.3.04.11.06.23.06.35,0,.12-.03.24-.08.35-.05.11-.12.21-.2.29-.09.08-.19.15-.3.19-.11.04-.23.07-.35.07ZM68.9,55.55c-3.03.08-3.1,4.51-.03,4.58,3.01-.05,3.02-4.48.03-4.58Z"
                />
                <path
                  className="home-cls-2"
                  d="M64.26,53.22c.13-.13.29-.21.47-.24.18-.03.36-.01.53.06.17.07.31.18.41.34.1.15.16.32.16.51,0,.12-.03.24-.08.35-.05.11-.12.21-.2.3-.09.09-.19.15-.3.2s-.23.08-.35.08c-.19,0-.36-.06-.51-.17-.15-.11-.26-.25-.33-.42-.07-.17-.08-.35-.05-.54.04-.18.12-.34.26-.47h0ZM64.88,56.19c.15,0,.3-.02.45-.04.15-.03.29-.07.43-.13.14-.06.27-.13.4-.21.12-.08.24-.18.35-.28.11-.11.2-.22.29-.35s.16-.26.21-.39.1-.28.13-.43c.03-.15.05-.3.05-.45s-.01-.3-.04-.45c-.03-.15-.07-.29-.12-.43-.06-.14-.12-.27-.2-.4-.08-.13-.17-.24-.28-.35-.1-.11-.22-.21-.34-.29-.12-.09-.25-.16-.39-.22-.14-.06-.28-.11-.43-.14s-.29-.05-.44-.06c-.15,0-.3.02-.45.04-.15.03-.29.07-.43.13-.14.06-.27.13-.4.21-.12.08-.24.18-.35.28-.11.11-.2.22-.29.35-.08.12-.16.26-.21.39-.06.14-.1.28-.13.43-.03.15-.05.3-.05.45,0,.15.01.3.04.45.03.15.07.29.12.43.06.14.12.27.2.4.08.13.17.24.28.35.1.11.22.21.34.29.12.09.25.16.39.22s.28.11.43.14.29.05.44.06Z"
                />
                <path
                  className="home-cls-2"
                  d="M70.36,71.58c-4.15-1.25-6.32-5.68-10.52-6.22-3.82-.6-7.79-.38-10.78,2.46-1.29,1.24-2.7,2.29-4.26,3.17-9.56,4.91-4.87-14.6-2.94-17.63,3.25-6.29,6.87-4.57,12.65-3.24,1.93.58,4.52.15,6.73-.47,3.54-.96,6.96-1.73,9.44,1.77,3.13,3.34,7.48,22.5-.32,20.16h0ZM75.54,70.07c1.06-3.96.53-7.45-.59-12.26-1.12-4.85-4.3-11.54-10.58-10.27-3.02.45-6.62,2.06-9.51,1.23-1.65-.42-3.31-.76-4.95-1.12-9.36-2.05-11.89,10.59-12.27,18.19-.23,5.09,2.35,9.3,7.81,6.35,1.66-.93,3.17-2.06,4.54-3.37.9-.89,1.96-1.51,3.17-1.87,3.6-.91,7.82-.8,10.77,2.02,2.76,2.79,9.42,7.22,11.61,1.1Z"
                />
              </g>
            </g>
          </g>


        </svg>

        {showLanguageMenu && (
          <div
            className="language-menu"
            style={{
              position: 'absolute',
              top: '80px',
              right: '40px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              zIndex: 1000,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div onClick={() => changeLanguage('de')} style={{ cursor: 'pointer', padding: '5px' }}>
              Deutsch
            </div>
            <div onClick={() => changeLanguage('en')} style={{ cursor: 'pointer', padding: '5px' }}>
              English
            </div>
            <div onClick={() => changeLanguage('fr')} style={{ cursor: 'pointer', padding: '5px' }}>
              Français
            </div>
            <div onClick={() => changeLanguage('es')} style={{ cursor: 'pointer', padding: '5px' }}>
              Español
            </div>
            <div onClick={() => changeLanguage('tr')} style={{ cursor: 'pointer', padding: '5px' }}>
              Türkçe
            </div>
            <div onClick={() => changeLanguage('ru')} style={{ cursor: 'pointer', padding: '5px' }}>
              Русский
            </div>
          </div>
        )}

        {/* Profilmenü */}
        {showProfileMenu && user && (
          <ProfileMenu ref={profileMenuRef}>
            <ProfileMenuItem onClick={() => handleNavigation('/profile')}>
              Mein Profil
            </ProfileMenuItem>
            <ProfileMenuItem onClick={() => handleNavigation('/support')}>
              Support
            </ProfileMenuItem>
            <LogoutMenuItem onClick={handleLogout}>
              Abmelden
            </LogoutMenuItem>
          </ProfileMenu>
        )}

        {/* Hilfe-Tour Overlay */}
        {showHelpPopup && (
          <div ref={helpPopupRef}>
            <HelpTour onClose={() => setShowHelpPopup(false)} />
          </div>
        )}

        {/* Such-Dropdown außerhalb des SVGs aber mit SVG-Koordinaten */}
        {showDropdown && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: getDropdownTopPosition(), // Dynamische Position je nach aktueller Fenstergröße
            left: '68.75%',
            width: '18.2%',
            zIndex: 2000,
            background: theme === 'dark' ? '#23242a' : '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            maxHeight: '320px',
            overflowY: 'auto',
            padding: '10px 0',
          }}>
            {searchResults.map(offer => (
              <div
                key={offer._id}
                onMouseDown={() => {
                  setShowDropdown(false);
                  setSearchTerm('');
                  setShowMobileSearch(false);
                  navigate(`/offer/${offer._id}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                  color: theme === 'dark' ? '#fff' : '#23242a',
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.backgroundColor = theme === 'dark' ? '#333' : '#f5f5f5'}
                onMouseLeave={e => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <img
                  src={offer.game?.background_image}
                  alt={offer.game?.name}
                  style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 6 }}
                />
                <span style={{ fontWeight: 500 }}>{offer.game?.name}</span>
                <span style={{ marginLeft: 'auto', color: '#8bc34a', fontSize: '0.95em' }}>{(offer.price ?? 0).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        )}

        <Modal show={showLogin} onHide={() => setShowLogin(false)}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <Login onSuccess={() => setShowLogin(false)} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
