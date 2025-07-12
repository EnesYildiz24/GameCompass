export type UserResource = {
  id?: string;
  username: string;
  email?: string;
  password?: string;
  role: string;
  isPublisher?: boolean;
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
}

export type GenreResource = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  popularity?: number;
};

export type BewertungResource = {
  id: string;
  userId: string;
  spielId: string;
  comment: string;
  stars?: number;
  writtenAt: Date;
  editedAt?: Date;
};

export type BestellungResource = {
  id: string;
  userId: string;
  product: {
    spielId: string;
    name: string;
    price: number;
    amount: number;
  }[];
  price: number;
  status: 'offen' | 'bezahlt' | 'storniert';
  orderAt: Date;
};

interface SellerInfo {
  displayName: string;
  email?: string;
}

export type OfferResource = {
  _id: string;
  game: SpielResource;
  seller: UserResource;
  price: number;
  condition: 'new' | 'used';
  createdAt: string;
  updatedAt: string;
  sellerInfo: SellerInfo; 
};
