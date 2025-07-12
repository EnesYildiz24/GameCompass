import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Spiele } from '../../src/components/Spiele';
import { getAlleSpiele } from '../../src/backend/api';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../src/backend/api', () => ({
  getAlleSpiele: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Spiele', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rendert Ladezustand', () => {
    render(
      <BrowserRouter>
        <Spiele />
      </BrowserRouter>
    );

    expect(screen.getByText('games.loading')).toBeInTheDocument();
  });

  it('zeigt Spiele korrekt an', async () => {
    const mockSpiele = [
      { id: '1', titel: 'Testspiel 1', price: 29.99, description: 'Beschreibung 1', genre: 'Action' },
      { id: '2', titel: 'Testspiel 2', price: 39.99, description: 'Beschreibung 2', genre: 'RPG' }
    ];

    vi.mocked(getAlleSpiele).mockResolvedValueOnce(mockSpiele);

    render(
      <BrowserRouter>
        <Spiele />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Testspiel 1')).toBeInTheDocument();
      expect(screen.getByText('Testspiel 2')).toBeInTheDocument();
      expect(screen.getByText('29,99 €')).toBeInTheDocument();
      expect(screen.getByText('39,99 €')).toBeInTheDocument();
    });
  });

  it('zeigt Fehlermeldung bei Fehler', async () => {
    vi.mocked(getAlleSpiele).mockRejectedValueOnce(new Error('Fehler beim Laden'));

    render(
      <BrowserRouter>
        <Spiele />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('games.error')).toBeInTheDocument();
    });
  });

  it('filtert Spiele nach Genre', async () => {
    const mockSpiele = [
      { id: '1', titel: 'Action Spiel', genre: 'Action', description: 'Beschreibung 1', price: 29.99 },
      { id: '2', titel: 'RPG Spiel', genre: 'RPG', description: 'Beschreibung 2', price: 39.99 }
    ];

    vi.mocked(getAlleSpiele).mockResolvedValueOnce(mockSpiele);

    render(
      <BrowserRouter>
        <Spiele />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Action Spiel')).toBeInTheDocument();
      expect(screen.getByText('RPG Spiel')).toBeInTheDocument();
    });
  });
}); 