import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Stripe: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="service-detail-container">
      <h1><span>💎</span> <span className="gradient-text">Stripe Integration & Webhooks</span></h1>
      <p className="subtitle">GameCompass Backend - Stripe-Client und Connect-Webhook Verarbeitung</p>
      
      <div className="section">
        <h2>📋 Beschreibung</h2>
        <p>Dieses Modul <code>/Backend/Integrations/Payments/Stripe.ts</code> und die zugehörige Express-Route <code>/connect-webhook</code> realisieren:</p>
        <ul>
          <li>Initialisierung des Stripe-Clients</li>
          <li>Empfangen und Verarbeiten von Stripe-Connect Webhooks</li>
        </ul>
      </div>

      <div className="section">
        <h2>🔧 Stripe-Client</h2>
        <div className="client-info">
          <p><strong>Datei:</strong> <code>/Backend/lib/stripe.ts</code></p>
          <div className="code-block">
            <pre><code>{`import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});`}</code></pre>
          </div>
          <ul>
            <li><strong><code>STRIPE_SECRET_KEY</code>:</strong> Secret-Key für alle Server-Requests</li>
            <li>API-Version fest auf <code>2025-04-30.basil</code></li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🔗 Webhook-Route</h2>
        <div className="webhook-info">
          <p><strong>Datei:</strong> <code>/Backend/Integrations/Payments/connect-webhook.ts</code></p>
          <div className="code-block">
            <pre><code>{`router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    // Signatur prüfen und Event parsen
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'] as string,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET!
    );

    // Account-Update verarbeiten
    if (event.type === 'account.updated') {
      const acc = event.data.object as Stripe.Account;
      // Update charges/payouts in User-Dokument
      await User.updateOne(
        { stripeAccountId: acc.id },
        {
          chargesEnabled: acc.charges_enabled,
          payoutsEnabled: acc.payouts_enabled,
        }
      ).exec();
    }

    res.json({ received: true });
  }
);`}</code></pre>
          </div>
          <div className="important-note">
            <p><strong>Wichtig:</strong> Diese Route muss vor <code>express.json()</code> registriert werden, um rohen Body zu erhalten.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>⚙️ Umgebungsvariablen</h2>
        <div className="env-list">
          <ul>
            <li><code>STRIPE_SECRET_KEY</code>: Server-seitiger Stripe-API-Key</li>
            <li><code>STRIPE_CONNECT_WEBHOOK_SECRET</code>: Signing-Secret für Connect-Account-Webhooks</li>
            <li><code>NODE_ENV</code>: <code>development</code> | <code>production</code></li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>🔄 Ablauf</h2>
        <div className="flow-steps">
          <div className="step">
            <h4>1. Webhook-Empfang</h4>
            <p>Stripe sendet POST mit JSON-Rohdaten.</p>
          </div>
          
          <div className="step">
            <h4>2. Signatur-Validierung</h4>
            <p><code>stripe.webhooks.constructEvent(body, signature, webhookSecret)</code></p>
          </div>
          
          <div className="step">
            <h4>3. Event-Verarbeitung</h4>
            <ul>
              <li>Nur <code>account.updated</code> Events behandeln</li>
              <li>Feldänderungen <code>charges_enabled</code> und <code>payouts_enabled</code> im User-Repo speichern</li>
            </ul>
          </div>
          
          <div className="step">
            <h4>4. Antwort</h4>
            <p><code>{`{ received: true }`}</code> an Stripe senden.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>💳 Features</h2>
        <ul>
          <li>Kreditkarten-Verarbeitung</li>
          <li>Subscription Management</li>
          <li>Webhook-Integration</li>
          <li>Fraud Detection</li>
          <li>Multi-Currency Support</li>
        </ul>
      </div>

      <div className="section">
        <h2>❌ Fehlerbehandlung & Statuscodes</h2>
        <div className="error-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Bedingung</th>
                <th>Reaktion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>400</td>
                <td>Signatur-Validierung schlägt fehl</td>
                <td><code>Webhook error</code> + 400</td>
              </tr>
              <tr>
                <td>500</td>
                <td>Datenbank-Fehler</td>
                <td><code>Server error</code> + 500 (optional)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 