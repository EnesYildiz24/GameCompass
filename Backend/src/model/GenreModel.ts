import { Schema, model } from "mongoose";

export interface IGenre {
    name: string;
    description?: string;
    createdAt: Date;
    popularity?: number;
    germanName: string;
    aliases: string[];
}

const GenreSchema = new Schema<IGenre>({
    name: { type: String, required: true },
    description: { type: String, },
    createdAt: { type: Date, required: true, default: Date.now },
    popularity: { type: Number, min: 0, max: 50 },
    germanName: { type: String, required: true },
    aliases: [{ type: String }]
}, { timestamps: true });

export const Genre = model<IGenre>("Genre", GenreSchema);