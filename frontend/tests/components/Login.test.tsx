import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../src/context/AuthContext';
import { Login } from '../../src/components/Login';
import { login as apiLogin } from '../../src/backend/api';

jest.mock('../../src/backend/api', () => ({
  login: jest.fn(),
}));

describe('Login-Komponente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rendert Login-Formular korrekt', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('zeigt Fehlermeldung bei ungültigen Eingaben', async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/email ist erforderlich/i)).toBeInTheDocument();
    expect(await screen.findByText(/passwort ist erforderlich/i)).toBeInTheDocument();
  });

  it('handelt erfolgreichen Login korrekt', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      role: 'buyer',
      email: 'test@example.com'
    };

    (apiLogin as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(apiLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('zeigt Fehlermeldung bei fehlgeschlagenem Login', async () => {
    (apiLogin as jest.Mock).mockRejectedValueOnce(new Error('Login fehlgeschlagen'));

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/login fehlgeschlagen/i)).toBeInTheDocument();
  });
}); 