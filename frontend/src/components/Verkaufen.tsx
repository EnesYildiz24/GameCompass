// src/components/Verkaufen.tsx
import { Container, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Login } from './Login';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export function Verkaufen() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [connectErr, setConnectErr] = useState<string | null>(null);
  const [reloading, setReloading] = useState(true);

  const { user, loading, reloadUser } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // **Ohne** Namespace und keyPrefix
  const { t, ready } = useTranslation();

  useEffect(() => {
    async function doReload() {
      await reloadUser();
      setReloading(false);
    }
    doReload();
  }, [reloadUser]);

  if (loading || reloading || !ready) return null;

  if (user?.chargesEnabled && user.payoutsEnabled) {
    return <Navigate to="/verkaufen-intern" replace />;
  }

  async function startStripeOnboarding() {
    setLoadingConnect(true);
    setConnectErr(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/connect/create-account`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setConnectErr(t('sell.errors.stripeStart'));
      setLoadingConnect(false);
    }
  }

  return (
    <>
      <main
        style={{
          backgroundColor: isDarkMode ? 'var(--page-bg)' : 'white',
          minHeight: '100vh',
          padding: 20,
        }}
      >
        <Container className="text-center py-5">
          <h1 className="display-4 fw-bold mb-4" style={{ color: isDarkMode ? 'white' : 'black' }}>
            {t('sell.title')}
          </h1>

          {user ? (
            <>
              {connectErr && <Alert variant="danger">{connectErr}</Alert>}
              <Button onClick={startStripeOnboarding} disabled={loadingConnect}>
                {loadingConnect ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    {t('sell.redirecting')}
                  </>
                ) : user.stripeAccountId ? (
                  t('sell.continueStripe')
                ) : (
                  t('sell.startStripe')
                )}
              </Button>
            </>
          ) : (
            <section className="text-center py-5">
            <h2 style={{ color: isDarkMode ? '#fff' : '#000' }}>
              {t('sell.loginFirst')}
            </h2>
            <Button
              variant="primary"
              size="lg"
              className="mt-3"
              onClick={() => setShowLoginModal(true)}
            >
              {t('nav.login')}
            </Button>
          </section>
          )}
        </Container>
      </main>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('sell.loginRequired')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            {t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
