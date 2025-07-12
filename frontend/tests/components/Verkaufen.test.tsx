import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { Verkaufen } from '../../src/components/Verkaufen';
import { createSpiel } from '../../src/backend/api';
import { useTranslation } from 'react-i18next';

jest.mock('../../src/backend/api', () => ({
  createSpiel: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', role: 'seller' },
    isAuthenticated: true,
  }),
}));

describe('Verkaufen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rendert Verkaufsformular korrekt', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Verkaufen />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('sell.title')).toBeInTheDocument();
    expect(screen.getByText('sell.form.title')).toBeInTheDocument();
    expect(screen.getByText('sell.form.description')).toBeInTheDocument();
    expect(screen.getByText('sell.form.price')).toBeInTheDocument();
    expect(screen.getByText('sell.form.genre')).toBeInTheDocument();
    expect(screen.getByText('sell.form.submit')).toBeInTheDocument();
  });

  it('zeigt Fehlermeldungen bei ungültigen Eingaben', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Verkaufen />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('sell.form.submit'));

    expect(await screen.findByText('sell.form.errors.title')).toBeInTheDocument();
    expect(await screen.findByText('sell.form.errors.description')).toBeInTheDocument();
    expect(await screen.findByText('sell.form.errors.price')).toBeInTheDocument();
  });

  it('handelt erfolgreiche Spielerstellung', async () => {
    const mockSpiel = {
      id: '1',
      titel: 'Testspiel',
      beschreibung: 'Testbeschreibung',
      preis: 29.99,
      genre: 'Action'
    };

    (createSpiel as jest.Mock).mockResolvedValueOnce(mockSpiel);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Verkaufen />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('sell.form.title'), {
      target: { value: 'Testspiel' },
    });
    fireEvent.change(screen.getByLabelText('sell.form.description'), {
      target: { value: 'Testbeschreibung' },
    });
    fireEvent.change(screen.getByLabelText('sell.form.price'), {
      target: { value: '29.99' },
    });
    fireEvent.change(screen.getByLabelText('sell.form.genre'), {
      target: { value: 'Action' },
    });

    fireEvent.click(screen.getByText('sell.form.submit'));

    await waitFor(() => {
      expect(createSpiel).toHaveBeenCalledWith({
        titel: 'Testspiel',
        beschreibung: 'Testbeschreibung',
        preis: 29.99,
        genre: 'Action'
      });
    });
  });

  it('zeigt Fehlermeldung bei fehlgeschlagener Erstellung', async () => {
    (createSpiel as jest.Mock).mockRejectedValueOnce(new Error('Erstellung fehlgeschlagen'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Verkaufen />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('sell.form.title'), {
      target: { value: 'Testspiel' },
    });
    fireEvent.change(screen.getByLabelText('sell.form.description'), {
      target: { value: 'Testbeschreibung' },
    });
    fireEvent.change(screen.getByLabelText('sell.form.price'), {
      target: { value: '29.99' },
    });
    fireEvent.change(screen.getByLabelText('sell.form.genre'), {
      target: { value: 'Action' },
    });

    fireEvent.click(screen.getByText('sell.form.submit'));

    expect(await screen.findByText('sell.form.errors.submit')).toBeInTheDocument();
  });
}); 