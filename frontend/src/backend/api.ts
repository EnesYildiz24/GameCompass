import {
  UserResource,
  AdminResource,
  BuyerResource,
  SpielResource,
  GenreResource,
  BewertungResource,
  BestellungResource,
} from '../Resources';
import { fetchWithErrorHandling } from './fetchWithErrorHandling';
import { logoutFromAnywhere } from '../context/AuthContext';
import { CartItem } from "../components/SpielDetail";
import axios from 'axios';

const RAWG_BASE_URL = import.meta.env.VITE_RAWG_BASE_URL;
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;



export const MAX_LENGTH_LINE_STRING = 100;
export const MAX_LENGTH_MULTILINE_STRING = 1000;
const HOST = import.meta.env.VITE_API_SERVER_URL;

export interface CheckoutItem {
  gameId: string;
  quantity: number;
  
}
interface RegistLoginPayload {
  username: string;
  email: string;
  password: string;
  role: 'buyer';
}

export interface BestellungPayload {
  userId: string;
  product: { offerId: string; amount: number }[];

  // optional – nur, wenn physische Artikel
  shipping?: {
    street: string;
    zip: string;
    city: string;
    country: string;
    provider: string;
    cost: number;
  };

  // optional – nur, wenn digitale Artikel
  billing?: {
    street: string;
    zip: string;
    city: string;
    country: string;
    provider: string; // z. B. "Rechnung"
    cost: number;     // i.d.R. 0
  };
}
export interface OrderItem {
  spielId: string;
  name: string;
  price: number;
  amount: number;
}

export interface OrderDetails {
  id: string;
  userId: string;
  product: OrderItem[];
  price: number;
  status: string;
  orderAt: Date;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}

export type ShippingInfo = {
  provider: string;
  cost:     number;
  street:   string;
  zip:      string;
  city:     string;
  country:  string;
};

export type CheckoutPayload = {
  orderId: string;
};

export interface CreateOfferArgs {
  game: string;
  price: number;
  condition: string;
  seller: string;
  availability: boolean;
  sellerInfo?: {
    displayName: string;
    email?: string;
  };
  isDigital: boolean;
  key?: string;
}

export async function getAlleUser(): Promise<UserResource[]> {
  const response = await fetchWithErrorHandling(`${HOST}/user`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getUser(userId: string): Promise<UserResource> {
  const response = await fetchWithErrorHandling(`${HOST}/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function createUser(user: RegistLoginPayload) {
  const response = await fetchWithErrorHandling(`${HOST}/user`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Fehler beim Erstellen des Nutzers:', errorText);
    throw new Error('Nutzer konnte nicht erstellt werden');
  }
  return response.json();
}

export async function updateUser(userResource: UserResource): Promise<UserResource> {
  const response = await fetchWithErrorHandling(`${HOST}/user/${userResource.id}`, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(userResource),
  });
  return response.json();
}
export async function deleteUser(userId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/user/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
export async function getAlleAdmins(): Promise<AdminResource[]> {
  const response = await fetchWithErrorHandling(`${HOST}/api/user/admin`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}
export async function getAdmin(adminId: string): Promise<AdminResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/user/admin/${adminId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}
export async function updateAdmin(adminResource: AdminResource): Promise<AdminResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/user/admin/${adminResource.id}`, {
    method: 'PUT',
    body: JSON.stringify(adminResource),
    credentials: 'include',
  });
  return response.json();
}
export async function deleteAdmin(adminId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/user/admin/${adminId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
export async function getAlleBuyer(): Promise<BuyerResource[]> {
  const response = await fetchWithErrorHandling(`${HOST}/api/user/buyer`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}
export async function getBuyer(buyerId: string): Promise<BuyerResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/user/buyer/${buyerId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}
export async function updateBuyer(buyerResource: BuyerResource): Promise<BuyerResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/user/buyer/${buyerResource.id}`, {
    method: 'PUT',
    body: JSON.stringify(buyerResource),
    credentials: 'include',
  });
  return response.json();
}
export async function deleteBuyer(buyerId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/user/buyer/${buyerId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
// statt GET /api/login
export async function getLogin(): Promise<UserResource> {
  const response = await fetchWithErrorHandling(`${HOST}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  const body = await response.json();
  return body.user as UserResource;
}

export async function login(email: string, password: string): Promise<UserResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  return response.json();
}
export async function logout(): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/logout`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function createSpiel(
  spielResource: Omit<SpielResource, "id">
): Promise<SpielResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/games`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spielResource),
  });
  return response.json();
}


export async function updateSpiel(spielResource: SpielResource): Promise<SpielResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/games/${spielResource.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spielResource),
  });
  return response.json();
}

export async function deleteSpiel(spielId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/games/${spielId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function getAlleGenres(): Promise<GenreResource[]> {
  const response = await fetchWithErrorHandling(`${HOST}/api/genre/alle`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getGenre(genreId: string): Promise<GenreResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/genre/${genreId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function createGenre(
  genreResource: Omit<GenreResource, 'id' | 'createdAt'>
): Promise<GenreResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/genre`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(genreResource),
  });
  return response.json();
}

export async function updateGenre(genreResource: GenreResource): Promise<GenreResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/genre/${genreResource.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(genreResource),
  });
  return response.json();
}

export async function deleteGenre(genreId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/genre/${genreId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function getAlleBewertungen(): Promise<BewertungResource[]> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bewertung/alle`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getBewertung(bewertungId: string): Promise<BewertungResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bewertung/${bewertungId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function createBewertung(
  bewertungResource: Omit<BewertungResource, 'id' | 'writtenAt' | 'editedAt'>
): Promise<BewertungResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bewertung`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bewertungResource),
  });
  return response.json();
}

export async function updateBewertung(
  bewertungResource: BewertungResource
): Promise<BewertungResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bewertung/${bewertungResource.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bewertungResource),
  });
  return response.json();
}

export async function deleteBewertung(bewertungId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/bewertung/${bewertungId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function getAlleBestellungen(): Promise<BestellungResource[]> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bestellung/alle`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getBestellung(bestellungId: string): Promise<BestellungResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bestellung/${bestellungId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function createBestellung(payload: BestellungPayload) {
  const response = await fetchWithErrorHandling(`${HOST}/api/bestellung`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function updateBestellung(
  bestellungResource: BestellungResource
): Promise<BestellungResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bestellung/${bestellungResource.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bestellungResource),
  });
  return response.json();
}

export async function deleteBestellung(bestellungId: string): Promise<void> {
  await fetchWithErrorHandling(`${HOST}/api/bestellung/${bestellungId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { ...options, credentials: 'include' });

  if (res.status === 401) {
    logoutFromAnywhere();
    throw new Error('unauthorized');
  }
  return res;
}

export async function apiLoginFacebook(accessToken: string) {
  const res = await fetch('/auth/facebook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  });

  if (!res.ok) {
    throw new Error('Facebook Login fehlgeschlagen');
  }

  return await res.json();
}

export async function apiLoginGoogle(credential: string): Promise<UserResource> {
  const response = await fetch('https://gamecompass-8eh4o.ondigitalocean.app/gamecompass-backend/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) throw new Error('Google Login fehlgeschlagen');
  const result = await response.json();
  const user = result.user;

  if (!user || !user.id) throw new Error('Ungültige Benutzerdaten');
  return user;
}

// // Spiele Seite
// export async function getAlleRawgSpiele(): Promise<SpielResource[]> {
//   try {
//     const response = await fetch(
//       `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page_size=100&ordering=-rating&metacritic=80,100&page=1`
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Fehler beim Abrufen der Spiele:', errorText);
//       throw new Error(errorText || 'RAWG-Spiele konnten nicht geladen werden');
//     }

//     const data = await response.json();
//     console.log('Anzahl der erhaltenen Spiele:', data.results.length);

//     const spiele: SpielResource[] = await Promise.all(
//       data.results.map(async (game: any) => {
//         // Hole detaillierte Spielinformationen
//         const detailResponse = await fetch(`${RAWG_BASE_URL}/games/${game.id}?key=${RAWG_API_KEY}`);
//         const gameDetails = await detailResponse.json();

//         return {
//           id: game.id.toString(),
//           name: game.name,
//           description:
//             gameDetails.description_raw ||
//             gameDetails.description ||
//             `Ein spannendes ${game.genres[0]?.name || 'Spiel'} mit herausragender Grafik und Gameplay.`,
//           price: Math.floor(Math.random() * 60) + 10,
//           released: new Date(game.released),
//           availability: true,
//           background_image: game.background_image,
//           rating: game.rating,
//           genres: game.genres.map((genre: any) => ({
//             id: genre.id,
//             name: genre.name,
//           })),
//           platforms: game.platforms.map((p: any) => ({
//             platform: { name: p.platform.name },
//           })),
//         };
//       })
//     );

//     return spiele;
//   } catch (err) {
//     console.error('Fehler bei der API-Anfrage:', err);
//     throw new Error('Fehler bei der Kommunikation mit dem Server.');
//   }
// }

// // Einzelnes Spiel
// export async function getRawgSpiel(id: string): Promise<SpielResource> {
//   try {
//     const response = await fetch(`${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Fehler beim Abrufen des Spiels:', errorText);
//       throw new Error(errorText || 'Spiel konnte nicht geladen werden');
//     }

//     const game = await response.json();

//     const spiel: SpielResource = {
//       id: game.id.toString(),
//       name: game.name,
//       description:
//         game.description_raw ||
//         game.description ||
//         `Ein spannendes ${game.genres[0]?.name || 'Spiel'} mit herausragender Grafik und Gameplay.`,
//       price: Math.floor(Math.random() * 60) + 10,
//       released: new Date(game.released),
//       availability: true,
//       background_image: game.background_image,
//       rating: game.rating,
//       genres: game.genres.map((genre: any) => ({
//         id: genre.id,
//         name: genre.name,
//       })),
//       platforms: game.platforms.map((p: any) => ({
//         platform: { name: p.platform.name },
//       })),
//     };

//     return spiel;
//   } catch (err) {
//     console.error('Fehler bei der API-Anfrage:', err);
//     throw new Error('Fehler bei der Kommunikation mit dem Server.');
//   }
// }

// Alle Spiele von Datenbank
export async function getAlleRAWGSpiele(): Promise<SpielResource[]> {
  const response = await fetch(`${HOST}/api/games`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Fehler beim Abrufen der Spiele:', errorText);
    throw new Error(errorText || 'Spiele konnten nicht geladen werden');
  }

  const data = await response.json();
  return data;
}

// Verbesserte Funktion zum Abrufen der Spieldetails
export async function fetchGameDetails(gameId: string): Promise<any> {
  try {
    // Versuche zuerst, die Details vom Backend zu holen
    const response = await fetch(`${HOST}/api/games/${gameId}`);

    if (!response.ok) {
      // Wenn das fehlschlägt, versuche es mit einer alternativen Quelle
      console.warn(
        `Konnte keine Details für Spiel ${gameId} vom Hauptendpunkt laden, versuche Fallback...`
      );
      const fallbackResponse = await fetch(`${HOST}/api/spiel/${gameId}`);

      if (!fallbackResponse.ok) {
        throw new Error(`HTTP error! Status: ${fallbackResponse.status}`);
      }

      return await fallbackResponse.json();
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler beim Abrufen der Spieldetails:', error);
    throw error;
  }
}
// Warenkorb abrufen
export async function fetchCart(): Promise<any[]> {
  const response = await fetch(`${HOST}/api/cart`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Abrufen des Warenkorbs');
  }

  return await response.json();
}

// Warenkorb aktualisieren
export async function updateCart(items: any[]): Promise<any[]> {
  const response = await fetch(`${HOST}/api/cart`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Fehler beim Aktualisieren des Warenkorbs');
  }

  return await response.json();
}

// Element zum Warenkorb hinzufügen
export async function addToCart(gameId: string, quantity: number = 1): Promise<any> {
  const response = await fetch(`${HOST}/api/cart/add`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameId, quantity }),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Hinzufügen zum Warenkorb');
  }

  return await response.json();
}

// Element aus dem Warenkorb entfernen
export async function removeFromCart(gameId: string): Promise<any> {
  const response = await fetch(`${HOST}/api/cart/remove/${gameId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Entfernen aus dem Warenkorb');
  }

  return await response.json();
}

// Menge eines Elements im Warenkorb aktualisieren
export async function updateCartItemQuantity(gameId: string, quantity: number): Promise<any> {
  const response = await fetch(`${HOST}/api/cart/update/${gameId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Aktualisieren der Menge');
  }

  return await response.json();
}

// Warenkorb leeren
export async function clearCart(): Promise<any> {
  const response = await fetch(`${HOST}/api/cart/clear`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Leeren des Warenkorbs');
  }

  return await response.json();
}

// in api.ts
// src/backend/api.ts
export async function deleteCart(itemId: string): Promise<CartItem[]> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/remove/${itemId}`, {
    method: 'DELETE',
    credentials: 'include', // falls du Cookies nutzt
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Löschen gescheitert: ${res.status}`);
  return res.json(); // liefert das neue items-Array
}

export async function getOrderBySession(sessionId: string): Promise<BestellungResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/bestellung/by-session/${sessionId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return await response.json();
}

export async function startCheckout(payload: CheckoutPayload) {
  const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:   JSON.stringify(payload),
    credentials: 'include',
  });

  if (!res.ok) {
    // ► Server-Text (oder JSON) ausgeben, statt stumm „fehlgeschlagen“:
    const text = await res.text();      // erst lesen …
    console.error('Checkout-Fehler:', text);  // … dann loggen
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();        // { url: "https://checkout.stripe.com/…" }
}



export async function getUserOrders(): Promise<BestellungResource[]> {
  const res = await fetchWithErrorHandling(`${HOST}/api/bestellung/alle`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
}

export async function getSpiel(spielId: string): Promise<SpielResource> {
  const response = await fetchWithErrorHandling(`${HOST}/api/spiel/${spielId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}

export async function getAllOffers(gameId?: string) {
  const res = await fetch(`${HOST}/api/offers` + (gameId ? `?gameId=${gameId}` : ''));
  if (!res.ok) throw new Error('Offers konnten nicht geladen werden');
  return res.json();
}

export async function createOffer(args: CreateOfferArgs) {
  const res = await fetch(`${HOST}/api/offers`, {
    method: "POST",
    credentials: "include", // wichtig: Session‐Cookie mitsenden
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    console.error("createOffer HTTP-Error:", res.status, bodyText);
    throw new Error(bodyText || "Angebot konnte nicht erstellt werden");
  }
  return res.json();
}

export async function updateOffer(
  offerId: string,
  { price, condition }: { price: number; condition: string }
) {
  const res = await fetch(`${HOST}/api/offers/${offerId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price, condition }),
  });
  if (!res.ok) throw new Error('Angebot konnte nicht aktualisiert werden');
  return res.json();
}

export async function deleteOffer(offerId: string) {
  const res = await fetch(`${HOST}/api/offers/${offerId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Angebot konnte nicht gelöscht werden');
  return res.json();
}

export async function getOfferById(offerId: string) {
  const res = await fetch(`${HOST}/api/offers/${offerId}`);
  if (!res.ok) throw new Error('Angebot konnte nicht geladen werden');
  return res.json();
}

export async function fetchScreenshotCountById(rawgId: string): Promise<string[]> {
  try {
    if (!rawgId) {
      console.warn('Keine RAWG-ID übergeben');
      return [];
    }

    // Screenshots von RAWG abrufen
    const screenshotRes = await fetch(
      `${RAWG_BASE_URL}/games/${rawgId}/screenshots?key=${RAWG_API_KEY}&page_size=4`
    );
    
    if (!screenshotRes.ok) {
      console.warn('Screenshots nicht gefunden');
      return [];
    }
    
    const screenshotsData = await screenshotRes.json();
    return screenshotsData.results.map((screenshot: any) => screenshot.image);
  } catch (err) {
    console.error('Fehler beim Laden der Screenshots:', err);
    return [];
  }
}


export async function getAllSpiele(): Promise<SpielResource[]> {
  const response = await fetch('/api/spiel/all');
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Spiele');
  }
  return response.json();
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${HOST}/api/upload`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) throw new Error('Upload fehlgeschlagen');
  const { fileId } = await res.json();
  return fileId; 
}

export async function getGameById(gameId: string): Promise<SpielResource> {
  const response = await fetch(`${HOST}/api/games/${gameId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Spiel konnte nicht geladen werden');
  return response.json();
}

export async function searchGames(q: string) {
  const { data } = await axios.get<SpielResource[]>(`${HOST}/api/games`, {
    params: { search: q, limit: 20 },
  });
  return data;
}