// offer.service.ts

import { Offer, IOffer } from '../model/OfferModel';
import { Types } from 'mongoose';

export interface CreateOfferInput {
  game:        Types.ObjectId;
  seller:      Types.ObjectId;
  price:       number;
  condition:   'new' | 'used';
  availability:boolean;
  isDigital:   boolean;           // ← NEU
  key?:        string;            // ← NEU
  sellerInfo:  {
    displayName:string;
    email?:     string;
  };
}
// Angebot anlegen
export async function createOffer(data: CreateOfferInput): Promise<IOffer> {
  // Sicherheitshalber normalisieren (Strings → Boolean)
  const normalized: CreateOfferInput = {
    ...data,
    isDigital: Boolean(data.isDigital)
  };

  const offer = await Offer.create(normalized);
  return (await offer.populate('game')).populate('seller');
}

// Alle Angebote (optional: nach Spiel gefiltert)
export async function getAllOffers(gameId?: string): Promise<IOffer[]> {
  const filter = gameId ? { game: gameId } : {};
  return Offer.find(filter).populate('game').populate('seller').exec();
}

// Einzelnes Angebot abrufen
export async function getOfferById(id: string): Promise<IOffer | null> {
  return Offer.findById(id).populate('game').populate('seller').exec();
}

// Angebot löschen
export async function deleteOffer(id: string): Promise<IOffer | null> {
  return Offer.findByIdAndDelete(id).exec();
}

// Angebot aktualisieren (optional)
export async function updateOffer(id: string, update: Partial<IOffer>): Promise<IOffer | null> {
  return Offer.findByIdAndUpdate(id, update, { new: true }).exec();
}
