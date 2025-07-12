import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getOrderBySession, OrderDetails } from '../backend/api';
import { Button, Spinner, Container, Alert, Table } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

export function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Body-Hintergrund umschalten
  useEffect(() => {
    document.body.style.background = isDark ? 'var(--page-bg)' : '#fff';
    return () => {
      document.body.style.background = '';
    };
  }, [isDark]);

  useEffect(() => {
    if (!sessionId) return;
    getOrderBySession(sessionId)
      .then(o => setOrder(o))
      .catch(() => navigate('/cart'))
      .finally(() => setLoading(false));
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant={isDark ? 'light' : 'dark'} />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant={isDark ? 'warning' : 'danger'}>
          Bestelldaten konnten nicht geladen werden.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      className={`py-5 rounded-4 shadow-sm`}
      style={{
        backgroundColor: isDark ? '#242424' : '#fff',
        color: isDark ? '#e0e0e0' : '#111'
      }}
    >
      <h1 style={{ color: isDark ? '#fff' : '#000' }}>
        Vielen Dank für Ihren Einkauf!
      </h1>
      <p className="lead">
        Ihre Bestellung <strong>#{order.id}</strong> wurde erfolgreich abgeschlossen.
      </p>

      <Table
        variant={isDark ? 'dark' : undefined}
        striped
        hover
        bordered={!isDark}
        className="mb-4"
      >
        <thead>
          <tr>
            <th>Spiel</th>
            <th>Anzahl</th>
            <th>Einzelpreis</th>
            <th>Gesamt</th>
          </tr>
        </thead>
        <tbody>
          {order.product.map(item => (
            <tr key={item.spielId}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{item.price.toFixed(2)} €</td>
              <td>{(item.price * item.amount).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 style={{ color: isDark ? '#fff' : '#000' }}>
        Gesamtsumme: {order.price.toFixed(2)} €
      </h4>

      <div className="mt-4">
        <Button
          variant="primary"
          onClick={() => navigate('/games')}
          className="me-2"
        >
          Weiter shoppen
        </Button>
        <Button
          variant={isDark ? 'outline-light' : 'secondary'}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
      </div>
    </Container>
  );
}
