import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <App />
              </ErrorBoundary>
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);