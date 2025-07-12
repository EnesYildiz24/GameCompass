import { logger } from '../logger';
import { User } from '../model/UserModel';

/**
 * Prüft Email und Passwort, bei Erfolg ist `success` true
 * und es wird die `id` und `role` ("u" oder "a") des Profs zurückgegeben
 *
 * Falls kein User mit gegebene Email existiert oder das Passwort falsch ist, wird nur
 * `success` mit falsch zurückgegeben. Aus Sicherheitsgründen wird kein weiterer Hinweis gegeben.
 */
export async function login(
  email: string,
  password: string
): Promise<{ id: string; role: 'admin' | 'buyer'; username: string } | false> {
  if (!email || !password) {
    console.log('⚠️ Kein Email oder Passwort angegeben');
    logger.warn('Kein Email oder Passwort angegeben');
    return false;
  }
  console.log('📩 Suche Nutzer mit Email:', email);
  console.log('📂 Verwende Collection:', User.collection.name);
  const user = await User.findOne({ email }).exec();
  console.log('🔍 Nutzer gefunden:', user);

  if (!user) {
    console.log('❌ Kein Nutzer mit dieser Email gefunden!');

    return false;
  }

  const iscorrectPassword = await user.isCorrectPassword(password);
  console.log('🛠️ Passwort-Vergleich:', iscorrectPassword);

  if (!iscorrectPassword) {
    console.log('❌ Passwort ist falsch!');

    return false;
  }
  const role: 'admin' | 'buyer' = user.role;
  console.log('✅ Login erfolgreich für:', email, 'mit Rolle:', role);

  return { id: user._id.toString(), role, username: user.username! };
}
