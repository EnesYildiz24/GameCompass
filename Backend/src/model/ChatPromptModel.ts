import { Schema, model } from 'mongoose';

export interface IChatPrompt {
  type: string;
  question: string;
  nextPrompt?: string;
  options?: string[];
  responseType: 'simple' | 'genre' | 'final' | 'rules';
  rules: string[];
  examples: { user: string; assistant: string }[];
  keywords?: string[];
  patterns?: string[];
  mappings?: { pattern: string; gamingTerms: string }[];
}

const ChatPromptSchema = new Schema<IChatPrompt>({
  type: { type: String, required: true }, // z.B. 'genre', 'experience', 'preference'
  question: { type: String, required: true },
  nextPrompt: String,
  options: [String],
  responseType: { 
    type: String, 
    enum: ['simple', 'genre', 'final', 'rules'],
    default: 'simple' 
  },
  rules: [String],
  examples: [{
    user: String,
    assistant: String
  }],
  keywords: [String],
  patterns: [String],
  mappings: [{ pattern: String, gamingTerms: String }]
});

export const ChatPrompt = model<IChatPrompt>('ChatPrompt', ChatPromptSchema); 