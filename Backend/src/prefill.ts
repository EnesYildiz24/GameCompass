// istanbul ignore file

import { logger } from './logger';

import { AdminResource, BuyerResource } from './Resources';
import { createAdmin, getAdminByEmail } from './service/AdminService';
import { createBuyer, getBuyerByEmail } from './service/BuyerService';

import { Admin } from './model/AdminModel';
import { Buyer } from './model/BuyerModel';
// Angenommen, du hast auch ein Category Model, das in createCategory verwendet wird.

export async function prefillDB(): Promise<{
  admin: AdminResource;
  buyer: BuyerResource;
}> {
  // 1) Indexe synchronisieren (optional)
  await Admin.syncIndexes();
  await Buyer.syncIndexes();
  // Falls dein Category Model Indexe benötigt, auch:
  // await Category.syncIndexes();

  // 2) Admin erstellen, wenn er nicht existiert
  let admin = await getAdminByEmail('admin@example.com');
  if (!admin) {
    admin = await createAdmin({
      username: 'ChiefAdmin',
      email: 'admin@example.com',
      password: 'Admin123',
      role: 'admin',
      permissions: ['ALL'],
    });
    logger.info(`Erstellter Admin: ${admin.username}, PW=Admin123`);
  } else {
    logger.info(`Admin mit Email ${admin.email} existiert bereits. Überspringe...`);
  }

  // 4) Buyer erstellen, wenn nicht vorhanden
  let buyer = await getBuyerByEmail('buyer@example.com');
  if (!buyer) {
    buyer = await createBuyer({
      username: 'FirstBuyer',
      email: 'buyer@example.com',
      password: 'BuyerPass',
      role: 'buyer',
    });
    logger.info(`Erstellter Buyer: ${buyer.username}, PW=BuyerPass`);
  } else {
    logger.info(`Buyer mit Email ${buyer.email} existiert bereits. Überspringe...`);
  }
  return {
    admin,
    buyer,
  };
}
