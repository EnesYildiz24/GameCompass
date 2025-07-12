import React, { useState } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Registrieren } from './Registrieren';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';

interface LoginProps {
  onSuccess?: () => void;
}

export function Login({ onSuccess }: LoginProps) {
  const navigate = useNavigate();
  const { loginLocal, loginGoogle, loginFacebook } = useAuth();
  const { t } = useTranslation();

  const [data, setData] = useState({ email: '', password: '' });
  const [loginFailedMsg, setLoginFailedMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const fbAppId = import.meta.env.VITE_FB_APP_ID;

  if (showRegister) {
    return <Registrieren onSuccess={onSuccess} />;
  }

  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginFailedMsg(null);

    if (!data.email || !data.password) {
      setLoginFailedMsg(t('login.error.fillFields'));
      return;
    }

    try {
      setLoading(true);
      await loginLocal(data.email, data.password);
      navigate('/');
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('login.error.failed');
      setLoginFailedMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(false);
    if (!forgotEmail) {
      setForgotError(t('login.error.fillFields'));
      return;
    }
    setForgotLoading(true);
    // Hier würdest du einen echten API-Call machen
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 1200);
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={onLogin}>
        <h2 style={{ textAlign: 'center', width: '100%' }}>{t('login.title')}</h2>
        <div className="input-row">
          <input
            type="email"
            name="email"
            placeholder={t('login.email')}
            value={data.email}
            onChange={update}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder={t('login.password')}
            value={data.password}
            onChange={update}
            disabled={loading}
          />
        </div>
        {loginFailedMsg && (
          <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{loginFailedMsg}</p>
        )}
        <button
          className="btn btn-primary btn-lg"
          type="submit"
          style={{ marginTop: '20px', width: '100%', padding: '10px' }}
          disabled={loading}
        >
          {loading ? t('login.loading') : t('login.submit')}
        </button>
        <div className="social-login-row">
          <FacebookLogin
            appId={fbAppId}
            scope="public_profile"
            fields="id,name,email"
            dialogParams={{ auth_type: 'rerequest' } as any}
            onSuccess={async (response) => {
              try {
                await loginFacebook(response.accessToken);
                navigate('/');
                onSuccess?.();
              } catch (err) {
                console.error('Facebook Login fehlgeschlagen', err);
              }
            }}
            onFail={(error) => {
              console.error('Facebook Login Error:', error);
            }}
            style={{
              marginTop: '10px',
              backgroundColor: '#1877f2',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Mit Facebook anmelden
          </FacebookLogin>
          <div className="google-btn-wrapper google-login-center">
            <GoogleLogin
              onSuccess={async (res) => {
                const credential = res.credential;
                if (!credential) return;
                try {
                  await loginGoogle(credential);
                  navigate('/');
                  onSuccess?.();
                } catch (err) {
                  console.error('Google Login fehlgeschlagen', err);
                }
              }}
              onError={() => {
                console.error('Google Login fehlgeschlagen');
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="#" onClick={e => { e.preventDefault(); setShowForgotPassword(true); }}>{t('login.forgotPassword')}</a>
          <div style={{ marginTop: '10px' }}>
            {t('login.noAccount')}{' '}
            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setShowRegister(true)}>
              {t('login.registerNow')}
            </span>
          </div>
        </div>
      </form>
      {/* Forgot Password Overlay */}
      {showForgotPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            padding: '32px 24px',
            borderRadius: '10px',
            minWidth: '320px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            position: 'relative',
            maxWidth: '90vw',
            overflow: 'visible'
          }}>
            <button onClick={() => setShowForgotPassword(false)} style={{
              position: 'absolute',
              top: '-16px',
              right: '-16px',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 22,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001
            }} aria-label="Schließen">&times;</button>
            <h3 style={{ textAlign: 'center', marginBottom: 20 }}>{t('login.forgotPassword')}</h3>
            {forgotSuccess ? (
              <p style={{ color: 'green', textAlign: 'center' }}>{t('login.forgotSuccess') || 'Falls die E-Mail existiert, wurde ein Link gesendet.'}</p>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder={t('login.email')}
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: 4, border: '1px solid #ccc' }}
                  disabled={forgotLoading}
                />
                {forgotError && <p style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{forgotError}</p>}
                <button
                  type="submit"
                  style={{ width: '100%', padding: '10px', background: '#1877f2', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? t('login.loading') : t('login.forgotSubmit') || 'Passwort zurücksetzen'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
