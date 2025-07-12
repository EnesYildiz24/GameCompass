import CartModel, { CartItem, ICart } from '../model/CartModel';
import SpielModel, { ISpiel } from '../model/SpielModel';
import mongoose from 'mongoose';
import OfferModel, { IOffer, Offer } from '../model/OfferModel';

export interface CartItemInput {
  offerId:  string;
  quantity: number;   // 1-n
}
export class CartService {
  /**
   * Holt den Warenkorb eines Benutzers
   * @param userId ID des Benutzers
   * @returns Warenkorb des Benutzers oder null, wenn keiner existiert
   */
  async getCart(userId: string): Promise<ICart | null> {
    try {
      // Versuche, die ID in ein ObjectId zu konvertieren, falls sie es noch nicht ist
      let userObjectId;
      try {
        userObjectId = new mongoose.Types.ObjectId(userId);
      } catch (error) {
        console.error('Fehler beim Konvertieren der User ID in ObjectId:', error);
        // Verwende die ursprüngliche ID, wenn die Konvertierung fehlschlägt
        userObjectId = userId;
      }

      const cart = await CartModel.findOne({ userId: userObjectId });
      return cart;
    } catch (error) {
      console.error('Fehler beim Abrufen des Warenkorbs:', error);
      throw new Error('Fehler beim Abrufen des Warenkorbs');
    }
  }

  /**
   * Erstellt einen neuen Warenkorb für einen Benutzer
   * @param userId ID des Benutzers
   * @returns Neu erstellter Warenkorb
   */
  async createCart(userId: string): Promise<ICart> {
    try {
      const cart = new CartModel({
        userId,
        items: [],
      });
      return await cart.save();
    } catch (error) {
      console.error('Fehler beim Erstellen des Warenkorbs:', error);
      throw new Error('Fehler beim Erstellen des Warenkorbs');
    }
  }

  /**
   * Holt oder erstellt den Warenkorb eines Benutzers
   * @param userId ID des Benutzers
   * @returns Warenkorb des Benutzers
   */
  async getOrCreateCart(userId: string): Promise<ICart> {
    try {
      let cart = await this.getCart(userId);

      if (!cart) {
        cart = await this.createCart(userId);
      }

      return cart;
    } catch (error) {
      console.error('Fehler beim Abrufen oder Erstellen des Warenkorbs:', error);
      throw new Error('Fehler beim Abrufen oder Erstellen des Warenkorbs');
    }
  }

  /**
   * Aktualisiert den Warenkorb eines Benutzers
   * @param userId ID des Benutzers
   * @param items Neue Warenkorb-Elemente
   * @returns Aktualisierter Warenkorb
   */
  async updateCart(userId: string, inputs: CartItemInput[]) {
    // 1) zu jeder offerId das Offer holen
    const ids    = inputs.map(i => i.offerId);
    const offers = await Offer.find({ _id: { $in: ids } })
    .populate<{ game: ISpiel & mongoose.Document }>('game')
    .exec();   
      
    const items = inputs.map(inItem => {
      const off = offers.find(o => o.id === inItem.offerId);
      if (!off) throw new Error('Offer nicht gefunden: ' + inItem.offerId);
  
      return {
        offerId: off.id,
        gameId:  off.game.id,
        name:    off.game.name,
        price:   off.price,
        quantity:inItem.quantity,
        background_image: off.game.background_image,
        isDigital: off.isDigital           // **einzige Quelle!**
      };
    });
  
    return await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items, updatedAt: new Date() } },
      { upsert:true, new:true }
    );
  }
  

  /**
   * Fügt ein Spiel zum Warenkorb hinzu
   * @param userId ID des Benutzers
   * @param gameId ID des Spiels
   * @param quantity Anzahl der Exemplare
   * @returns Aktualisierter Warenkorb
   */

  async addToCart(userId: string, offerId: string, quantity = 1): Promise<ICart> {
    try {
      /* ---------- 1. Offer + Spiel laden ---------- */
      const offer = await OfferModel
      .findById(offerId)
      .populate<{ game: ISpiel }>('game')           // <<< Generic
      .exec();

      if (!offer) throw new Error('Offer nicht gefunden');
      const game = offer.game as any; // ggf. eigenes Interface für Spiel

      /* ---------- 2. Warenkorb holen ---------- */
      const cart = await this.getOrCreateCart(userId);

      /* ---------- 3. Existiert das Offer schon? ---------- */
      const idx = cart.items.findIndex((i) => i.offerId === offerId);

      if (idx >= 0) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({
          offerId: offer._id.toString(),
          gameId: game._id.toString(),
          name: game.name,
          price: offer.price,
          quantity,
          background_image: game.background_image,
          isDigital: offer.isDigital,
        } as CartItem);
      }

      return await cart.save();
    } catch (err) {
      console.error('Fehler beim Hinzufügen zum Warenkorb:', err);
      throw new Error('Fehler beim Hinzufügen zum Warenkorb');
    }
  }

  /**
   * Entfernt ein Spiel aus dem Warenkorb
   * @param userId ID des Benutzers
   * @param gameId ID des Spiels
   * @returns Aktualisierter Warenkorb
   */
  async removeFromCart(userId: string, offerId: string): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((i) => i.offerId !== offerId);
    return await cart.save();
  }

  async updateQuantity(userId: string, offerId: string, quantity: number): Promise<ICart> {
    if (quantity < 1) throw new Error('Ungültige Menge');

    const cart = await this.getOrCreateCart(userId);
    const idx = cart.items.findIndex((i) => i.offerId === offerId);
    if (idx === -1) throw new Error('Element nicht im Warenkorb gefunden');

    cart.items[idx].quantity = quantity;
    return await cart.save();
  }
  /**
   * Leert den Warenkorb eines Benutzers
   * @param userId ID des Benutzers
   * @returns Aktualisierter Warenkorb
   */
  async clearCart(userId: string): Promise<ICart> {
    try {
      const cart = await this.getOrCreateCart(userId);

      // Leere den Warenkorb
      cart.items = [];

      // Speichere den aktualisierten Warenkorb
      return await cart.save();
    } catch (error) {
      console.error('Fehler beim Leeren des Warenkorbs:', error);
      throw new Error('Fehler beim Leeren des Warenkorbs');
    }
  }
}

export default new CartService();
