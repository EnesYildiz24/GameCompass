import { useEffect, useState } from 'react';
import { getAllOffers } from '../backend/api';
import { OfferResource } from '../Resources';
import { Spinner, Alert, Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // <- für Theme holen
import { getImageUrl } from '../utils/getImageUrl';

export function Spiele() {
  const [offers, setOffers] = useState<OfferResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State für Filter und Sortierung
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const condition = searchParams.get('condition');

  // Genre aus URL übernehmen, falls vorhanden
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) setSelectedGenre(genreParam);
  }, [location.search]);

  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    document.body.style.background = isDarkMode ? 'var(--page-bg)' : '#fff';
    return () => {
      document.body.style.background = '';
    };
  }, [isDarkMode]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const loadedOffers = await getAllOffers();
        setOffers(loadedOffers);

        // Genres für Filter extrahieren
        const genreSet = new Set<string>();
        loadedOffers.forEach((offer: OfferResource) => {
          offer.game?.genres?.forEach((g: any) => genreSet.add(g.name));
        });
        setAllGenres(Array.from(genreSet));
      } catch (e) {
        setError('Angebote konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  // Gefilterte & sortierte Offers
  const filteredOffers = offers
    .filter((offer) => {
      const g = offer.game;
      const matchesSearch = g?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedGenre
        ? g?.genres?.some((gen: any) => gen.name === selectedGenre)
        : true;
      const matchesCondition = condition ? offer.condition === condition : true;
      return matchesSearch && matchesGenre && matchesCondition;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = (a.price ?? 0) - (b.price ?? 0);
          break;
        case 'rating':
          comparison = (a.game?.rating ?? 0) - (b.game?.rating ?? 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Farben für Darkmode/Lightmode
  const cardBg = isDarkMode ? '#23242a' : '#fff';
  const cardColor = isDarkMode ? '#fff' : '#23242a';

  return (
    <Container
      className="mt-5"
      style={{
        background: 'var(--page-bg)',
        borderRadius: '18px',
        padding: '1.5rem',
        color: isDarkMode ? 'var(--section-text)' : '#23242a',
      }}
    >
      <h2 style={{ color: 'var(--section-text)' }}>
        {condition === 'new'
          ? 'Neue Spiele'
          : condition === 'used'
            ? 'Gebrauchte Spiele'
            : 'Alle Angebote'}
      </h2>
      {/* Filter UI */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className={`form-control ${isDarkMode ? 'suchfeld-darkmode' : ''}`}
            placeholder="Spiel suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: isDarkMode ? '#23242a' : '#f5f5f5',
              color: cardColor,
              border: 'none',
              borderRadius: '12px',
            }}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              background: isDarkMode ? '#23242a' : '#fff',
              color: cardColor,
              border: 'none',
              borderRadius: '12px',
            }}
          >
            <option value="">Alle Genres</option>
            {allGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2 d-flex">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: isDarkMode ? '#23242a' : '#fff',
              color: cardColor,
              border: 'none',
              borderRadius: '12px',
            }}
          >
            <option value="rating">Sortieren nach: Bewertung</option>
            <option value="price">Preis</option>
          </select>
          <Button
            variant={isDarkMode ? 'outline-light' : 'outline-secondary'}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{ marginLeft: '8px', minWidth: '40px' }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Karten-Ansicht wie auf Spieleseite */}
      <Row>
        {filteredOffers.map((offer) => (
          <Col xl={3} lg={4} md={6} sm={12} className="mb-4" key={offer._id}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                borderRadius: '18px',
                cursor: 'pointer',
                background: cardBg,
                color: cardColor,
              }}
              onClick={() => navigate(`/offer/${offer._id}`)}
            >
              <Card.Img
                src={getImageUrl(offer.game?.background_image || '')}
                alt={offer.game?.name}
                style={{
                  height: '220px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '18px',
                  borderTopRightRadius: '18px',
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className="fw-bold mb-2"
                  style={{ minHeight: '48px', color: cardColor }}
                >
                  {offer.game?.name ?? 'Unbekannt'}
                </Card.Title>
                <div className="mb-2" style={{ fontSize: '0.95rem' }}>
                  <strong>Preis:</strong> {offer.price.toFixed(2)} €<br />
                  <strong>Bewertung:</strong> {offer.game?.rating ?? '-'} / 5<br />
                </div>
                <div className="mt-auto">
                  <span style={{ fontSize: '0.85rem', color: '#8bc34a' }}>
                    {offer.game?.genres?.map((g) => g.name).join(', ') || 'Kein Genre'}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Kein Ergebnis */}
      {filteredOffers.length === 0 && (
        <Card
          body
          style={{
            background: cardBg,
            color: cardColor,
            borderRadius: '18px',
          }}
        >
          Keine Angebote gefunden.
        </Card>
      )}
      {loading && (
        <div className="mt-5 text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Scroll-to-Top Button */}
      {typeof window !== 'undefined' && (
        <Button
          variant={theme === 'dark' ? 'dark' : 'light'}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 9999,
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            opacity: 0.85,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Nach oben"
        >
          <span style={{ fontSize: '2rem', lineHeight: 1 }}>&uarr;</span>
        </Button>
      )}
    </Container>
  );
}
