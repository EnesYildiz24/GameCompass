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
import http from 'http';           // zusätzlich

dotenv.config();

const key = fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_KEY_FILE!));
const cert = fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_CRT_FILE!));

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI!;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      authSource: 'admin',
      directConnection: true, // <– hier
      serverSelectionTimeoutMS: 30000,
    });
    console.log(`✅ MongoDB connected (${mongoose.connection.name})`);

    initGridFS();

    if (process.env.SSL_KEY_FILE && process.env.SSL_CRT_FILE) {
      const key  = fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_KEY_FILE));
      const cert = fs.readFileSync(path.resolve(process.cwd(), process.env.SSL_CRT_FILE));
      https.createServer({ key, cert }, app).listen(PORT, () =>
        console.log(`✅ HTTPS-Server läuft auf https://localhost:${PORT}`)
      );
    } else {
      http.createServer(app).listen(PORT, () =>
        console.log(`✅ HTTP-Server läuft auf http://localhost:${PORT}`)
      );
    }

  } catch (err) {
    console.error('❌ Fehler beim Verbinden mit MongoDB:', err);
    process.exit(1);
  }
}

start();
