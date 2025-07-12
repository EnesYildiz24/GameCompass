import express from 'express';
import { body, validationResult, matchedData, param } from 'express-validator';
import { optionalAuthentication, requiresAuthentication } from './authenticator';
import { BestellungResource } from '../Resources';
import {
  createBestellung,
  deleteBestellung,
  getAlleBestellungen,
  getBestellung,
  updateBestellung,
} from '../service/BestellungService';
import { Bestellung } from '../model/BestellungModel';

interface CheckoutPayload {
  userId: string;
  product: { offerId: string; amount: number }[];

  shipping?: {
    street: string;
    zip: string;
    city: string;
    country: string;
    provider: string;
    cost: number;
  };

  billing?: {
    // wenn du das brauchst
    street: string;
    zip: string;
    city: string;
    country: string;
    provider: string;
    cost: number;
  };
}

const bestellungRouter = express.Router();

bestellungRouter.get('/alle', optionalAuthentication, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).send('User-ID fehlt');
    return;
  }

  try {
    const bestellungen = await getAlleBestellungen(userId);
    res.status(200).send(bestellungen);
  } catch (err) {
    res.sendStatus(500);
  }
});
// src/routes/bestellung.ts

bestellungRouter.get('/by-session/:sessionId', requiresAuthentication, async (req, res, next) => {
  try {
    const orderDoc = await Bestellung.findOne({
      stripeSessionId: req.params.sessionId,
      userId: req.user!.id,
    }).exec();

    if (!orderDoc) {
      res.status(404).json({ message: 'Bestellung nicht gefunden' });
      return;
    }

    const order = {
      id: orderDoc._id.toString(),
      userId: orderDoc.userId.toString(),
      product: orderDoc.product.map((p) => ({
        spielId: p.spielId.toString(),
        name: p.name,
        price: p.price,
        amount: p.amount,
      })),
      price: orderDoc.price,
      status: orderDoc.status,
      orderAt: orderDoc.orderAt,
      stripeSessionId: orderDoc.stripeSessionId ?? undefined,
      stripePaymentIntentId: orderDoc.stripePaymentIntentId ?? undefined,
    };

    res.json(order);
    return;
  } catch (err) {
    console.error('→ [by-session] error:', err);
    next(err);
    return;
  }
});

bestellungRouter.post(
  '/',
  requiresAuthentication,
  body('userId').isMongoId(),

  body('product').isArray({ min: 1 }),
  body('product.*.offerId').isMongoId(),
  body('product.*.amount').isInt({ min: 1 }),

  /* --- SHIPPING --- */
  body('shipping').optional().isObject(),
  body('shipping.street').if(body('shipping').exists()).isString().notEmpty(),
  body('shipping.zip').if(body('shipping').exists()).isString().notEmpty(),
  body('shipping.city').if(body('shipping').exists()).isString().notEmpty(),
  body('shipping.country').if(body('shipping').exists()).isString().notEmpty(),
  body('shipping.provider').if(body('shipping').exists()).isString().notEmpty(),   //  ✅ NEU
  body('shipping.cost').if(body('shipping').exists()).isFloat({ min: 0 }),

  /* --- BILLING (optional) --- */
  body('billing').optional().isObject(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // matchedData enthält nur Felder, die gecheckt wurden
    const data = matchedData(req, { includeOptionals: true });
    if (data.userId !== req.userId) {
      res.sendStatus(403);
      return;
    }

    const { shipping, billing } = req.body; //  ←  hier NICHT gefiltert!

    /* Sichtkontrolle im Log */
    console.log('[POST /bestellung]  shipping=', shipping);

    try {
      const created = await createBestellung({
        userId : data.userId,
        product: (data.product as any[]).map(p => ({ offerId: p.offerId, amount: p.amount })),
        shipping: data.shipping ?? null,   //  ← enthält JETZT alle Felder
        billing : data.billing  ?? null,
      });

      res.status(201).json(created);
    } catch (err) {
      console.error('Fehler beim Erstellen der Bestellung:', err);
      res.sendStatus(400);
    }
  }
);

bestellungRouter.put(
  '/',
  requiresAuthentication,
  param('id').isMongoId(),
  body('status').isIn(['offen', 'bezahlt', 'storniert']),
  body('price').isFloat({ min: 0 }),
  body('product').isArray({ min: 1 }),
  body('product.*.spielId').isMongoId(),
  body('product.*.name').isString().isLength({ min: 1, max: 100 }),
  body('product.*.price').isFloat({ min: 0 }),
  body('product.*.amount').isInt({ min: 1 }),

  async (req, res): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const data = matchedData(req) as BestellungResource;

      const updated = await updateBestellung(data);
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

bestellungRouter.delete(
  '/:id',
  requiresAuthentication,
  param('id').isMongoId(),

  async (req, res): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const bestellId = req.params.id;

      // Sicherheitsprüfung
      const bestellung = await Bestellung.findById(bestellId).exec();
      if (!bestellung) {
        res.sendStatus(404);
        return;
      }

      if (bestellung.userId.toString() !== req.userId) {
        res.sendStatus(403);
        return;
      }

      await deleteBestellung(bestellId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

bestellungRouter.get(
  '/:id',
  optionalAuthentication,
  param('id').isMongoId(),

  async (req, res): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const orderId = req.params.id;
      const bestellung = await getBestellung(orderId);

      // Nur der Besitzer darf die Bestellung sehen
      if (bestellung.userId.toString() !== req.userId) {
        res.sendStatus(403);
        return;
      }

      res.status(200).json(bestellung);
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: (err as Error).message });
    }
  }
);

export default bestellungRouter;
