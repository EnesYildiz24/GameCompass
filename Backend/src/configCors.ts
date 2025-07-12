// istanbul ignore file
import express from 'express';
import cors, { CorsOptions } from 'cors';
import { logger } from './logger';

/**
 * In app.ts aufrufen:
 * ```
 * configureCORS(app);
 * ```
 * (am besten gleich nach dem Erzeugen der app).
 * Das Paket 'cors' ist bereits installiert.
 */
export function configureCORS(app: express.Express) {
  if (!process.env.CORS_ORIGIN) {
    logger.warn('WARNING: CORS_ORIGIN not set, allowing no origins');
  } else {
    var corsOptions: CorsOptions = {
      origin: process.env.CORS_ORIGIN,
      methods: 'GET,PUT,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true,
    };
    app.use(cors(corsOptions));
  }
}
