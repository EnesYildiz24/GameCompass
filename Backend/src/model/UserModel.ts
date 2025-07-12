import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username?: string;            // nur bei local
  email: string;
  password?: string;            // nur bei local
  role: 'admin' | 'buyer';
  profileImage?: string;
  provider: 'local' | 'google' | 'facebook';
  providerId?: string;          // z.B. Google-sub
  verified?: boolean;         // nur bei local
  isPublisher: boolean
  stripeAccountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

export interface IUserMethods {
  isCorrectPassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    // Bei local-Registrierung:
    username: { type: String, required: function () { return this.provider === 'local'; } },
    password: { type: String, required: function () { return this.provider === 'local'; } },

    // Immer:
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'buyer'], default: 'buyer' },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    providerId: String,        // nicht-unique, weil evtl. mehrere Provider
    verified: { type: Boolean, default: false }, // nur bei local
    profileImage: { type: String, default: '' },
    isPublisher: { type: Boolean, default: false },
    stripeAccountId: { type: String, default: null },
    chargesEnabled: { type: Boolean, default: false },
    payoutsEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    discriminatorKey: 'kind',
  }
);

// Password-Hashing nur für lokale Nutzer
userSchema.pre('save', async function (next) {
  if (this.provider === 'local' && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password!, 10);
  }
  if (this.isNew && this.provider === 'local') {
    this.providerId = this._id.toHexString();
  }
  next();
});

userSchema.pre('updateOne', async function (next) {
  const upd = this.getUpdate() as Partial<IUser>;
  if (upd.provider === 'local' && upd.password) {
    upd.password = await bcrypt.hash(upd.password, 10);
    this.setUpdate(upd);
  }
  next();
});

userSchema.method(
  'isCorrectPassword',
  async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) throw new Error('No local password set');
    return bcrypt.compare(candidatePassword, this.password);
  }
);

export const User = model<IUser, UserModel>('User', userSchema);
