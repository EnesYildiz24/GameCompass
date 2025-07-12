// src/service/BestellungService.ts

import { Types } from 'mongoose';
import { Bestellung } from '../model/BestellungModel';
import OfferModel from '../model/OfferModel';
import { ISpiel } from '../model/SpielModel';
import { BestellungResource } from '../Resources';

/* ---------- getAlleBestellungen ---------------------------------- */
export async function getAlleBestellungen(userId: string): Promise<BestellungResource[]> {
  /* … Prüfungen bleiben … */

  const docs = await Bestellung.find({ userId }).exec();
  return docs.map(order => ({
    id: order._id.toString(),
    userId: order.userId.toString(),
    product: order.product.map(p => ({
      offerId:  p.offerId.toString(),
      spielId:  p.spielId.toString(),
      name:     p.name,
      price:    p.price,
      amount:   p.amount,
      isDigital:p.isDigital,
    })),
    price:  order.price,
    status: order.status,
    orderAt: order.orderAt,
    stripeSessionId:       order.stripeSessionId       || '',
    stripePaymentIntentId: order.stripePaymentIntentId || '',

    /* ➜ NEU */
    shippingAddress: order.shippingAddress
      ? {
          street:  order.shippingAddress.street,
          zip:     order.shippingAddress.zip,
          city:    order.shippingAddress.city,
          country: order.shippingAddress.country,
        }
      : undefined,
    shippingProvider: order.shippingProvider,
    shippingCost:     order.shippingCost,
  }));
}

/* ---------- getBestellung ---------------------------------------- */
export async function getBestellung(orderId: string): Promise<BestellungResource> {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error('Ungültige Bestell-ID');
  }

  /* ➜ ZURÜCKEINFÜGEN  */
  const order = await Bestellung.findById(orderId)
    .populate('product.spielId')
    .populate('product.offerId')
    .exec();

  if (!order) {
    throw new Error('Bestellung nicht gefunden');
  }

  return {
    id: order._id.toString(),
    userId: order.userId.toString(),
    /* p sauber typisieren, damit kein implizites any entsteht */
    product: order.product.map((p): BestellungResource['product'][number] => ({
      offerId:  p.offerId!.toString(),
      spielId:  p.spielId!.toString(),
      name:     p.name,
      price:    p.price,
      amount:   p.amount,
      isDigital:p.isDigital,
    })),
    price:  order.price,
    status: order.status,
    orderAt: order.orderAt,
    stripeSessionId:       order.stripeSessionId       || '',
    stripePaymentIntentId: order.stripePaymentIntentId || '',

    shippingAddress: order.shippingAddress
      ? {
          street:  order.shippingAddress.street,
          zip:     order.shippingAddress.zip,
          city:    order.shippingAddress.city,
          country: order.shippingAddress.country,
        }
      : undefined,
    shippingProvider: order.shippingProvider,
    shippingCost:     order.shippingCost,
  };
}
/* ---------- updateBestellung ------------------------------------- */
export async function updateBestellung(
  bestellungResource: BestellungResource
): Promise<BestellungResource> {

  if (!bestellungResource.id || !Types.ObjectId.isValid(bestellungResource.id)) {
    throw new Error('Ungültige Bestellungs-ID');
  }

  /* 1. Bestellung laden */
  const order = await Bestellung.findById(bestellungResource.id).exec();
  if (!order) throw new Error('Bestellung nicht gefunden');

  /* 2. Felder setzen */
  order.status  = bestellungResource.status;
  order.price   = bestellungResource.price;
  order.product = bestellungResource.product.map(p => ({
    offerId:   new Types.ObjectId(p.offerId),
    spielId:   new Types.ObjectId(p.spielId),
    name:      p.name,
    price:     p.price,
    amount:    p.amount,
    isDigital: p.isDigital,
  }));

  /* 3. Speichern */
  const updated = await order.save();

  /* 4. Rückgabe-Objekt bauen */
  return {
    id:      updated._id.toString(),
    userId:  updated.userId.toString(),
    product: updated.product.map((p): BestellungResource['product'][number] => ({
      offerId:  p.offerId.toString(),
      spielId:  p.spielId.toString(),
      name:     p.name,
      price:    p.price,
      amount:   p.amount,
      isDigital:p.isDigital,
    })),
    price:  updated.price,
    status: updated.status,
    orderAt: updated.orderAt,
    stripeSessionId:       updated.stripeSessionId       || '',
    stripePaymentIntentId: updated.stripePaymentIntentId || '',

    /* Versanddaten */
    shippingAddress: updated.shippingAddress
      ? {
          street:  updated.shippingAddress.street,
          zip:     updated.shippingAddress.zip,
          city:    updated.shippingAddress.city,
          country: updated.shippingAddress.country,
        }
      : undefined,
    shippingProvider: updated.shippingProvider,
    shippingCost:     updated.shippingCost,
  };
}

/** 3. createBestellung bereits korrekter Resource-Return, nur input-Shape anpassen */
export async function createBestellung(input: {
  userId: string;
  product: { offerId: string; amount: number }[];
  shipping: {
    street:  string; zip: string; city: string; country: string;
    provider: string; cost: number;
  } | null;
  billing:  any | null;           // falls du’s brauchst
}): Promise<BestellungResource> {


  // explizite Typannotation:
  const productDetails: {
    offerId:   Types.ObjectId;
    spielId:   Types.ObjectId;
    name:      string;
    price:     number;
    amount:    number;
    isDigital: boolean;
    licenseKeys: string[];            
  }[] = await Promise.all(
    input.product.map(async ({ offerId, amount }) => {
      const offer = await OfferModel
        .findById(offerId)
        .populate<{ game: ISpiel }>('game')
        .exec();

      if (!offer) {
        throw new Error(`Offer ${offerId} nicht gefunden`);
      }
      // ✏️ 2. Null-Prüfung auf offer.game
      if (!offer.game) {
        throw new Error(`Spiel-Daten für Offer ${offerId} fehlen`);
      }

      const game = offer.game as ISpiel; 
      return {
        offerId:   offer._id,
        spielId:   game._id!,        // jetzt nie undefined
        name:      game.name,
        price:     offer.price,
        amount,
        isDigital: offer.isDigital,
        licenseKeys: offer.key ? [offer.key] : [],
      };
    })
  );

  const itemsTotal = productDetails
    .reduce((sum, p) => sum + p.price * p.amount, 0);

  const shippingCost = input.shipping?.cost ?? 0;
  const total        = itemsTotal + shippingCost;

  const newOrder = await Bestellung.create({
    userId:  input.userId,
    product: productDetails,
    price:   total,
    status:  'offen',
    orderAt: new Date(),

    /* ⬇︎ Hier speichern wir die Adresse */
    shippingAddress: input.shipping
      ? {
          street:  input.shipping.street,
          zip:     input.shipping.zip,
          city:    input.shipping.city,
          country: input.shipping.country,
        }
      : undefined,
    shippingProvider: input.shipping?.provider,
    shippingCost,
  });

  return {
    id: newOrder._id.toString(),
    userId: newOrder.userId.toString(),
    product: productDetails.map(d => ({
      offerId:  d.offerId.toString(),
      spielId:  d.spielId.toString(),
      name:     d.name,
      price:    d.price,
      amount:   d.amount,
      isDigital:d.isDigital,
    })),
    price: newOrder.price,
    status: newOrder.status,
    orderAt: newOrder.orderAt,
    stripeSessionId: '',
    stripePaymentIntentId: '',
    /* NEU → zurückgeben, damit Frontend sie ggf. anzeigen kann */
    shippingAddress: newOrder.shippingAddress
    ? {
        street:  newOrder.shippingAddress.street,
        zip:     newOrder.shippingAddress.zip,
        city:    newOrder.shippingAddress.city,
        country: newOrder.shippingAddress.country,
      }
    : undefined,
  
    shippingProvider: newOrder.shippingProvider,
    shippingCost: newOrder.shippingCost,
  };
}
export async function deleteBestellung(id: string): Promise<void> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Ungültige Bestell-ID');
  }
  const res = await Bestellung.deleteOne({ _id: id }).exec();
  if (res.deletedCount !== 1) {
    throw new Error(`Bestellung ${id} wurde nicht gelöscht`);
  }
}


