import { Schema, model, Types } from "mongoose";


export interface IBewertung {
    userId: Types.ObjectId;
    spielId: Types.ObjectId;
    comment: string;
    stars?: number;
    writtenAt: Date;
    editedAt?: Date;
}

const BewertungSchema = new Schema<IBewertung>({
    comment: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    spielId: { type: Schema.Types.ObjectId, ref: "Spiel", required: true },
    writtenAt: { type: Date, default: Date.now },

}, { timestamps: true });


export const Bewertung = model<IBewertung>("Bewertung", BewertungSchema);