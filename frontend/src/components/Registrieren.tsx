// src/components/Registrieren.tsx
import { useState } from 'react';
import { createUser } from '../backend/api';
import { useAuth, Role } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WelcomePopup } from './WelcomePopup';

export function Registrieren({ onSuccess }: { onSuccess?: () => void }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'advanced' | null>(null);

  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError(t('register.error.fillFields'));
      return;
    }

    try {
      setLoading(true);
      await createUser({ username, email, password, role: 'buyer' });
      // 👉 Direkt zur Hinweis-Seite
      onSuccess?.();
      navigate('/verify-pending', { state: { username } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('register.error.failed'));
    } finally {
      setLoading(false);
    }
  }

  const handlePopupClose = () => {
    navigate('/verify-pending', {
      // 2️⃣  danach weiterleiten
      state: { username: form.username },
    });
  };

  const handleSkillSelect = (level: 'beginner' | 'advanced') => {
    console.log('Skill:', level);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <>
      {showRegisterForm && (
        <div className="register-container">
          <h2>{t('register.title')}</h2>

          <form className="register-box" onSubmit={onSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                {t('register.username')}
              </label>
              <input
                type="text"
                name="username"
                placeholder={t('register.username')}
                value={form.username}
                onChange={update}
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t('register.email')}</label>
              <input
                type="email"
                name="email"
                placeholder={t('register.email')}
                value={form.email}
                onChange={update}
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                {t('register.password')}
              </label>
              <input
                type="password"
                name="password"
                placeholder={t('register.password')}
                value={form.password}
                onChange={update}
                disabled={loading}
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ color: 'red', textAlign: 'center', marginTop: '5px' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? t('register.loading') : t('register.submit')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: 'white',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Registrieren;
