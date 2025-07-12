import { Request, Response, Router } from 'express';

const router = Router();

router.post('/logout', (_req: Request, res: Response) => {
    res
      .clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ success: true });
  });

export default router;