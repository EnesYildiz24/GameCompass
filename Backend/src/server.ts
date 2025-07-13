// server.ts
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import { initGridFS } from './gridFs'; 

dotenv.config();

const key = fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_KEY_FILE!));
const cert = fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_CRT_FILE!));

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI!

async function start() {
  try {
    await mongoose.connect(URI);
    console.log(`✅ MongoDB connected (${mongoose.connection.name})`);

    initGridFS();

    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`✅ HTTPS-Server läuft auf https://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Fehler beim Verbinden mit MongoDB:', err);
    process.exit(1);
  }
}

start();
