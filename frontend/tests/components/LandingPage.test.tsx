import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../../src/components/LandingPage';
import { AuthProvider } from '../../src/context/AuthContext';
import '@testing-library/jest-dom';

describe('LandingPage', () => {
  it('rendert Hauptüberschrift und Beschreibung', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('landing.title')).toBeInTheDocument();
    expect(screen.getByText(/landing\.descPart1/)).toBeInTheDocument();
    expect(screen.getByText(/landing\.descPart2/)).toBeInTheDocument();
  });

  it('rendert Aktionsbuttons', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('landing.cta.explore')).toBeInTheDocument();
    expect(screen.getByText('landing.cta.sell')).toBeInTheDocument();
  });

  it('öffnet Login-Modal bei Klick auf Buttons', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('landing.cta.explore'));
    expect(screen.getByText('landing.modal.loginTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('landing.modal.close'));
    fireEvent.click(screen.getByText('landing.cta.sell'));
    expect(screen.getByText('landing.modal.loginTitle')).toBeInTheDocument();
  });

  it('rendert Feature-Sektionen', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('landing.features.title')).toBeInTheDocument();
    expect(screen.getByText('landing.features.reason1.title')).toBeInTheDocument();
    expect(screen.getByText('landing.features.reason2.title')).toBeInTheDocument();
    expect(screen.getByText('landing.features.reason3.title')).toBeInTheDocument();
  });
});
