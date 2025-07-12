import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import { getLogin, login as apiLogin, logout as apiLogout } from '../../src/backend/api';

// Mock der API-Funktionen
jest.mock('../../src/backend/api', () => ({
  getLogin: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
}));

describe('AuthContext', () => {
  const TestComponent = () => {
    const { user, isAuthenticated, isAdmin, isBuyer } = useAuth();
    return (
      <div>
        <div data-testid="user">{JSON.stringify(user)}</div>
        <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
        <div data-testid="isAdmin">{isAdmin.toString()}</div>
        <div data-testid="isBuyer">{isBuyer.toString()}</div>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('initialisiert sich korrekt ohne eingeloggten User', async () => {
    (getLogin as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
  });

  it('handelt erfolgreichen Login korrekt', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      role: 'buyer',
      email: 'test@example.com'
    };

    (apiLogin as jest.Mock).mockResolvedValue(mockUser);

    const LoginTestComponent = () => {
      const { login } = useAuth();
      return <button onClick={() => login('test@example.com', 'password')}>Login</button>;
    };

    await act(async () => {
      render(
        <AuthProvider>
          <LoginTestComponent />
          <TestComponent />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByRole('button').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(screen.getByTestId('isBuyer').textContent).toBe('true');
  });

  it('handelt Logout korrekt', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      role: 'admin',
      email: 'test@example.com'
    };

    (getLogin as jest.Mock).mockResolvedValue(mockUser);
    (apiLogout as jest.Mock).mockResolvedValue({});

    const LogoutTestComponent = () => {
      const { logout } = useAuth();
      return <button onClick={() => logout()}>Logout</button>;
    };

    await act(async () => {
      render(
        <AuthProvider>
          <LogoutTestComponent />
          <TestComponent />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByRole('button').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('prüft Login-Status korrekt', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      role: 'admin',
      email: 'test@example.com'
    };

    (getLogin as jest.Mock).mockResolvedValue(mockUser);

    const CheckStatusComponent = () => {
      const { checkLoginStatus } = useAuth();
      return <button onClick={() => checkLoginStatus()}>Check Status</button>;
    };

    await act(async () => {
      render(
        <AuthProvider>
          <CheckStatusComponent />
          <TestComponent />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByRole('button').click();
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(screen.getByTestId('isAdmin').textContent).toBe('true');
  });
}); 