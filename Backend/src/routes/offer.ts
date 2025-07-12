import { Router, Request, Response } from 'express';
import { requiresAuthentication } from './authenticator';
import {
  createOffer,
  getAllOffers,
  getOfferById,
  deleteOffer,
  updateOffer,
} from '../service/OfferService';
import { Offer } from '../model/OfferModel';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

const offerRouter = Router();

interface RequestUser {
  _id?: string;
  username?: string;
  role?: string;
  isPublisher?: boolean;
}

offerRouter.get('/offers', async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate('game') // <-- wichtig
      .populate('seller'); // <-- wichtig
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Angebote' });
  }
});

// Alle Angebote abrufen (optional: nach Spiel)
offerRouter.get('/', async (req, res) => {
  try {
    const offers = await Offer.find().populate('game').populate('seller');
    console.log(JSON.stringify(offers[0], null, 2));

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Angebote', err });
  }
});

// Einzelnes Angebot abrufen
offerRouter.get('/:id', async (req, res) => {
  try {
    const offer = await getOfferById(req.params.id);
    if (!offer) {
      res.status(404).json({ message: 'Angebot nicht gefunden' });
      return;
    }
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Angebots', err });
  }
});

// POST /api/offers
offerRouter.post(
  '/',
  requiresAuthentication,
  body('game').isMongoId(),
  body('price').isFloat({ min: 0 }),
  body('condition').isIn(['new', 'used']),
  body('availability').isBoolean(),
  body('isDigital').isBoolean().optional(),     // ① NEU
  body('key').isString().optional(),            // ① NEU
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
       return
    }
    const {
      game,
      price,
      condition,
      availability,
      isDigital = true,      // fallback auf default
      key,
    } = req.body;

    const offer = await Offer.create({
      game: new mongoose.Types.ObjectId(game),
      seller: new mongoose.Types.ObjectId(req.user!.id), 
      price,
      condition,
      availability,
      isDigital,             // ② speichern
      key: isDigital ? key : undefined,
      sellerInfo: {
        displayName: req.user!.username,
        // … evtl. email
      },
    });

    res.status(201).json({ id: offer._id });
  }
);

// Angebot löschen (nur vom Seller oder Admin)
offerRouter.delete('/:id', requiresAuthentication, async (req, res) => {
  const user = req.user as RequestUser;

  if (!user || !user._id || !user.role) {
    res.status(401).json({ message: 'Nicht authentifiziert oder User-Info unvollständig.' });
    return;
  }

  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      res.status(404).json({ message: 'Angebot nicht gefunden' });
      return;
    }

    // Kontrolle: Nur Seller oder Admin darf löschen
    if (offer.seller.toString() !== user._id && user.role !== 'admin') {
      res.status(403).json({ message: 'Nicht berechtigt.' });
      return;
    }

    await deleteOffer(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Löschen des Angebots', err });
  }
});

// Angebot aktualisieren (optional)
offerRouter.put('/:id', requiresAuthentication, async (req, res) => {
  const user = req.user as RequestUser;

  if (!user || !user._id || !user.role) {
    res.status(401).json({ message: 'Nicht authentifiziert oder User-Info unvollständig.' });
    return;
  }

  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      res.status(404).json({ message: 'Angebot nicht gefunden' });
      return;
    }

    // Kontrolle: Nur Seller oder Admin darf updaten
    if (offer.seller.toString() !== user._id && user.role !== 'admin') {
      res.status(403).json({ message: 'Nicht berechtigt.' });
      return;
    }

    // Nur Preis und evtl. Zustand (bei Publisher) editierbar
    let updateData: any = {};
    if (req.body.price) updateData.price = req.body.price;
    if (user.isPublisher && req.body.condition) updateData.condition = req.body.condition;
    if (!user.isPublisher) updateData.condition = 'used';

    const updated = await updateOffer(req.params.id, updateData);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Angebots', err });
  }
});

export { offerRouter };
