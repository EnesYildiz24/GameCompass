import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGenre, deleteGenre, getAlleGenres, getGenre, updateGenre } from '../../src/service/GenreService'; // Pfad ggf. anpassen
import { Genre } from '../../src/model/GenreModel';
import { Types } from 'mongoose';

vi.mock('../../src/model/GenreModel', () => ({
    Genre: {
        findById: vi.fn(),
        create: vi.fn(),
        find: vi.fn(),
        deleteOne: vi.fn(),
    },
}));

describe('getGenre', () => {
    const mockId = new Types.ObjectId().toString();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('wirft Fehler, wenn keine ID übergeben wurde', async () => {
        await expect(getGenre('')).rejects.toThrow('Keine ID gefunden');
    });

    it('wirft Fehler, wenn kein Genre gefunden wird', async () => {
        (Genre.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

        await expect(getGenre(mockId)).rejects.toThrow('Keine Genre-ID gefunden');
    });

    it('gibt ein Genre korrekt zurück', async () => {
        const mockGenre = {
            id: mockId,
            name: 'Action',
            description: 'Spiele mit viel Spannung',
            createdAt: new Date(),
            popularity: 87,
        };

        (Genre.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockGenre) });

        const result = await getGenre(mockId);

        expect(result).toEqual({
            id: mockId,
            name: 'Action',
            description: 'Spiele mit viel Spannung',
            createdAt: mockGenre.createdAt,
            popularity: 87,
        });
    });
});



describe('createGenre', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('erstellt ein Genre korrekt', async () => {
        const mockInput = {
            name: 'Adventure',
            description: 'Spannende Entdeckungen',
            popularity: 50,
        };

        const mockCreated = {
            id: '1234567890',
            ...mockInput,
            createdAt: new Date('2023-01-01T00:00:00Z'),
        };

        (Genre.create as any).mockResolvedValue(mockCreated);

        const result = await createGenre(mockInput);

        expect(result).toEqual({
            id: '1234567890',
            name: 'Adventure',
            description: 'Spannende Entdeckungen',
            createdAt: new Date('2023-01-01T00:00:00Z'),
            popularity: 50,
        });

        expect(Genre.create).toHaveBeenCalledWith({
            name: 'Adventure',
            description: 'Spannende Entdeckungen',
            createdAt: expect.any(Date),
            popularity: 50,
        });
    });
});



describe('getAlleGenres', () => {
    it('gibt alle Genres korrekt zurück', async () => {
        const mockGenres = [
            {
                id: '1',
                name: 'Action',
                description: 'Actionreiche Spiele',
                createdAt: new Date('2024-01-01'),
                popularity: 10,
            },
            {
                id: '2',
                name: 'Adventure',
                description: 'Abenteuerliche Erlebnisse',
                createdAt: new Date('2024-02-01'),
                popularity: 20,
            },
        ];

        (Genre.find as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockGenres) });

        const result = await getAlleGenres();

        expect(result).toEqual(mockGenres);
    });

    it('wirft Fehler, wenn kein Genre zurückgegeben wird', async () => {
        (Genre.find as any).mockImplementation(() => {
            throw new Error('DB-Failure');
        });

        await expect(getAlleGenres()).rejects.toThrow('Keine Genre zurückgegeben');
    });
});



describe('updateGenre', () => {
    const mockSave = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('wirft Fehler, wenn Genre nicht gefunden wird', async () => {
        (Genre.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

        await expect(updateGenre({
            id: new Types.ObjectId().toString(),
            name: 'Test',
            description: 'Test Desc',
            popularity: 1,
            createdAt: new Date(),
        })).rejects.toThrow('Genre-ID fehlt, kann nicht updaten');
    });

    it('aktualisiert ein Genre erfolgreich', async () => {
        const genreId = new Types.ObjectId();

        const originalGenre = {
            _id: genreId,
            id: genreId.toString(),
            name: 'Old Name',
            description: 'Old Desc',
            popularity: 0,
            createdAt: new Date('2023-01-01'),
            save: mockSave,
        };

        const updatedGenre = {
            ...originalGenre,
            name: 'New Name',
            description: 'New Desc',
            popularity: 10,
        };

        mockSave.mockResolvedValue(updatedGenre);

        (Genre.findById as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(originalGenre) });

        const result = await updateGenre({
            id: genreId.toString(),
            name: 'New Name',
            description: 'New Desc',
            popularity: 10,
            createdAt: originalGenre.createdAt,
        });

        expect(result).toEqual({
            id: genreId.toString(),
            name: 'New Name',
            description: 'New Desc',
            popularity: 10,
            createdAt: originalGenre.createdAt,
        });

        expect(mockSave).toHaveBeenCalled();
    });
});



describe('deleteGenre', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('wirft Fehler, wenn keine Genre-ID angegeben wurde', async () => {
        await expect(deleteGenre('')).rejects.toThrow('Keine Genre-ID, kann nichts löschen');
    });

    it('wirft Fehler, wenn Genre nicht gelöscht wurde', async () => {
        (Genre.deleteOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ deletedCount: 0 }) });

        const validId = new Types.ObjectId().toString();
        await expect(deleteGenre(validId)).rejects.toThrow(`Genre mit der ID ${validId} wurde nicht gelöscht`);
    });

    it('löscht ein Genre erfolgreich', async () => {
        (Genre.deleteOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ deletedCount: 1 }) });

        const validId = new Types.ObjectId().toString();
        await expect(deleteGenre(validId)).resolves.toBeUndefined();
    });
});