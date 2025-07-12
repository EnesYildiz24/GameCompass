import mongoose, { Schema, Document } from 'mongoose';

// Interface für ein Element im Warenkorb
export interface CartItem {
  _id?: string;
  offerId: string;
  gameId: string;
  name: string;
  price: number;
  quantity: number;
  background_image?: string;
  isDigital: boolean;
}

// Interface für das Warenkorb-Dokument
export interface ICart extends Document {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

// Schema für ein Element im Warenkorb
const CartItemSchema = new Schema({
  offerId: { type: String, required: true },
  gameId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  background_image: { type: String },
  isDigital: { type: Boolean, required: true },
});

// Schema für den Warenkorb
const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

// Aktualisiere das Datum bei jeder Änderung
CartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

CartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

CartSchema.post('findOneAndUpdate', function (doc) {});

export default mongoose.model<ICart>('Cart', CartSchema);
