import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getLogin,
  login as apiLogin,
  logout as apiLogout,
  apiLoginGoogle,
  apiLoginFacebook,
} from '../backend/api';

export type Role = 'admin' | 'buyer' | 'guest';

export interface User {
  id: string;
  username: string;
  role: Role;
  profileImage?: string;

  // Stripe-Status  ➜ alle optional
  stripeAccountId?: string | null;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}
const API_URL = import.meta.env.VITE_API_SERVER_URL;

interface AuthCtx {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  updateProfileImage: (userId: string, profileImage: string) => Promise<User>;
  loginLocal: (email: string, password: string) => Promise<void>;
  loginGoogle: (credential: string) => Promise<void>;
  loginFacebook: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

/* ---------- Helper ---------- */
function userIsValid(u: any): u is User {
  return (
    typeof u?.id === 'string' &&
    u.id.trim() !== '' &&
    typeof u?.username === 'string' &&
    u.username.trim() !== '' &&
    (u.role === 'admin' || u.role === 'buyer' || u.role === 'guest')
  );
}
function toSafeUser(u: any): User | null {
  return userIsValid(u) ? u : null;
}

let externalLogout: () => void = () => { };
export function logoutFromAnywhere() {
  externalLogout();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
          try {
            const srv = await getLogin();          // ← ruft deine /auth/me-Route
            const safe = toSafeUser(srv);
            if (safe) setUser(safe);
          } finally {
            setLoading(false);                     // ⬅︎ erst JETZT!
          }
        })();
      }, []);

  // Expose logout globally
  useEffect(() => {
    externalLogout = async () => {
      setUser(null);
      localStorage.removeItem('currentUser');
    };
    return () => {
      externalLogout = () => { };
    };
  }, []);

  // Hydrate from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      const safe = toSafeUser(JSON.parse(raw));
      safe ? setUser(safe) : localStorage.removeItem('currentUser');
    }
  }, []);

  // Check server session on mount
  useEffect(() => {
    (async () => {
      try {
        const srv = await getLogin();
        const safe = toSafeUser(srv); // getLogin returns UserResource directly
        if (safe) {
          setUser(safe);
          localStorage.setItem('currentUser', JSON.stringify(safe));
        } else {
          await handleLogout();
        }
      } catch {
        await handleLogout();
      }
    })();
  }, []);

  // Persist user changes
  useEffect(() => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  // Local email/password login
  async function loginLocal(email: string, password: string) {
    const res = await apiLogin(email, password); // apiLogin returns UserResource
    const safe = toSafeUser(res);
    if (!safe) throw new Error('Ungültige Login-Antwort');
    setUser(safe);
  }

  // Google OAuth login
  async function loginGoogle(credential: string) {
    const user = await apiLoginGoogle(credential); // <-- ruft API auf
    const safe = toSafeUser(user);
    if (!safe) throw new Error('Google Login fehlgeschlagen');
    setUser(safe);
  }

  async function loginFacebook(accessToken: string) {
    const usr = await apiLoginFacebook(accessToken);
    const safe = toSafeUser(usr);
    if (!safe) throw new Error('Facebook Login fehlgeschlagen');
    setUser(safe);
  }
  // Logout
  async function handleLogout() {
    await apiLogout();
    setUser(null);
    localStorage.removeItem('currentUser');
  }

  const updateProfileImage = async (userId: string, profileImage: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/profile-image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileImage }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Profilbilds');
      }

      const updatedUser = await response.json();

      setUser(prev => prev ? { ...prev, profileImage: updatedUser.profileImage } : null);

      return updatedUser;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profilbilds:', error);
      throw error;
    }
  };


  async function reloadUser() {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Cannot load user");
      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error("reloadUser fehlgeschlagen", err);
    }
  }


  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, updateProfileImage, loginLocal, loginGoogle, loginFacebook, logout: handleLogout, reloadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
