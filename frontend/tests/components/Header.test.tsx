import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { Header } from '../../src/components/Header';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    setUser: vi.fn(),
  }),
}));

describe('Header', () => {
  it('rendert GameCompass Brand und Navigation', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('GameCompass')).toBeInTheDocument();
    expect(screen.getByText('nav.games')).toBeInTheDocument();
    expect(screen.getByText('nav.sell')).toBeInTheDocument();
    expect(screen.getByText('nav.about')).toBeInTheDocument();
  });

  it('zeigt Login-Option wenn nicht authentifiziert', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('nav.login')).toBeInTheDocument();
    expect(screen.getByText('nav.register')).toBeInTheDocument();
  });

  it('zeigt Username und Logout wenn authentifiziert', () => {
    vi.mocked(require('../../src/context/AuthContext').useAuth).mockReturnValue({
      user: { username: 'testuser' },
      isAuthenticated: true,
      setUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('nav.logout')).toBeInTheDocument();
  });

  it('führt Logout korrekt aus', () => {
    const mockSetUser = vi.fn();
    vi.mocked(require('../../src/context/AuthContext').useAuth).mockReturnValue({
      user: { username: 'testuser' },
      isAuthenticated: true,
      setUser: mockSetUser,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('nav.logout'));
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
});
