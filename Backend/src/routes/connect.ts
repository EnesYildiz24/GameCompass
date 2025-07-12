import express from 'express';
import { stripe } from '../lib/stripe';
import { requiresAuthentication } from './authenticator';
import { User } from '../model/UserModel';

const connectRoutes = express.Router();

// a) Account anlegen und zum On-Boarding weiterleiten
connectRoutes.post('/create-account', requiresAuthentication, async (req, res) => {
  // 1) User aus DB laden
  const userDoc = await User.findById(req.user?.id);

  // 2) Falls kein User gefunden, 401
  if (!userDoc) {
    res.status(401).send('Kein gültiger User gefunden');
    return
  }

  // 4) Hat der User bereits ein Stripe-Konto?
  if (userDoc.stripeAccountId) {
    // → Wenn ja, zurückgeben: erneutes Onboarding bzw. Link zum Fertigstellen
    const existingUrl = await createLink(userDoc.stripeAccountId);
    res.json({ url: existingUrl });
    return
  }

  // 5) Noch kein Stripe-Konto: neues Express-Account anlegen
  const account = await stripe.accounts.create({
    type: 'express',
    email: userDoc.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  // 6) Account-ID speichern
  userDoc.stripeAccountId = account.id;
  await userDoc.save();

  // 7) Onboarding-Link erstellen und zurückgeben
  const url = await createLink(account.id);
  res.json({ url }); return
});

// Helfer für das Account-Link-Objekt
async function createLink(acctId: string) {
  const link = await stripe.accountLinks.create({
    account: acctId,
    refresh_url: `${process.env.CORS_ORIGIN}/connect/refresh`,
    return_url: `${process.env.CORS_ORIGIN}/connect/return`,
    type: 'account_onboarding',
  });
  return link.url;
}

export { connectRoutes };
