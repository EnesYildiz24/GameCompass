import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../model/UserModel';

const router = Router();

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
}

router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken } = req.body as { accessToken?: string };
    if (!accessToken) {
      res.status(400).json({ error: 'No accessToken provided' });
      return;
    }
    console.log('Received Facebook AccessToken:', accessToken);
    console.log('➡️ Zugriff auf Facebook-Login-Route');
    console.log('🔑 AccessToken:', accessToken);

    // 1) Facebook Graph API abrufen
    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );
    console.log('📶 Facebook Response OK?', fbRes.ok);

    if (!fbRes.ok) {
      const err = await fbRes.text();
      console.error('Facebook Graph API response error:', err);
      res.status(400).json({ error: `Facebook API Error: ${err}` });
      return;
    }
    const fbData = await fbRes.json();

    const providerId = fbData.id;
    const username = fbData.name;
    const email = fbData.email ?? `${providerId}@facebook.local`;
    if (!fbData.email) {
      console.warn('⚠️ Facebook hat keine echte E-Mail zurückgegeben – Fallback verwendet:', email);
    }
    console.log('📩 Facebook Graph Response:', fbData);

    // 2) User upserten
    const existingUser = await User.findOne({ email });

    const update: Partial<IUser> = {
      provider: 'facebook',
      providerId,
      email,
      verified: true,
    };
    
    if (!existingUser) {
        let baseUsername = fbData.name || `fbuser_${providerId.slice(-6)}`;
        let uniqueUsername = baseUsername;
        let counter = 1;
      
        while (await User.exists({ username: uniqueUsername })) {
          uniqueUsername = `${baseUsername}_${counter++}`;
        }
      
        update.username = uniqueUsername;
      }
    
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const userDoc = await User.findOneAndUpdate({ email }, update, opts).exec();
    if (!userDoc) throw new Error('User create/find failed');

    // 3) JWT-Cookie setzen
    const token = signToken(userDoc._id.toString());
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      expires: new Date(Date.now() + 3600 * 1000),
    });

    // 4) Antwort
    res.json({
      success: true,
      user: {
        id: userDoc._id.toString(),
        email: userDoc.email,
        username: userDoc.username,
        role: userDoc.role,
        verified: true,
      },
    });
  } catch (err: any) {
    console.error('Facebook Login Error', err);
    res.status(401).json({ error: err.message || 'Login failed' });
  }
});

export default router;
