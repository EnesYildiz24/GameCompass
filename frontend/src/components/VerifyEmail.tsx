// src/pages/VerifyEmail.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/');                 // kein Token → Home
      return;
    }

    /* ←  Backticks waren hier wichtig  */
    fetch(`/user/verify-email?token=${encodeURIComponent(token)}`)
      .then(async r => {
        if (!r.ok) throw new Error();

        let username = '';
        const ct = r.headers.get('content-type') ?? '';
        if (ct.includes('application/json')) {
          try {
            const data = await r.json();
            username = data.username ?? '';
          } catch {}
        }

        // state mitgeben
        navigate('/', { replace: true, state: { welcome: true, username } });
      })
      .catch(() => navigate('/'));
  }, []);

  return <main style={{ textAlign: 'center', padding: '2rem' }}>E-Mail wird bestätigt …</main>;
}
