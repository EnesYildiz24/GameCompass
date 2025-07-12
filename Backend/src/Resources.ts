export interface BestellungResource {
  id?: string;
  userId: string;
  product: {
    offerId: string;
    spielId: string;
    name: string;
    price: number;
    amount: number;
    isDigital: boolean;
  }[];
  price: number;
  status: 'offen' | 'bezahlt' | 'storniert';
  orderAt: Date;
  stripeSessionId: string;
  stripePaymentIntentId: string;

  /* ➜ NEU */
  shippingAddress?: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  shippingProvider?: string;
  shippingCost?: number;
}

export type BewertungResource = {
  id?: string;
  userId: string;
  spielId: string;
  comment: string;
  stars?: number;
  writtenAt: Date;
  editedAt?: Date;
};

export type GenreResource = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  popularity?: number;
};

export type SpielResource = {
  id?: string;
  name: string;
  description: string;
  price?: number | null;
  released?: Date;
  developer?: string;
  availability?: boolean;
  background_image: string;
  rating: number;
  genres: { id: number; name: string }[];
  platforms: { platform: { name: string } }[];
  screenshots_count: number;
};

export type UserResource = {
  id?: string;
  username: string;
  email?: string;
  password?: string;
  role: string;
  profileImage?: string;
  isPublisher?: boolean;
  stripeAccountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
};

export type BuyerResource = {
  id?: string;
  username: string;
  email?: string;
  password?: string;
  role: 'buyer';
};

export type AdminResource = {
  id?: string;
  username: string;
  email?: string;
  password?: string;
  role: 'admin';
  permissions: string[];
};

export type LoginResource = {
  id: string;
  role: 'admin' | 'buyer';
  exp: number;
  username: string;
};
