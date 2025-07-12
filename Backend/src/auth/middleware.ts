// src/auth/middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/UserModel';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // 1) Token aus Cookie lesen

  const token = req.cookies['access_token'];

  if (!token) {
    res.status(401).json({ error: 'Nicht authentifiziert' });
    return;
  }

  try {
    // 2) JWT verifizieren
    const { sub: userId } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { sub: string };

    // 3) User aus DB holen (nur _id + username)
    const userDoc = await User.findById(userId)
      .select('_id username')
      .lean();
    if (!userDoc) {
      res.status(401).json({ error: 'User nicht gefunden' });
      return;
    }

    // 4) Das Teilobjekt injizieren
    req.user = {
      id: userDoc._id.toString(),
      username: userDoc.username!,
    };

    // 5) Flow weitergeben
    next();
  } catch (err) {
    console.error('Auth-Middleware-Error', err);
    res.status(401).json({ error: 'Ungültiges Token' });
    return;
  }
}
