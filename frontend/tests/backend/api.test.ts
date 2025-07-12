import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchWithErrorHandling } from '../../src/backend/fetchWithErrorHandling';
import { logoutFromAnywhere } from '../../src/context/AuthContext';

// Mock der fetch-Funktion
global.fetch = vi.fn();

describe('API-Funktionen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('User-Funktionen', () => {
    it('getAlleUser ruft korrekten Endpunkt auf', async () => {
      const mockResponse = [{ id: '1', username: 'testuser' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const response = await fetchWithErrorHandling('http://localhost:3000/api/user', {
        method: 'GET',
        credentials: 'include',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/user',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    it('login sendet korrekte Daten', async () => {
      const mockResponse = { id: '1', username: 'testuser' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const response = await fetchWithErrorHandling('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        credentials: 'include',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        })
      );
    });
  });

  describe('Spiel-Funktionen', () => {
    it('getAlleSpiele ruft korrekten Endpunkt auf', async () => {
      const mockResponse = [{ id: '1', titel: 'Testspiel' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const response = await fetchWithErrorHandling('http://localhost:3000/api/spiel/alle', {
        method: 'GET',
        credentials: 'include',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/spiel/alle',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });
  });

  describe('Fehlerbehandlung', () => {
    it('behandelt 401 Fehler korrekt', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        status: 401,
        ok: false,
      });

      const mockLogout = vi.fn();
      vi.spyOn(require('../../src/context/AuthContext'), 'logoutFromAnywhere').mockImplementation(
        mockLogout
      );

      await expect(
        fetchWithErrorHandling('http://localhost:3000/api/user', {
          method: 'GET',
          credentials: 'include',
        })
      ).rejects.toThrow('unauthorized');

      expect(mockLogout).toHaveBeenCalled();
    });

    it('behandelt Netzwerkfehler korrekt', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetchWithErrorHandling('http://localhost:3000/api/user', {
          method: 'GET',
          credentials: 'include',
        })
      ).rejects.toThrow('Network error');
    });
  });
});
