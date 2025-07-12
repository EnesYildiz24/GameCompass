import { Schema, model, Types } from 'mongoose';

export interface ISpiel {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  released?: Date;
  developer?: string;
  availability?: boolean;
  background_image: string;
  rating: number;
  genres: { id: number; name: string }[];
  platforms: { platform: { name: string } }[];
  screenshots_count: number;
  screenshots: string[];
}

const SpielSchema = new Schema<ISpiel>(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      required: true,
      maxlength: 20000,
    },
    price: { type: Number, required: true },
    developer: { type: String },
    availability: { type: Boolean, default: false },
    background_image: { type: String, required: true },
    platforms: [{ platform: { name: String } }],
    rating: { type: Number, required: true },
    genres: [{ id: Number, name: String }],
    screenshots_count: { type: Number },
    screenshots: [{ type: String }]
  },
  { timestamps: true }
);

export const Spiel = model<ISpiel>('Spiel', SpielSchema);
export default model<ISpiel>('Spiel', SpielSchema);