// src/pages/VerifyPending.tsx
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';       // ⬅️  Theme-Context
import { useTranslation } from 'react-i18next';
import '../styles/VerifyPending.css';                    // ⬅️  neue Styles

export default function VerifyPending() {
  const { state }   = useLocation() as { state?: { username?: string } };
  const { theme }   = useTheme();                        // dark | light
  const { t }       = useTranslation();

  return (
    <main className={`verify-pending ${theme}`}>
      <div className="card">
        <h2>
          {t('verifyPending.title', { username: state?.username ?? '' })}
        </h2>
        <p>{t('verifyPending.subtitle')}</p>
      </div>
    </main>
  );
}
