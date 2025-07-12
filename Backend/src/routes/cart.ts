import { Router, Request, Response } from 'express';
import { optionalAuthentication, requiresAuthentication } from './authenticator';
import cartService from '../service/CartService';
import Offer from '../model/OfferModel';

interface UpdateCartBody {
  items: {
    offerId: string;
    gameId: string;
    name: string;
    price: number;
    quantity: number;
    background_image?: string;
    isDigital: boolean;
  }[];
}

const cartsRouter = Router();

/**
 * GET /api/cart
 */
cartsRouter.get('/', requiresAuthentication, async (req, res) => {
  try {
    const userId = req.user!.id.toString();
    const cart = await cartService.getOrCreateCart(userId);

    // alle Offer-Dokumente parallel holen
    const offerIds = cart.items.map(i => i.offerId);
    const offers = await Offer.find({ _id: { $in: offerIds } }).select('key').lean();

    // ein Map von offerId → key bauen
    const keyMap = new Map(offers.map(o => [o._id.toString(), o.key]));

    res.json(
      cart.items.map(item => ({
        offerId:         item.offerId,
        gameId:          item.gameId,
        name:            item.name,
        price:           item.price,
        quantity:        item.quantity,
        background_image:item.background_image,
        isDigital:       item.isDigital,
        // hier den Key nur bei digitalen Artikeln mitschicken
        ...(item.isDigital ? { key: keyMap.get(item.offerId) ?? null } : {})
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverfehler beim Laden des Warenkorbs' });
  }
});

/**
 * POST /api/cart
 */
cartsRouter.post(
  '/',
  requiresAuthentication,
  async (req: Request<{}, {}, UpdateCartBody>, res: Response) => {
    try {
      const userId = req.user!.id.toString();
      const updated = await cartService.updateCart(userId, req.body.items);
      res.json(
        updated.items.map((item) => ({
          offerId: item.offerId,
          gameId: item.gameId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          background_image: item.background_image,
          isDigital: item.isDigital, // <- ganz wichtig
        }))
      );
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Warenkorbs' });
      return;
    }
  }
);

/**
 * POST /api/cart/add
 */
cartsRouter.post('/add', requiresAuthentication, async (req: Request, res: Response) => {
  try {
    const { offerId, quantity = 1 } = req.body;
    const userId = req.user!.id.toString();

    const updated = await cartService.addToCart(userId, offerId, quantity);
    res.json(
      updated.items.map((item) => ({
        offerId: item.offerId,
        gameId: item.gameId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        background_image: item.background_image,
        isDigital: item.isDigital, // <- ganz wichtig
      }))
    );
    return;
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === 'Spiel nicht gefunden' ? 404 : 500;
    res.status(status).json({ message: msg });
    return;
  }
});

/**
 * DELETE /api/cart/remove/:gameId
 */
cartsRouter.delete(
  '/remove/:gameId',
  requiresAuthentication,
  async (req: Request, res: Response) => {
    try {
      const { offerId } = req.params; // <-- früher :gameId
      const userId = req.user!.id.toString();

      const updated = await cartService.removeFromCart(userId, offerId);
      res.json(
        updated.items.map((item) => ({
          offerId: item.offerId,
          gameId: item.gameId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          background_image: item.background_image,
          isDigital: item.isDigital, // <- ganz wichtig
        }))
      );
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Serverfehler beim Entfernen' });
      return;
    }
  }
);

/**
 * PUT /api/cart/update/:gameId
 */
cartsRouter.put('/update/:gameId', requiresAuthentication, async (req: Request, res: Response) => {
  try {
    const { offerId } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.id.toString();

    const updated = await cartService.updateQuantity(userId, offerId, quantity);
    res.json(
      updated.items.map((item) => ({
        offerId: item.offerId,
        gameId: item.gameId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        background_image: item.background_image,
        isDigital: item.isDigital, // <- ganz wichtig
      }))
    );
    return;
  } catch (error) {
    const msg = (error as Error).message;
    const status = msg === 'Element nicht im Warenkorb gefunden' ? 404 : 400;
    res.status(status).json({ message: msg });
    return;
  }
});

/**
 * DELETE /api/cart/clear
 */
cartsRouter.delete('/clear', requiresAuthentication, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id.toString();
    const cleared = await cartService.clearCart(userId);
    res.json(
      cleared.items.map((item) => ({
        offerId: item.offerId,
        gameId: item.gameId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        background_image: item.background_image,
        isDigital: item.isDigital, // <- ganz wichtig
      }))
    );
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfehler beim Leeren des Warenkorbs' });
    return;
  }
});

export { cartsRouter };
