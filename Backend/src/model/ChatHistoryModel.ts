import { Schema, model, Types } from "mongoose";

export interface IChatMessage {
  role: string; // 'user' oder 'assistant'
  content: string; // Der Inhalt der Nachricht
  timestamp: Date; // Zeitstempel der Nachricht
}

export interface IChatHistory {
  userId: Types.ObjectId | string; // Speichert die Benutzer-ID, falls der Benutzer angemeldet ist
  sessionId: string; // Eindeutige ID für jede Chat-Session
  messages: IChatMessage[]; // Array aller Nachrichten in dieser Session
  createdAt: Date; // Erstellungsdatum der Session
  updatedAt: Date; // Letztes Aktualisierungsdatum
}

const ChatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatHistorySchema = new Schema<IChatHistory>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String, required: true },
  messages: [ChatMessageSchema],
}, { timestamps: true });

export const ChatHistory = model<IChatHistory>("ChatHistory", ChatHistorySchema); 