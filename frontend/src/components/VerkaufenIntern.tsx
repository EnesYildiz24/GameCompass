  import React, { useState, useEffect, useRef } from 'react';
  import {
    Container,
    Form,
    Button,
    Alert,
    Spinner,
    Row,
    Col,
    InputGroup,
    ListGroup,
  } from 'react-bootstrap';
  import { useAuth } from '../context/AuthContext';
  import { useTheme } from '../context/ThemeContext';
  import { useTranslation } from 'react-i18next';
  import { useNavigate } from 'react-router-dom';
  import {
    createSpiel,
    createOffer,
    uploadImage,
    searchGames, // <‑‑ NEU: Game‑Suche
  } from '../backend/api';
  import { SpielResource } from '../Resources';
  import { ChipPicker } from './ChipPicker';

  /* ---------------------------------- Optionen ---------------------------------- */
  const GENRE_OPTIONS = [
    'Action',
    'Adventure',
    'RPG',
    'Shooter',
    'Strategy',
    'Puzzle',
    'Racing',
    'Arcade',
    'Simulation',
    'Platformer',
    'Casual',
    'Indie',
    'Massively Multiplayer',
    'Sports',
    'Fighting',
    'Educational',
    'Card',
    'Family',
    'Board Games',
    'Horror',
  ];

  const PLATFORM_OPTIONS = [
    'PC',
    'PlayStation 5',
    'PlayStation 4',
    'Xbox Series S/X',
    'Xbox One',
    'Xbox 360',
    'Nintendo Switch',
    'Nintendo 3DS',
    'Wii U',
    'macOS',
    'Linux',
    'iOS',
  ];

  interface SellerInfo {
    displayName: string;
    email?: string;
  }

  export function VerkaufenIntern() {
    /* ---------------------------- Context & Utilities --------------------------- */
    const { user, loading: authLoading } = useAuth();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const HOST = import.meta.env.VITE_API_SERVER_URL;

    /* --------------------------------- Suche ---------------------------------- */
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SpielResource[]>([]);
    const [selectedGame, setSelectedGame] = useState<SpielResource | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [isDigital, setIsDigital] = useState(true);
    const [digitalKey, setDigitalKey] = useState('');

    // Game‑Suche (debounced)
    useEffect(() => {
      // alten Timer abbrechen
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Eingabe leer → Ergebnisliste leeren
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      // debounce
      debounceRef.current = setTimeout(async () => {
        try {
          // 1) Rohdaten vom Backend holen
          const raw = await searchGames(searchTerm.trim());

          // 2) clientseitig filtern (Fallback, falls Backend ungenau ist)
          const q = searchTerm.trim().toLowerCase();
          const filtered = raw.filter((g) => g.name.toLowerCase().includes(q));

          // 3) Duplikate (gleicher Name) entfernen
          const uniq: typeof filtered = [];
          const seen = new Set<string>();
          for (const g of filtered) {
            if (!seen.has(g.name)) {
              uniq.push(g);
              seen.add(g.name);
            }
          }

          // 4) maximal 20 Ergebnisse anzeigen
          setSearchResults(uniq.slice(0, 20));
        } catch (e) {
          console.error('searchGames failed', e);
          setSearchResults([]);
        }
      }, 350); // 350 ms debounce
    }, [searchTerm]);

    // Auswahl eines Treffers → Formular vorbefüllen
    const handleSelectGame = (game: SpielResource) => {
      setSelectedGame(game);
      // Formularwerte aus Spiel übernehmen
      setName(game.name ?? '');
      setDescription(game.description ?? '');
      setPrice(game.price ? game.price.toString() : '');
      setAvailability(!!game.availability);
      setGenresSel(game.genres?.map((g) => g.name) ?? []);
      setPlatformsSel(game.platforms?.map((p) => p.platform.name) ?? []);
      if (game.background_image) {
        if (game.background_image.startsWith('http')) {
          setPreviewUrl(game.background_image);
        } else {
          setPreviewUrl(`${HOST}/api/upload/${game.background_image}`);
        }
        setFileId(game.background_image);
      }
    };

    /* ----------------------------- Formular‑State ------------------------------ */
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [availability, setAvailability] = useState(true);
    const [, setRating] = useState('');
    const [fileId, setFileId] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [genresSel, setGenresSel] = useState<string[]>([]);
    const [platformsSel, setPlatformsSel] = useState<string[]>([]);

    /* ---------------------------- Feedback‑State ------------------------------ */
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [readyNS, setReadyNS] = useState(false);

    useEffect(() => {
      i18n.loadNamespaces('sell').then(() => setReadyNS(true));
    }, [i18n]);
    useEffect(() => {
      document.body.style.background = isDarkMode ? 'var(--page-bg)' : '#fff';
      return () => { document.body.style.background = ''; };
    }, [isDarkMode]);
    // Redirect wenn nicht eingeloggt
    useEffect(() => {
      if (!authLoading && !user && readyNS) {
        navigate('/login', { replace: true });
      }
    }, [authLoading, readyNS, user, navigate]);

    if (authLoading || !readyNS || !user) return null;

    /* ------------------------------ Bild‑Upload ------------------------------ */
    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setLoadingSubmit(true);
        const id = await uploadImage(file);
        setFileId(id);
        setPreviewUrl(`${HOST}/api/upload/${id}`);
      } catch {
        setError('Bild‑Upload fehlgeschlagen');
      } finally {
        setLoadingSubmit(false);
      }
    }

    /* ------------------------------ Submit ----------------------------------- */
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError(null);
      setSuccess(null);
      setLoadingSubmit(true);

      const actualUser = (user as any).user ?? (user as any);

      try {
        let spielId: string;

        // Wenn ein vorhandenes Spiel ausgewählt wurde → dieses nutzen; sonst neu erstellen
        if (selectedGame) {
          spielId = selectedGame.id!;
        } else {
          const gamePayload: Omit<SpielResource, 'id'> = {
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            availability,
            background_image: fileId,
            rating: 0,
            genres: genresSel.map((g, i) => ({ id: i + 1, name: g })),
            platforms: platformsSel.map((p) => ({ platform: { name: p } })),
          };
          const neuesSpiel = await createSpiel(gamePayload);
          spielId = neuesSpiel.id!;
        }

        const sellerInfo: SellerInfo = {
          displayName: actualUser.username || actualUser.displayName || actualUser.email,
          ...(actualUser.showEmail && actualUser.email ? { email: actualUser.email } : {}),
        };

        await createOffer({
          game: spielId,
          price: parseFloat(price),
          condition: isDigital ? 'new' : 'used', // z.B. alle Keys = „new“
          seller: actualUser.id,
          availability: availability,
          sellerInfo,
          isDigital, // Flag an Backend
          key: isDigital ? digitalKey.trim() : undefined,
        });

        setSuccess(t('sell.gameAndOfferCreatedSuccess'));
        /* Formular reset */
        setSelectedGame(null);
        setSearchTerm('');
        setName('');
        setDescription('');
        setPrice('');
        setAvailability(true);
        setRating('');
        setFileId('');
        setPreviewUrl('');
        setGenresSel([]);
        setPlatformsSel([]);

        setTimeout(() => navigate('/games'), 1500);
      } catch (err: any) {
        console.error('Fehler beim Anlegen von Spiel und Offer:', err);
        setError(err.message || t('errors.createGameAndOffer'));
      } finally {
        setLoadingSubmit(false);
      }
    }

    /* -------------------------------- Render --------------------------------- */
    return (
      <Container
        className={`my-4 p-4 shadow-lg rounded-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
        style={{ maxWidth: 900 }}
      >
        {/* Kopfzeile */}
        <header className="text-center mb-4">
          <h2 className="fw-bold mb-1">
            {t('sell.createGameTitle')} &amp; {t('sell.createOfferTitle')}
          </h2>
          <p className="text-muted mb-0">{t('sell.description')}</p>
        </header>

        {/* Meldungen */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* ---------------------------------- Formular ---------------------------------- */}
        <Form onSubmit={handleSubmit} autoComplete="off">
          {/* -------------------------- Spiel‑Suche & Auswahl ------------------------- */}
          <Form.Group className="mb-4 position-relative" controlId="searchGame">
            <Form.Label className="fw-semibold">{t('sell.searchGame')}</Form.Label>

            <InputGroup>
              <Form.Control
                type="text"
                placeholder={t('sell.searchGamePlaceholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedGame(null);
                }}
              />
              {searchTerm && (
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  ×
                </Button>
              )}
            </InputGroup>

            {searchResults.length > 0 && !selectedGame && (
              <ListGroup
                style={{
                  position: 'absolute',
                  zIndex: 20,
                  width: '100%',
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
                className="shadow"
              >
                {searchResults.map((g) => (
                  <ListGroup.Item action key={g.id} onClick={() => handleSelectGame(g)}>
                    {g.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            {selectedGame && (
              <small className="text-success d-block mt-2">
                {t('sell.gameSelected', { name: selectedGame.name })}
              </small>
            )}
          </Form.Group>

          <Row className="gy-4">
            {/* Linke Spalte */}
            <Col lg={7}>
              {/* Name */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">{t('sell.gameName')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('sell.gameNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              {/* Beschreibung */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">{t('sell.gameDescription')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder={t('sell.gameDescriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              {/* Preis & Verfügbarkeit */}
              <Row className="align-items-end">
                <Col sm={7}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder=" "
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <label htmlFor="price">{t('sell.gamePrice')}</label>
                  </Form.Floating>
                </Col>
                <Col sm={5}>
                  <Form.Check
                    type="switch"
                    id="avail-switch"
                    label={t('sell.gameAvailability')}
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                  />
                </Col>
              </Row>

              {/* Digital/Physisch Umschalter */}
              <Row className="align-items-center mb-3">
                <Col>
                  <Form.Check
                    type="switch"
                    id="digital-switch"
                    label={isDigital ? t('sell.digitalOffer') : t('sell.physicalOffer')}
                    checked={isDigital}
                    onChange={(e) => {
                      console.log('Digital toggle:', e.currentTarget.checked);
                      setIsDigital(e.currentTarget.checked);
                    }}
                  />
                </Col>
              </Row>

              {/* Serial-Key – nur, wenn digital */}
              {isDigital && (
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="gameKey"
                    type="text"
                    placeholder=" "
                    value={digitalKey}
                    onChange={(e) => setDigitalKey(e.target.value)}
                    required
                  />
                  <label htmlFor="gameKey">{t('sell.digitalKey')}</label>
                </Form.Floating>
              )}

              {/* Genres & Plattformen */}
              <ChipPicker
                label={t('sell.genres')}
                options={GENRE_OPTIONS}
                values={genresSel}
                onChange={setGenresSel}
              />
              <ChipPicker
                label={t('sell.platforms')}
                options={PLATFORM_OPTIONS}
                values={platformsSel}
                onChange={setPlatformsSel}
              />
            </Col>

            {/* Rechte Spalte: Bild */}
            <Col lg={5}>
              <Form.Group>
                <Form.Label className="fw-semibold">{t('sell.gameImageURL')}</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>

              {previewUrl && (
                <div
                  className="mt-3 border rounded-4 overflow-hidden"
                  style={{ aspectRatio: '16/9', background: '#000' }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Col>
          </Row>

          {/* Submit */}
          <div className="text-end mt-4">
            <Button variant="primary" type="submit" disabled={loadingSubmit} className="px-4 py-2">
              {loadingSubmit ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" role="status" />
                  {t('sell.creating')}
                </>
              ) : (
                t('sell.createGameAndOfferButton')
              )}
            </Button>
          </div>
        </Form>
      </Container>
    );
  }
