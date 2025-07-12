import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { Registrieren } from '../../src/components/Registrieren';
import { createUser } from '../../src/backend/api';

jest.mock('../../src/backend/api', () => ({
  createUser: jest.fn(),
}));

describe('Registrieren', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rendert Registrierungsformular korrekt', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Registrieren />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrieren/i })).toBeInTheDocument();
  });

  it('zeigt Fehlermeldungen bei ungültigen Eingaben', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Registrieren />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /registrieren/i }));

    expect(await screen.findByText(/username ist erforderlich/i)).toBeInTheDocument();
    expect(await screen.findByText(/email ist erforderlich/i)).toBeInTheDocument();
    expect(await screen.findByText(/passwort ist erforderlich/i)).toBeInTheDocument();
  });

  it('handelt erfolgreiche Registrierung', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com'
    };

    (createUser as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Registrieren />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrieren/i }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'buyer'
      });
    });
  });

  it('zeigt Fehlermeldung bei fehlgeschlagener Registrierung', async () => {
    (createUser as jest.Mock).mockRejectedValueOnce(new Error('Registrierung fehlgeschlagen'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Registrieren />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrieren/i }));

    expect(await screen.findByText(/registrierung fehlgeschlagen/i)).toBeInTheDocument();
  });
}); 