import { Card, Badge } from 'react-bootstrap';
import { OfferResource } from '../Resources';

interface Props { offer: OfferResource }

export function OfferCard({ offer }: Props) {
  const { game, price, condition, createdAt, sellerInfo } = offer;
  const created = new Date(createdAt).toLocaleDateString('de-DE');

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <h5 className="fw-bold mb-2">{typeof game === 'string' ? 'Spiel' : game.name}</h5>

        <p className="mb-1">
          <Badge bg={condition === 'new' ? 'success' : 'secondary'}>
            {condition === 'new' ? 'Neu' : 'Gebraucht'}
          </Badge>{' '}
          <span className="fw-semibold">{price.toFixed(2)} €</span>
        </p>

        {/* ---------- NEU: Verkäufer‐Infos ---------- */}
        <div className="small text-muted mt-3">
          <div><strong>Verkäufer:</strong> {sellerInfo.displayName}</div>
          <div>
            <strong>Kontakt:</strong>{' '}
            {sellerInfo.email
              ? <a href={`mailto:${sellerInfo.email}`}>{sellerInfo.email}</a>
              : '—'}
          </div>
          <div><strong>Inseriert am:</strong> {created}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
