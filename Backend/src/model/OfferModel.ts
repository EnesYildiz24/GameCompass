import { Schema, model, Types, Document } from 'mongoose';

export interface SellerInfo {
  displayName: string;
  email?: string;                // nur, falls seller.showEmail === true
}

export interface IOffer extends Document {
  _id: Types.ObjectId;   
  game: Types.ObjectId;
  seller: Types.ObjectId;
  price: number;
  condition: 'new' | 'used';
  availability: boolean;
  /**  true ⇒ Key/Download – false ⇒ physische Box  */
  isDigital: boolean;
  key?:        string; 
  sellerInfo: SellerInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    game:         { type: Schema.Types.ObjectId, ref: 'Spiel', required: true },
    seller:       { type: Schema.Types.ObjectId, ref: 'User',  required: true },
    price:        { type: Number, required: true },
    condition:    { type: String, enum: ['new', 'used'], required: true },
    availability: { type: Boolean, required: true },

    /** NEU */
    isDigital:    { type: Boolean, default: true },
    key:          { type: String },                        // ← optional

    sellerInfo: {
      displayName: { type: String, required: true },
      email:       { type: String },               // optional
    },
  },
  { timestamps: true }
);

export const Offer = model<IOffer>('Offer', OfferSchema);
export default Offer;
