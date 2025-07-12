import { Router, Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../model/UserModel';
import { logger } from '../logger';
import { requireAuth } from './middleware';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
interface IUserDoc extends IUser, Document {
  _id: any;
}
// JWT helper
interface JWTPayload { sub: string; }
function signToken(user: { _id: any, role: string, username: string }): string {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}


// POST /auth/google
router.post(
  '/google',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { credential } = req.body;
      if (!credential) {
        res.status(400).json({ error: 'No credential token provided' });
        return;
      }

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email_verified) {
        res.status(400).json({ error: 'Google account not verified' });
        return;
      }

      // Upsert user
      const filter = { email: payload.email };
      const update: Partial<IUser> = {
        provider: 'google',
        providerId: payload.sub,
        email: payload.email!,
        username: payload.name,
        verified: true,
      };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const userDoc = await User.findOneAndUpdate(filter, update, options).exec();
      if (!userDoc) {
        logger.error('Google Login: unable to upsert user', { filter, update });
        res.status(500).json({ error: 'User lookup/create failed' });
        return;
      }

      const token = signToken({
        _id: userDoc._id,
        role: userDoc.role,
        username: userDoc.username!,
      });
      res.cookie('access_token', token, { // <-- statt 'token'
        httpOnly: true,
        secure: false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',           // ← sicherstellen
        expires: new Date(Date.now() + 3600 * 1000), // 1 Stunde
      });

      res.json({
        success: true, user: {
          id: userDoc._id.toString(),
          email: userDoc.email,
          username: userDoc.username,
          role: userDoc.role,
        }
      });
      return;
    } catch (err) {
      logger.error('Google Login Error', err);
      res.status(401).json({ error: 'Invalid Google token' });
      return;
    }
  }
);
router.get(
  '/me',
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const userDoc = await User.findById(userId).exec();
      if (!userDoc) {
        res.status(404).json({ error: 'User nicht gefunden' });
        return;
      }
      res.json({
        user: {
          id: userDoc._id.toString(),
          email: userDoc.email,
          username: userDoc.username,
          role: userDoc.role,
          verified: true,
          stripeAccountId: userDoc.stripeAccountId,
          chargesEnabled: userDoc.chargesEnabled,
          payoutsEnabled: userDoc.payoutsEnabled,
        }
      });
    } catch (err) {
      logger.error('Error in /auth/me', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
