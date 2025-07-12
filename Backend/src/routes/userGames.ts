// src/routes/userGames.ts
import express from 'express';
import { requiresAuthentication } from './authenticator';
import { Offer } from '../model/OfferModel';
import { Spiel } from '../model/SpielModel';

const userGames = express.Router();

/**
 * GET /api/user/games
 * liefert alle Spiele, zu denen der aktuelle User ein Offer hat
 */
userGames.get('/', requiresAuthentication, async (req, res) => {
  try {
    // alle Offers des Users holen
    const offers = await Offer.find({ seller: req.user!.id }).select('game').lean();
    const gameIds = offers.map(o => o.game);

    // zugehörige Spiele abrufen
    const spiele = await Spiel.find({ _id: { $in: gameIds } }).lean();
    res.json(spiele);
  } catch (err) {
    console.error('[user/games] error', err);
    res.sendStatus(500);
  }
});

export default userGames;
