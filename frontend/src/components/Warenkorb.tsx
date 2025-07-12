import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { SpielResource } from '../Resources';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { fetchCart, updateCart } from '../backend/api';
import { getImageUrl } from '../utils/getImageUrl';

// Styled Container für den Dark Mode
const DarkModeContainer = styled(Container)`
  padding: 3rem 1.5rem;
  border-radius: 0.5rem;
  min-height: 80vh;
  margin: 0;
  max-width: 100%;
`;

// Erweiterte SpielResource für den Warenkorb
interface CartItem {
  _id?: string;
  offerId: string;
  gameId: string;
  name: string;
  price: number;
  quantity: number;
  background_image?: string;
  genres?: { name: string }[];
  isDigital: boolean;
}

export function Warenkorb() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setSyncing] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const isDarkMode = theme === 'dark';

  // Generiere einen Schlüssel für den Warenkorb basierend auf der Benutzer-ID
  const getCartKey = () => {
    return user ? `gameCart_${user.id ?? user.id}` : 'gameCart_guest';
  };

  useEffect(() => {
    if (authLoading) return;
    const cartKey = getCartKey();
    const saved = localStorage.getItem(cartKey);
    if (saved) setCartItems(JSON.parse(saved));

    setLoading(false);
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading || !user) return; // nur für eingeloggte Nutzer
    fetchCart()
      .then((data) => {
        setCartItems(data); // überschreibt ggf. Gastdaten
        localStorage.setItem(getCartKey(), JSON.stringify(data));
      })
      .catch(console.error);
  }, [authLoading, user]);

  const initialRef = useRef(true);

  // Überprüfe die Synchronisierungsfunktion
  useEffect(() => {
    if (loading || authLoading) return;

    if (initialRef.current) {
      // erstes Rendern überspringen
      initialRef.current = false;
      return;
    }

    // ---------- Jetzt synchronisieren ----------
    (async () => {
      try {
        if (user) {
          setSyncing(true);
          const apiItems = cartItems.map((i) => ({
            itemId: i._id, // darf undefined sein → Backend prüft!
            offerId: i.offerId,
            gameId: i.gameId,
            name: i.name,
            price: i.price ?? 0,
            quantity: i.quantity,
            background_image: i.background_image,
            isDigital: i.isDigital,
          }));
          await updateCart(apiItems);
          window.dispatchEvent(new Event('cartChange'));
        }
        localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
      } catch (err) {
        console.error('Cart-Sync fehltgeschlagen:', err);
      } finally {
        setSyncing(false);
      }
    })();
  }, [cartItems, loading, authLoading, user]);
  const sameItem = (item: CartItem, id: string) => item._id === id || item.offerId === id;
  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) => prev.map((i) => (sameItem(i, itemId) ? { ...i, quantity: newQty } : i)));
  };
  const removeItem = async (itemId: string) => {
    // 1) lokal filtern
    const updated = cartItems.filter((i) => !sameItem(i, itemId));
    setCartItems(updated);

    // 2) backend synchronisieren
    if (user) {
      try {
        await updateCart(
          updated.map((i) => ({
            offerId: i.offerId,
            gameId: i.gameId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            background_image: i.background_image,
            isDigital: i.isDigital,
          }))
        );
        window.dispatchEvent(new Event('cartChange'));
      } catch (err) {
        console.error('Fehler beim Entfernen in der DB:', err);
      }
    }
  };

  const clearCart = async () => {
    // 1) lokal leeren
    setCartItems([]);
    localStorage.removeItem(getCartKey());

    // 2) backend synchronisieren
    if (user) {
      try {
        await updateCart([]); // leere Liste
        window.dispatchEvent(new Event('cartChange'));
      } catch (err) {
        console.error('Fehler beim Leeren des Warenkorbs in der DB:', err);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (!user) {
      // Wenn kein Benutzer angemeldet ist, zur Login-Seite weiterleiten
      navigate('/login', { state: { returnTo: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  // Dark Mode Styling
  const cardBg = isDarkMode ? '#2c2c2c' : '#fff';
  const cardColor = isDarkMode ? '#e1e1e1' : '#333';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const mutedTextColor = isDarkMode ? '#aaa' : '#6c757d';
  const containerBg = isDarkMode ? '#212121' : '#f8f9fa';
  const pageBg = isDarkMode ? '#1a1a1a' : '#fff';

  // Setze den Hintergrund für die gesamte Seite
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = pageBg;
    } else {
      document.body.style.backgroundColor = '';
    }

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isDarkMode, pageBg]);

  return (
    <div
      style={{
        backgroundColor: pageBg,
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <DarkModeContainer
        fluid
        style={{
          backgroundColor: containerBg,
          color: cardColor,
        }}
      >
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <h1 className="mb-4">{user ? `Warenkorb von ${user.username}` : 'Warenkorb'}</h1>

            {!user && (
              <Alert
                variant={isDarkMode ? 'warning' : 'warning'}
                className="mb-4"
                style={{
                  backgroundColor: isDarkMode ? '#332701' : undefined,
                  color: isDarkMode ? '#ffc107' : undefined,
                  borderColor: isDarkMode ? '#664d03' : undefined,
                }}
              >
                Du bist nicht angemeldet. Dein Warenkorb wird lokal gespeichert. Um deinen Warenkorb
                zu speichern und den Kauf abzuschließen, bitte{' '}
                <Button
                  variant="link"
                  className="p-0"
                  style={{ color: isDarkMode ? '#ffc107' : undefined }}
                  onClick={() => navigate('/login')}
                >
                  melde dich an
                </Button>
                .
              </Alert>
            )}

            {cartItems.length === 0 ? (
              <Alert
                variant={isDarkMode ? 'info' : 'info'}
                style={{
                  backgroundColor: isDarkMode ? '#032830' : undefined,
                  color: isDarkMode ? '#0dcaf0' : undefined,
                  borderColor: isDarkMode ? '#055160' : undefined,
                }}
              >
                Dein Warenkorb ist leer.{' '}
                <Button
                  variant="link"
                  style={{ color: isDarkMode ? '#0dcaf0' : undefined }}
                  onClick={() => navigate('/games')}
                >
                  Zu den Spielen
                </Button>
              </Alert>
            ) : (
              <>
                <Row>
                  <Col lg={8}>
                    <Card
                      className="mb-4 shadow-sm border-0"
                      style={{ background: cardBg, color: cardColor }}
                    >
                      <Card.Body>
                        <ListGroup variant="flush">
                          {cartItems.map((item, idx) => (
                            <ListGroup.Item
                              key={`${item._id}-${idx}`}
                              className="d-flex justify-content-between align-items-center py-3"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                borderBottom: `1px solid ${borderColor}`,
                                color: cardColor,
                              }}
                            >
                              {/* linke Spalte: Bild + Titel */}
                              <div className="d-flex align-items-center">
                                <img
                                  src={getImageUrl(item.background_image!)}
                                  alt={item.name}
                                  style={{
                                    width: '80px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                  className="me-3"
                                />
                                <div>
                                  <h5 className="mb-0">{item.name}</h5>
                                  <small style={{ color: mutedTextColor }}>
                                    {item.genres?.map((g) => g.name).join(', ')}
                                  </small>
                                </div>
                              </div>

                              {/* rechte Spalte: Menge, Preis, Löschen-Button */}
                              <div className="d-flex align-items-center">
                                {/* +/--Buttons */}
                                <div className="d-flex align-items-center me-3">
                                  <Button
                                    onClick={() =>
                                      updateQuantity(item._id ?? item.offerId, item.quantity - 1)
                                    }
                                  >
                                    –
                                  </Button>

                                  <span className="mx-2">{item.quantity}</span>
                                  <Button
                                    onClick={() =>
                                      updateQuantity(item._id ?? item.offerId, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </Button>
                                </div>

                                {/* Einzel- und Gesamtpreis */}
                                <div className="text-end me-3" style={{ minWidth: '80px' }}>
                                  <div style={{ color: mutedTextColor }}>
                                    {(item.price ?? 0).toFixed(2)} €
                                  </div>
                                  <strong>
                                    {((item.price ?? 0) * item.quantity).toFixed(2)} €
                                  </strong>
                                </div>

                                {/* Entfernen */}
                                <Button
                                  variant="danger"
                                  onClick={() => removeItem(item._id ?? item.offerId)}
                                >
                                  Entfernen
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                      <Card.Footer
                        className="d-flex justify-content-between"
                        style={{
                          background: cardBg,
                          borderTop: `1px solid ${borderColor}`,
                        }}
                      >
                        <Button
                          variant={isDarkMode ? 'outline-light' : 'outline-secondary'}
                          onClick={() => navigate('/games')}
                        >
                          Weiter einkaufen
                        </Button>
                        <Button variant="outline-danger" onClick={clearCart}>
                          Warenkorb leeren
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card
                      className="shadow-sm border-0"
                      style={{ background: cardBg, color: cardColor }}
                    >
                      <Card.Body>
                        <h4 className="mb-3">Zusammenfassung</h4>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Zwischensumme</span>
                          <span>{calculateTotal().toFixed(2)} €</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Versand</span>
                          <span>0.00 €</span>
                        </div>
                        <hr style={{ borderColor: borderColor }} />
                        <div className="d-flex justify-content-between mb-3">
                          <strong>Gesamtsumme</strong>
                          <strong>{calculateTotal().toFixed(2)} €</strong>
                        </div>
                        <Button variant="success" className="w-100" onClick={proceedToCheckout}>
                          Zur Kasse
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </DarkModeContainer>
    </div>
  );
}
