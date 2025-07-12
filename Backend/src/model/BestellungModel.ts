import { Schema, model, Types, Document } from 'mongoose';
import { sendOrderConfirmationEmail } from '../mail/confirmation';

/* ---------- Sub-Typen ---------- */

export interface OrderedProduct {
  offerId: Types.ObjectId;
  spielId: Types.ObjectId;
  name: string;
  price: number;
  amount: number;
  /** übernommen aus Offer  */
  isDigital: boolean;
  shippingCost?: number;  // optional, falls physisch
  licenseKeys?: string[]; 
}

/* ---------- Haupt-Interface ---------- */

export interface IBestellung extends Document {
  _id: Types.ObjectId;   
  userId: Types.ObjectId;
  product: OrderedProduct[];
  price: number;          // Gesamtpreis inkl. Versand
  status: 'offen' | 'bezahlt' | 'storniert';
  orderAt: Date;

  /* Stripe */
  stripeSessionId?: string;
  stripePaymentIntentId?: string;

  /* Versand – nur belegt, falls mind. ein Artikel physisch ist */
  shippingAddress?: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  shippingProvider?: string;
  shippingCost?: number;   // default 0
  emailSent?: boolean;  
}

/* ---------- Schema ---------- */

const BestellungSchema = new Schema<IBestellung>(
  {
    product: [
      {
        offerId: { type: Types.ObjectId, ref: 'Offer', required: true },
        spielId: { type: Types.ObjectId, ref: 'Spiel', required: true },
        name:    { type: String, required: true },
        price:   { type: Number, required: true },
        amount:  { type: Number, required: true },
        isDigital: { type: Boolean, required: true },   // NEU
        shippingCost: { type: Number, default: 0 },    // optional
        licenseKeys: [String],
      },
    ],

    price:  { type: Number, required: true },

    status: {
      type: String,
      enum: ['offen', 'bezahlt', 'storniert'],
      default: 'offen',
    },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    /* Stripe */
    stripeSessionId:       String,
    stripePaymentIntentId: String,

    /* Versand – alle optional */
    shippingAddress: {
      street:  String,
      zip:     String,
      city:    String,
      country: String,
    },
    shippingProvider: String,
    shippingCost:    { type: Number, default: 0 },
    emailSent:{ type:Boolean, default:false },  
  },
  { timestamps: true }
);

BestellungSchema.pre('validate', function (next) {
  const itemsTotal = this.product.reduce(
    (sum, p) => sum + p.price * p.amount,
    0
  );
  this.price = itemsTotal + (this.shippingCost || 0);
  next();
});

BestellungSchema.post('save', async function (doc: IBestellung) {
  if (doc.status === 'bezahlt' && !doc.emailSent) {
    try {
      await sendOrderConfirmationEmail(doc);
      doc.emailSent = true;
      await doc.save();                 // Doppelversand verhindern
    } catch (err) {
      console.error('❌ E-Mail-Versand fehlgeschlagen:', err);
      /* hier könntest du z. B. einen Retry-Job in eine Queue legen */
    }
  }
});

export const Bestellung = model<IBestellung>('Bestellung', BestellungSchema);
export default Bestellung;
