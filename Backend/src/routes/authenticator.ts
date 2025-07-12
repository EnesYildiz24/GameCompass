import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import validator from 'validator';

const COOKIE_NAME = process.env.COOKIE_NAME! || 'access_token';
const SECRET = process.env.JWT_SECRET!;

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      username: string;
    }
    export interface Request {
      /**
       * Mongo-ID of currently logged in user; or undefined, if user is a guest.
       */
      userId?: string;
      role?: 'admin' | 'buyer' | 'guest';
      user?: AuthUser;
    }
  }
}

/**
 * Prüft Authentifizierung und schreibt `userId` und `role' des Users in den Request.
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) gesendet.
 */
export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
  const jwtString = req.cookies?.[COOKIE_NAME];
  console.log('Cookies:', req.cookies);

  if (!jwtString) {
    res.sendStatus(401);
    return; // Unauthorized
  }

  try {
    const payload = verify(jwtString, SECRET);
    if (
      typeof payload === 'object' &&
      payload.exp &&
      payload.sub &&
      validator.isMongoId(payload.sub)
    ) {
      req.userId = payload.sub;
      req.role = payload.role as 'admin' | 'buyer';
      if (!['admin', 'buyer'].includes(payload.role)) {
        res.status(403).send('Forbidden Role');
        return;
      }
      (req as any).user = { id: payload.sub, username: (payload as any).username };
      req.user = { id: payload.sub, username: (payload as any).username };

      next();
      return;
    }
  } catch (err) {
    console.log('DEBUG verify error:', err);
    console.log('DEBUG: process.env.JWT_SECRET =', process.env.JWT_SECRET);
  }
  res.sendStatus(401);
}

/**
 * Prüft Authentifizierung und schreibt `userId` und `role' des users in den Request.
 * Falls ein JWT vorhanden ist, wird bei fehlgeschlagener Prüfung ein Fehler gesendet.
 * Ansonsten wird kein Fehler erzeugt.
 */
export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
  const jwtString = req.cookies[COOKIE_NAME!];
  if (!jwtString) {
    next();
    return;
  }
  try {
    const payload = verify(jwtString, SECRET);
    if (
      typeof payload === 'object' &&
      payload.exp &&
      payload.sub &&
      validator.isMongoId(payload.sub)
    ) {
      req.userId = payload.sub;
      req.role = payload.role || 'guest';
      (req as any).user = { _id: payload.sub, username: (payload as any).username };
      req.user = { id: payload.sub, username: (payload as any).username };
      next();
      return;
    }
  } catch (err) {
    res.sendStatus(401);
    return;
  }
}
