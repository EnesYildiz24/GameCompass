import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Modal,
  Badge,
  Carousel,
} from 'react-bootstrap';
import { getOfferById, updateCart, getAllOffers, getGameById } from '../backend/api';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { SpielResource, OfferResource } from '../Resources';
import { fetchScreenshotCountById } from '../backend/api';
import { getImageUrl } from '../utils/getImageUrl';

export interface CartItem extends SpielResource {
  _id: string; // Sub-Dokument- oder Temp-ID
  gameId: string; // RAWG- oder Mongo-Spiel-ID
  quantity: number;
}

export function SpielDetail() {
  const { offerId, gameId } = useParams<{ offerId?: string; gameId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);
  const { user } = useAuth();
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [allOffers, setAllOffers] = useState<OfferResource[]>([]);

  // Body-Background anpassen (Darkmode)
  useEffect(() => {
    document.body.style.background = isDarkMode ? 'var(--page-bg)' : '#fff';
    return () => {
      document.body.style.background = '';
    };
  }, [isDarkMode]);

  useEffect(() => {
    async function loadScreenshots() {
      if (!offer?.game?.rawgId) return;
      try {
        const imgs = await fetchScreenshotCountById(offer.game.rawgId);
        setScreenshots(Array.isArray(imgs) ? imgs : []);
      } catch (err) {
        console.error('Screenshots konnten nicht geladen werden:', err);
      }
    }

    loadScreenshots();
  }, [offer]);

  useEffect(() => {
    async function loadOfferDetails() {
      if (!offerId) return;
      try {
        setLoading(true);
        // Wenn wir Spieldaten aus dem State haben, verwenden wir diese
        if (location.state?.game) {
          setOffer({ game: location.state.game });
          setLoading(false);
          return;
        }
        // Ansonsten laden wir die Daten von der API
        if (offerId) {
          const data = await getOfferById(offerId);
          setOffer(data);
        } else if (gameId) {
          const gameData = await getGameById(gameId);
          setOffer({ game: gameData }); // Dummy-Offer-Objekt, damit alles gleich bleibt
        }
      } catch (err) {
        setError(t('games.detailsError'));
      } finally {
        setLoading(false);
      }
    }
    loadOfferDetails();
  }, [offerId, t, location.state]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const offers = await getAllOffers();
        setAllOffers(offers);
      } catch (e) {
        // ignore
      }
    }
    fetchOffers();
  }, []);

  const addToCart = async () => {
    if (!offer) return;
    const cartKey = user ? `gameCart_${user.id}` : 'gameCart_guest';
    let cart: any[] = [];
    try {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) cart = JSON.parse(savedCart);
    } catch (error) {}
    const idx = cart.findIndex((i) => i.offerId === offer._id);
    if (idx >= 0) cart[idx].quantity += 1;
    else
      cart.push({
        _id: offer._id,
        offerId: offer._id,
        gameId: offer.game._id,
        name: offer.game.name,
        price: offer.price,
        quantity: 1,
        background_image: offer.game.background_image,
        seller: offer.seller,
        condition: offer.condition,
      });
    localStorage.setItem(cartKey, JSON.stringify(cart));
    if (user) {
      try {
        await updateCart(
          cart.map((i) => ({
            itemId: i._id,
            offerId: i.offerId,
            gameId: i.gameId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            background_image: i.background_image,
          }))
        );
        window.dispatchEvent(new Event('cartChange'));
      } catch (e) {}
    }
    openAddModal();
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }} />
          <h4 className="mt-3">{t('common.loading')}</h4>
        </div>
      </Container>
    );
  }

  if (error || !offer) {
    return (
      <Container
        className="text-center my-5 p-5"
        style={{ background: isDarkMode ? 'var(--page-bg)' : '#fff' }}
      >
        <div className="alert alert-danger p-4" role="alert">
          <h4 className="alert-heading mb-3">😕 Oops!</h4>
          <p className="mb-3">{error || t('games.notFound')}</p>
          <Button variant="primary" size="lg" onClick={() => navigate(-1)}>
            ← {t('common.back')}
          </Button>
        </div>
      </Container>
    );
  }

  const game = offer.game;

  // Ähnliche Produkte filtern
  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  const similarOffers = shuffleArray(
    allOffers.filter(
      (o) =>
        o._id !== offer._id &&
        Array.isArray(o?.game?.genres) &&
        Array.isArray(game?.genres) &&
        o.game.genres.some((g: any) => game.genres.some((gg: any) => gg.name === g.name))
    )
  ).slice(0, 4);

  return (
    <Container
      className="py-5"
      style={{
        background: isDarkMode ? '#242424' : '#fff',
        color: isDarkMode ? '#e0e0e0' : '#111',
        borderRadius: '20px',
        maxWidth: '1400px',
      }}
    >
      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          variant={isDarkMode ? 'outline-light' : 'outline-primary'}
          size="lg"
          className="d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          ← Zurück zur Übersicht
        </Button>
      </div>

      {/* Hauptbereich */}
      <Row className="mb-5">
        {/* Linke Spalte - Bilder */}
        <Col lg={7}>
          <div className="position-relative mb-4">
            <img
              src={getImageUrl(game?.background_image)}
              alt={game?.name}
              className="img-fluid rounded-4 w-100"
              style={{
                maxHeight: '500px',
                objectFit: 'cover',
                boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)',
              }}
            />
          </div>

          {/* Bildergalerie */}
          <Card
            className={`${theme === 'dark' ? 'bg-dark' : 'bg-light'} border-0 shadow-sm`}
            style={{ borderRadius: '20px' }}
          >
            <Card.Body>
              <h5 className="mb-4">📸 Bildergalerie</h5>
              {screenshots.length > 0 ? (
                <Carousel interval={3000} className="screenshot-carousel">
                  {screenshots.map((screenshot, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="d-block w-100"
                        style={{
                          borderRadius: '15px',
                          height: '400px',
                          objectFit: 'cover',
                          boxShadow: isDarkMode
                            ? '0 4px 16px rgba(255,255,255,0.1)'
                            : '0 4px 16px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <p className="text-muted text-center">Keine Screenshots verfügbar</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Rechte Spalte - Informationen */}
        <Col lg={5}>
          <div className="sticky-top" style={{ top: '20px' }}>
            {/* Titel und Hauptinfo */}
            <Card
              className={`mb-4 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
              style={{
                borderRadius: '20px',
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
              }}
            >
              <Card.Body className="p-4">
                <h1 className="display-6 mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                  {game?.name ?? 'Unbekannt'}
                </h1>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {game.genres?.map((g: any, idx: number) => (
                    <Badge
                      key={idx}
                      bg={theme === 'dark' ? 'info' : 'primary'}
                      className="py-2 px-3"
                      style={{ borderRadius: '20px', fontSize: '0.9em' }}
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>

                <div className="mb-4">
                  <div
                    className="d-flex justify-content-between align-items-center p-3 mb-3"
                    style={{
                      background: theme === 'dark' ? '#363636' : '#f8f9fa',
                      borderRadius: '15px',
                      color: isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    <div>
                      <h5 className="mb-1">Preis</h5>
                      <h3 className="mb-0">{offer.price.toFixed(2)} €</h3>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="success" size="lg" className="px-4" onClick={addToCart}>
                        {t('cart.add')}
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="px-4"
                        onClick={async () => {
                          await addToCart();
                          navigate('/checkout');
                        }}
                      >
                        Kaufen
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="mb-3" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    📋 Produktdetails
                  </h5>
                  <div
                    className="d-flex flex-column gap-3"
                    style={{ color: isDarkMode ? '#e0e0e0' : '#000' }}
                  >
                    <div className="d-flex justify-content-between">
                      <span>Zustand</span>
                      <strong>{offer.condition === 'new' ? 'Neu' : 'Gebraucht'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Plattform</span>
                      <strong>
                        {game.platforms?.map((p: any) => p.platform.name).join(', ') || 'Unknown'}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Bewertung</span>
                      <strong>{game.rating ? `${game.rating}/5 ⭐` : 'Keine Bewertung'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>UVP</span>
                      <strong>{(game.price ?? 0).toFixed(2)} €</strong>
                    </div>
                  </div>
                </div>

                {offer?.seller && (
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                      👤 Verkäuferinformationen
                    </h5>
                    <div
                      className="p-3"
                      style={{
                        background: theme === 'dark' ? '#363636' : '#f8f9fa',
                        borderRadius: '15px',
                        color: isDarkMode ? '#e0e0e0' : '#000',
                      }}
                    >
                      <p className="mb-2">
                        <strong>Name:</strong> {offer.seller?.username ?? '-'}
                      </p>
                      <p className="mb-2">
                        <strong>Kontakt:</strong> {offer.seller?.email ?? '-'}
                      </p>
                      <p className="mb-0">
                        <strong>Inseriert am:</strong>
                        {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>
                )}
                {/* USK-Einstufung */}
                <div
                  className="text-center p-3"
                  style={{
                    background: theme === 'dark' ? '#363636' : '#f8f9fa',
                    borderRadius: '15px',
                    color: isDarkMode ? '#e0e0e0' : '#000',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <span className="display-4 fw-bold text-danger">
                      {game.ageRating?.rating || '18'}
                    </span>
                    <div className="text-start">
                      <div className="fw-bold">{game.ageRating?.reason || 'Gewalt'}</div>
                      <small style={{ color: isDarkMode ? '#bbb' : '#666' }}>
                        USK-Einstufung für Deutschland
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Beschreibung */}
      <Card
        className={`mb-5 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
        style={{
          borderRadius: '20px',
          backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
        }}
      >
        <Card.Body className="p-4">
          <h4 className="mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
            📝 Beschreibung
          </h4>
          <p
            className="lead mb-0"
            style={{
              lineHeight: '1.8',
              color: isDarkMode ? '#fff' : '#000',
            }}
          >
            {game.description}
          </p>
        </Card.Body>
      </Card>

      {/* Ähnliche Produkte */}
      <div className="mb-5">
        <h4 className="mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
          🎮 Ähnliche Spiele
        </h4>
        <Row className="g-4">
          {similarOffers.map((similar) => (
            <Col lg={3} md={6} key={similar._id}>
              <Card
                className={`h-100 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
                style={{
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                }}
                onClick={() => navigate(`/offer/${similar._id}`)}
              >
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                  <img
                    src={similar.game.background_image}
                    alt={similar.game.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <Card.Body>
                  <h5 className="mb-2" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {similar.game.name}
                  </h5>
                  <p className="text-success mb-0" style={{ fontWeight: 'bold' }}>
                    {similar.price.toFixed(2)} €
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Systemanforderungen */}
      {game.systemRequirements && (
        <Card
          className={`mb-5 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
          style={{
            borderRadius: '20px',
            backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
          }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
              💻 Systemanforderungen
            </h4>
            <Row>
              <Col md={6}>
                <h5 className="mb-3" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                  Minimum
                </h5>
                <p style={{ color: isDarkMode ? '#fff' : '#000' }} className="mb-0">
                  {game.systemRequirements.minimum}
                </p>
              </Col>
              <Col md={6}>
                <h5 className="mb-3" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                  Empfohlen
                </h5>
                <p style={{ color: isDarkMode ? '#fff' : '#000' }} className="mb-0">
                  {game.systemRequirements.recommended}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Trailer */}
      {game.trailerUrl && (
        <Card
          className={`mb-5 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
          style={{
            borderRadius: '20px',
            backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
          }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
              🎬 Trailer
            </h4>
            <div className="ratio ratio-16x9">
              <iframe
                src={game.trailerUrl}
                title={`${game.name} Trailer`}
                allowFullScreen
                style={{ borderRadius: '15px' }}
              ></iframe>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Screenshots */}
      {game.screenshots && game.screenshots.length > 0 && (
        <Card
          className={`mb-5 border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
          style={{
            borderRadius: '20px',
            backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
          }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
              📸 Screenshots
            </h4>
            <Row className="g-4">
              {game.screenshots.map((screenshot: string, index: number) => (
                <Col key={index} lg={4}>
                  <img
                    src={screenshot}
                    alt={`${game.name} Screenshot ${index + 1}`}
                    className="img-fluid w-100"
                    style={{
                      borderRadius: '15px',
                      boxShadow: isDarkMode
                        ? '0 4px 16px rgba(255,255,255,0.1)'
                        : '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Bewertungen */}
      {game.reviews && game.reviews.length > 0 && (
        <Card
          className={`border-0 shadow-sm ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
          style={{
            borderRadius: '20px',
            backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
          }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4" style={{ color: isDarkMode ? '#fff' : '#000' }}>
              ⭐ Bewertungen
            </h4>
            <div className="d-flex flex-column gap-4">
              {game.reviews.map((review: any) => (
                <Card
                  key={review.id}
                  className="border-0"
                  style={{
                    borderRadius: '15px',
                    backgroundColor: isDarkMode ? '#363636' : '#f8f9fa',
                    color: isDarkMode ? '#fff' : '#000',
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0" style={{ color: isDarkMode ? '#fff' : '#000' }}>
                        {review.username}
                      </h5>
                      <div className="text-warning">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ fontSize: '1.2rem' }}>
                            {i < review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mb-2" style={{ color: isDarkMode ? '#e0e0e0' : '#000' }}>
                      {review.comment}
                    </p>
                    <small style={{ color: isDarkMode ? '#bbb' : '#666' }}>
                      {new Date(review.date).toLocaleDateString()}
                    </small>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Modal und Benachrichtigungen bleiben unverändert */}
      <Modal show={showAddModal} onHide={closeAddModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t('cart.itemAdded')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <p className="mb-0">{t('cart.chooseNextStep')}</p>
          <Button
            variant="primary"
            onClick={() => {
              closeAddModal();
              navigate('/cart');
            }}
          >
            {t('cart.goToCart')}
          </Button>
          <Button variant="outline-secondary" onClick={closeAddModal}>
            {t('cart.continueShopping')}
          </Button>
        </Modal.Body>
      </Modal>

      {showCartNotification && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div
            className={`toast show ${isDarkMode ? 'bg-dark text-white' : ''}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">{t('cart.notification')}</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCartNotification(false)}
              ></button>
            </div>
            <div className="toast-body">{t('cart.itemAdded')}</div>
          </div>
        </div>
      )}
    </Container>
  );
}
