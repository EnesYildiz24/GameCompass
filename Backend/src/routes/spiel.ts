import { Router } from 'express';
import axios from 'axios';
import {
  createSpiel,
  deleteSpiel,
  getAlleSpiele,
  getSpiel,
  updateSpiel,
} from '../service/SpielService';
import { optionalAuthentication, requiresAuthentication } from './authenticator';
import { body, matchedData, param, validationResult } from 'express-validator';
import { SpielResource } from '../Resources';
import { Spiel } from '../model/SpielModel';

const spielRouter = Router();

spielRouter.post('/import-rawg', async (req, res) => {
  try {
    const spiele = [];
    const pagesToFetch = 30;
    const pageSize = 40;

    for (let page = 1; page <= pagesToFetch; page++) {
      const response = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key: process.env.RAWG_API_KEY,
          page_size: pageSize,
          page: page,
          ordering: '-rating',
          metacritic: '75,100',
        },
      });

      for (const game of response.data.results) {
        const existing = await Spiel.findOne({ name: game.name });
        if (existing) continue;

        let gameDetails;
        try {
          const detailResponse = await axios.get(`https://api.rawg.io/api/games/${game.id}`, {
            params: { key: process.env.RAWG_API_KEY },
          });
          gameDetails = detailResponse.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response && error.response.status === 404) {
                continue;
              }
              throw error;
            } else {
              // Fehler ist kein AxiosError (z. B. SyntaxError etc.)
              throw error;
            }
          }

          const backgroundImage = gameDetails.background_image || game.background_image;
          if (!backgroundImage) {
            // Optional: Log für Debugging
            continue; // Dieses Spiel überspringen
          }
        spiele.push({
          name: game.name,
          description:
            gameDetails.description_raw ||
            gameDetails.description ||
            `Ein spannendes ${game.genres[0]?.name || 'Spiel'}`,
          price: Math.floor(Math.random() * 60) + 10,
          released: game.released ? new Date(game.released) : null,
          availability: true,
          background_image: game.background_image,
          rating: game.rating,
          genres: game.genres.map((g: any) => ({ id: g.id, name: g.name })),
          platforms: game.platforms.map((p: any) => ({ platform: { name: p.platform.name } })),
        });
      }
    }

    await Spiel.insertMany(spiele);
    res.status(201).json({ message: 'RAWG-Spiele importiert!', count: spiele.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Importieren der RAWG-Spiele' });
  }
});

spielRouter.get('/', async (req, res) => {
  try {
    const spiele = await getAlleSpiele();
    res.status(200).json(spiele);
  } catch (error) {
    console.error('Fehler beim Abrufen der Spiele:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Spiele' });
  }
});

spielRouter.get('/all', async (req, res) => {
  try {
    const spiele = await Spiel.find().exec();
    res.status(200).json(spiele);
  } catch (error) {
    console.error('Fehler beim Abrufen der Spiele:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Spiele' });
  }
});

spielRouter.post(
  '/',
  requiresAuthentication,
  body('name').isString().isLength({ min: 1, max: 200 }),
  body('description').isString().isLength({ min: 1, max: 2000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('released').optional().isISO8601(),
  body('developer').optional().isString(),
  body('availability').optional().isBoolean(),
  body('background_image').isString().notEmpty(),
  body('rating').isFloat({ min: 0, max: 5 }),
  body('genres').isArray().notEmpty(),
  body('genres.*.id').isInt({ min: 0 }),
  body('genres.*.name').isString().notEmpty(),
  body('platforms').isArray().notEmpty(),
  body('platforms.*.platform.name').isString().notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const spielResource = matchedData(req) as SpielResource;
      const createdSpiel = await createSpiel(spielResource);
      res.status(201).json(createdSpiel);
    } catch (error) {
      console.error('Fehler beim Erstellen des Spiels:', error);
      res.status(500).json({ message: 'Fehler beim Erstellen des Spiels' });
    }
  }
);

spielRouter.put(
  '/',
  requiresAuthentication,
  body('id').isMongoId(),
  body('name').isString().isLength({ min: 1, max: 200 }),
  body('description').isString().isLength({ min: 1, max: 2000 }),
  body('price').isFloat({ min: 0 }),
  body('genres').isString().notEmpty(),
  body('released').optional().isISO8601(),
  body('developer').optional().isString(),
  body('availability').optional().isBoolean(),
  body('popularity').optional().isInt({ min: 0 }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const spielResource = matchedData(req) as SpielResource;
      const updatedSpiel = await updateSpiel(spielResource);
      res.status(200).json(updatedSpiel);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Spiels:', error);
      res.status(500).json({ message: 'Fehler beim Aktualisieren des Spiels' });
    }
  }
);

spielRouter.delete(
  '/:id',
  requiresAuthentication,
  param('id').isMongoId(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const spielId = req.params.id;

    try {
      await deleteSpiel(spielId);
      res.sendStatus(204);
    } catch (error) {
      console.error('Fehler beim Löschen des Spiels:', error);
      res.status(404).json({ message: 'Spiel nicht gefunden oder konnte nicht gelöscht werden' });
    }
  }
);

spielRouter.get(
  '/:id',
  optionalAuthentication,
  param('id').isMongoId(),

  async (req, res): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const id = req.params.id;

    try {
      const spiel = await getSpiel(id);
      res.status(200).json(spiel);
    } catch (error) {
      console.error('Fehler beim Abrufen des Spiels:', error);
      res.status(404).json({ message: 'Spiel nicht gefunden' });
    }
  }
);

export { spielRouter };
