// src/routes/checkout.ts
import express, { Request, Response } from 'express';
import { stripe }        from '../lib/stripe';
import { Bestellung }    from '../model/BestellungModel';
import { Offer }         from '../model/OfferModel';
import { IUser }         from '../model/UserModel';
import { requiresAuthentication } from './authenticator';
import { Document }      from 'mongoose';

const router = express.Router();

/**
 * Client schickt nur noch { orderId }
 * – alle Produkt-, Preis- und Versand­infos liegen bereits in der Bestellung
 */
router.post(
  '/',
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.body as { orderId: string };

    /* 1) Bestellung laden ------------------------------------------------ */
    const order = await Bestellung.findById(orderId).lean();
    if (!order) {
      res.status(404).json({ message: 'Bestellung nicht gefunden' });
      return;
    }

    try {
      /* 2) Stripe-Line-Items aus order.product --------------------------- */
      const line_items = order.product.map(p => ({
        price_data: {
          currency:     'eur',
          product_data: { name: p.name },
          unit_amount:  Math.round(p.price * 100),
        },
        quantity: p.amount,
      }));

      /* Versand anhängen (falls vorhanden) ------------------------------ */
      if (order.shippingProvider && order.shippingCost) {
        line_items.push({
          price_data: {
            currency:     'eur',
            product_data: { name: `Versand (${order.shippingProvider})` },
            unit_amount:  Math.round(order.shippingCost * 100),
          },
          quantity: 1,
        });
      }

      /* 3) Seller/Payout bestimmen (vereinfacht: erster Offer) ----------- */
      const firstOffer = await Offer.findById(order.product[0].offerId)
        .populate<{ seller: IUser & Document }>('seller')
        .lean();

      if (
        !firstOffer?.seller?.stripeAccountId ||
        !firstOffer.seller.chargesEnabled
      ) {
        res.status(400).json({ message: 'Seller nicht payout-fähig' });
        return;
      }

      /* 4) Stripe-Session anlegen --------------------------------------- */
      const session = await stripe.checkout.sessions.create({
        mode:        'payment',
        line_items,
        success_url: `${process.env.CORS_ORIGIN}/#/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${process.env.CORS_ORIGIN}/#/cart`,
        metadata:    { orderId, userId: req.user!.id.toString() },
        payment_intent_data: {
          application_fee_amount: Math.round(order.price * 0.05 * 100),
          transfer_data: { destination: firstOffer.seller.stripeAccountId },
        },
      });

      /* 5) Session-ID in der Bestellung sichern ------------------------- */
      await Bestellung.updateOne(
        { _id: orderId },
        { stripeSessionId: session.id }
      );

      /* 6) Checkout-URL zurück ----------------------------------------- */
      res.json({ url: session.url });
    } catch (err) {
      console.error('[checkout] ERROR:', err);
      res.status(500).json({ message: (err as Error).message });
    }
  }
);

export default router;
