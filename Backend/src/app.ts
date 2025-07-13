import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { configureCORS } from './configCors';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user';
import { loginRouter } from './routes/login';
import googleRoute from './auth/google';
import facebookRoute from './auth/facebook';
import { chatRouter } from './routes/chat';
import { genreRouter } from './routes/genre';
import bewertungRouter from './routes/bewertung';
import bestellungRouter from './routes/bestellung';
import {spielRouter } from './routes/spiel';
import {cartsRouter } from './routes/cart';
import checkoutRoutes from './routes/checkout';
import webhookRoutes from './routes/stripe-webhook'; // Import webhookRoutes
import {offerRouter} from './routes/offer'; // Import offersRouter
import { connectRoutes } from './routes/connect';
import userGamesRouter from './routes/userGames';
import { chatPopupRouter } from './routes/chatpopup';
import uploadRouter from './routes/upload';

const app = express();
configureCORS(app);
app.use(cookieParser());

app.use(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),  
    webhookRoutes
  );
  
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', loginRouter);
app.use('/auth', googleRoute);
app.use('/auth/facebook', facebookRoute);
app.use('/api/chat', chatRouter);
app.use('/api/genre', genreRouter);
app.use('/api/bewertung', bewertungRouter);
app.use('/api/bestellung', bestellungRouter);
app.use("/api/games", spielRouter); 
app.use("/api/cart", cartsRouter); 
app.use('/api/checkout', checkoutRoutes);
app.use('/api/offers', offerRouter);
app.use('/api/connect', connectRoutes);
app.use('/api/user/games', userGamesRouter);
app.use('/api/chatpopup', chatPopupRouter);
app.use('/api/upload',uploadRouter);



export default app;
