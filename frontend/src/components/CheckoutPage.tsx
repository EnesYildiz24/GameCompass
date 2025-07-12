// src/pages/CheckoutPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCart, startCheckout, createBestellung, BestellungPayload } from '../backend/api';
import { useAuth } from '../context/AuthContext'; // falls du so etwas hast
import { useTheme } from '../context/ThemeContext';
import { Container, Card, Button, Row, Col, Alert, Form } from 'react-bootstrap';

interface CartItem {
  offerId: string;
  gameId: string;
  name: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  background_image?: string;
}

const SHIPPING_OPTIONS = [
  { provider: 'DHL', cost: 4.99 },
  { provider: 'DPD', cost: 3.99 },
  { provider: 'Hermes', cost: 5.49 },
] as const;

export default function CheckoutPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [provider, setProvider] = useState<(typeof SHIPPING_OPTIONS)[number] | null>(null);

  // getrennte Adressen
  const [shippingAddr, setShippingAddr] = useState({
    street: '',
    zip: '',
    city: '',
    country: '',
  });
  const [billingAddr, setBillingAddr] = useState({
    street: '',
    zip: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    fetchCart()
      .then((cs) => {
        // Falls isDigital fehlt → false (= physisch) oder true, je nach Wunsch defaulten
        const normalized = cs.map((item: any) => ({
          ...item,
          isDigital: item.isDigital === true,
        }));
        console.log('Normalized cart:', normalized);
        setCart(normalized);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Prüfen ob wenigstens ein physisches / digitales Item dabei ist
  const hasPhysical = cart.some((c) => !c.isDigital);
  const hasDigital = cart.some((c) => c.isDigital);
  const onlyDigital = cart.length > 0 && !hasPhysical;
  const showBilling = onlyDigital;
  const showShipping = hasPhysical;

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const shippingCost = hasPhysical && provider ? provider.cost : 0;
  const total = subtotal + shippingCost;

  // Validierung:
  //   – Wenn physisch dabei, dann shippingAddr + provider müssen komplett sein
  //   – Wenn digital dabei, dann billingAddr muss komplett sein
  const shippingValid =
    !hasPhysical || (!!provider && Object.values(shippingAddr).every((v) => v.trim() !== ''));
  const billingValid = !hasDigital || Object.values(billingAddr).every((v) => v.trim() !== '');

  const formValid =
    (!showShipping || (provider && Object.values(shippingAddr).every((v) => v.trim()))) &&
    (!showBilling || Object.values(billingAddr).every((v) => v.trim()));
  async function payNow() {
    if (!formValid) {
      alert(
        [
          hasPhysical && !shippingValid && 'Bitte Versandadresse + Dienst ausfüllen.',
          hasDigital && !billingValid && 'Bitte Rechnungsadresse ausfüllen.',
        ]
          .filter(Boolean)
          .join('\n')
      );
      return;
    }

    try {
      /* 1 ) Payload für /api/bestellung bauen --------------------- */
      const payload: BestellungPayload = {
        userId: user!.id, // << aktuelle User-ID
        product: cart.map((i) => ({
          offerId: i.offerId,
          amount: i.quantity,
        })),
        shipping: hasPhysical
          ? {
              street: shippingAddr.street,
              zip: shippingAddr.zip,
              city: shippingAddr.city,
              country: shippingAddr.country,
              provider: provider!.provider,
              cost: shippingCost,
            }
          : undefined,
        billing: hasDigital
          ? {
              street: billingAddr.street,
              zip: billingAddr.zip,
              city: billingAddr.city,
              country: billingAddr.country,
              provider: 'Rechnung',
              cost: 0,
            }
          : undefined,
      };

      /* 2 ) Bestellung im Backend anlegen ------------------------- */
      const order = await createBestellung(payload); // Antwort z.B. { id, price, … }

      /* 3 ) Stripe-Session erstellen ------------------------------ */
      //   → Dein altes Endpoint /api/checkout nimmt jetzt nur noch die orderId
      const { url } = await startCheckout({ orderId: order.id });

      /* 4 ) Weiterleiten ----------------------------------------- */
      window.location.assign(url);
    } catch (err) {
      console.error('Checkout-Fehler:', err);
      alert('Checkout fehlgeschlagen. Bitte versuch’s noch einmal.');
    }
  }
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" />
        <p>Lade …</p>
      </Container>
    );
  }

  return (
    <div
      style={{
        background: isDark ? '#191a1f' : '#f7f7f7',
        minHeight: '100vh',
        padding: 0,
      }}
    >
      <Container
        className="p-4"
        style={{
          maxWidth: 700,
          marginTop: 40,
          borderRadius: 18,
          background: isDark ? '#232328' : '#fff',
          color: isDark ? '#fff' : '#222',
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,.4)' : '0 2px 12px rgba(0,0,0,.08)',
        }}
      >
        <h2 className="text-center mb-4 fw-bold">Dein Checkout</h2>

        {cart.length === 0 ? (
          <Alert variant={isDark ? 'info' : 'secondary'} className="text-center">
            Dein Warenkorb ist leer.
            <br />
            <Button
              variant={isDark ? 'light' : 'primary'}
              className="mt-2"
              onClick={() => navigate('/games')}
            >
              Zurück zu den Spielen
            </Button>
          </Alert>
        ) : (
          <>
            {/* Positionen */}
            <Card
              className="mb-4 shadow-sm border-0"
              style={{ background: isDark ? '#20212a' : '#fafbfc', borderRadius: 16 }}
            >
              <Card.Body>
                {cart.map((ci) => (
                  <Row key={ci.offerId} className="align-items-center mb-2">
                    <Col xs={7}>
                      {ci.name}
                      <div className="text-muted small">
                        {ci.quantity}×{ci.price.toFixed(2)}€
                      </div>
                    </Col>
                    <Col xs={5} className="text-end fw-medium">
                      {(ci.quantity * ci.price).toFixed(2)}€
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>

            {/* Versand nur bei physischen Artikeln */}
            {hasPhysical && (
              <Card
                className="mb-4 shadow-sm border-0"
                style={{ background: isDark ? '#20212a' : '#fafbfc', borderRadius: 16 }}
              >
                <Card.Body>
                  <h5 className="mb-3">Versand</h5>
                  <Form.Select
                    className="mb-3"
                    value={provider?.provider || ''}
                    onChange={(e) => {
                      const p = SHIPPING_OPTIONS.find((o) => o.provider === e.target.value);
                      setProvider(p || null);
                    }}
                  >
                    <option value="">Dienst wählen …</option>
                    {SHIPPING_OPTIONS.map((o) => (
                      <option key={o.provider} value={o.provider}>
                        {o.provider} (+{o.cost.toFixed(2)}€)
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    className="mb-2"
                    placeholder="Straße & Hausnummer"
                    value={shippingAddr.street}
                    onChange={(e) => setShippingAddr((s) => ({ ...s, street: e.target.value }))}
                  />
                  <Row className="g-2 mb-2">
                    <Col sm={4}>
                      <Form.Control
                        placeholder="PLZ"
                        value={shippingAddr.zip}
                        onChange={(e) => setShippingAddr((s) => ({ ...s, zip: e.target.value }))}
                      />
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        placeholder="Ort"
                        value={shippingAddr.city}
                        onChange={(e) => setShippingAddr((s) => ({ ...s, city: e.target.value }))}
                      />
                    </Col>
                  </Row>
                  <Form.Control
                    placeholder="Land"
                    value={shippingAddr.country}
                    onChange={(e) => setShippingAddr((s) => ({ ...s, country: e.target.value }))}
                  />
                </Card.Body>
              </Card>
            )}

            {/* Rechnungsadresse für digitale Artikel */}
            {showBilling && (
              <Card
                className="mb-4 shadow-sm border-0"
                style={{ background: isDark ? '#20212a' : '#fafbfc', borderRadius: 16 }}
              >
                <Card.Body>
                  <h5 className="mb-3">Rechnungsadresse</h5>
                  <Form.Control
                    className="mb-2"
                    placeholder="Straße & Hausnummer"
                    value={billingAddr.street}
                    onChange={(e) => setBillingAddr((b) => ({ ...b, street: e.target.value }))}
                  />
                  <Row className="g-2 mb-2">
                    <Col sm={4}>
                      <Form.Control
                        placeholder="PLZ"
                        value={billingAddr.zip}
                        onChange={(e) => setBillingAddr((b) => ({ ...b, zip: e.target.value }))}
                      />
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        placeholder="Ort"
                        value={billingAddr.city}
                        onChange={(e) => setBillingAddr((b) => ({ ...b, city: e.target.value }))}
                      />
                    </Col>
                  </Row>
                  <Form.Control
                    placeholder="Land"
                    value={billingAddr.country}
                    onChange={(e) => setBillingAddr((b) => ({ ...b, country: e.target.value }))}
                  />
                </Card.Body>
              </Card>
            )}

            {/* Summen */}
            <div className="mb-3 px-2">
              <Row className="mb-1">
                <Col>Zwischensumme</Col>
                <Col className="text-end">{subtotal.toFixed(2)}€</Col>
              </Row>
              {hasPhysical && (
                <Row className="mb-1">
                  <Col>Versand</Col>
                  <Col className="text-end">{shippingCost.toFixed(2)}€</Col>
                </Row>
              )}
              <Row className="mb-2 fw-bold">
                <Col>Gesamt</Col>
                <Col className="text-end">{total.toFixed(2)}€</Col>
              </Row>
            </div>

            {/* Buttons */}
            <Row>
              <Col xs={12} md={6}>
                <Button
                  variant="secondary"
                  className="w-100 mb-2"
                  onClick={() => navigate('/cart')}
                >
                  Zurück zum Warenkorb
                </Button>
              </Col>
              <Col xs={12} md={6}>
                <Button
                  variant="success"
                  className="w-100 mb-2 fw-bold"
                  disabled={!formValid}
                  onClick={payNow}
                >
                  Jetzt bezahlen
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}
