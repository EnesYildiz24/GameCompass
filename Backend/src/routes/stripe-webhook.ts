// routes/stripeWebhook.ts
import express from 'express';
import { stripe } from '../lib/stripe';
import Stripe from 'stripe';
import Bestellung from '../model/BestellungModel';
import { User } from '../model/UserModel';

const router = express.Router();

/* ---------- 1) Standard-Checkout-Webhook --------------------------- */
router.post(
  '/', // →  /api/stripe/webhook
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event: Stripe.Event;

    /* Signatur verifizieren ----------------------------------------- */
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'] as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('[webhook] signature failed', err);
      res.status(400).send('signature error');
      return;
    }

    /* Session abgeschlossen ---------------------------------------- */
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[debug] Stripe session.id', session.id);

      const orderDoc = await Bestellung.findOne({ stripeSessionId: session.id });
      console.log('[debug] order gefunden?', !!orderDoc);

      if (!orderDoc) {
        res.json({ received: true });
        return;
      }
      orderDoc.status = 'bezahlt';
      orderDoc.stripePaymentIntentId = String(session.payment_intent ?? '');
      console.log('[debug] status vor save', orderDoc.status);

      await orderDoc.save(); // triggert Post-Hook
      console.log('[webhook] Bestellung bezahlt & Mail verschickt', orderDoc._id);
    }
  }
);

/* ---------- 2) Connect-Webhook (Vendor-Accounts) ------------------- */
router.post(
  '/connect', // →  /api/stripe/webhook/connect
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event: Stripe.Event;

    /* Signatur verifizieren ----------------------------------------- */
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'] as string,
        process.env.STRIPE_CONNECT_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('[connect-webhook] signature failed', err);
      res.status(400).send('signature error');
      return;
    }

    /* Account-Updates in der Platform ------------------------------ */
    if (event.type === 'account.updated') {
      const acc = event.data.object as Stripe.Account;

      try {
        await User.updateOne(
          { stripeAccountId: acc.id },
          {
            chargesEnabled: acc.charges_enabled,
            payoutsEnabled: acc.payouts_enabled,
          }
        );
        console.log('[connect-webhook] account.updated', acc.id);
      } catch (error) {
        console.error('[connect-webhook] Fehler beim User-Update:', error);
      }
    }

    res.json({ received: true });
    return;
  }
);

export default router;
