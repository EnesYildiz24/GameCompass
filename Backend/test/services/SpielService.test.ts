import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSpiel, deleteSpiel, getAlleSpiele, getSpiel, updateSpiel } from '../../src/service/SpielService';
import { Spiel } from '../../src/model/SpielModel';
import { Types } from 'mongoose';

vi.mock('../../src/model/SpielModel', () => ({
    Spiel: {
        find: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        deleteOne: vi.fn()
    },
}));


describe('getAlleSpiele', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('gibt alle Spiele korrekt zurück', async () => {
        const mockSpiele = [
            {
                id: '1',
                name: 'Fifa 25',
                description: 'Fußballspiel',
                price: 59.99,
                released: new Date('2025-01-01'),
                developer: 'EA',
                availability: true,
                rating: 9.5,
                genres: [
                    { id: 1, name: 'Sport' },
                    { id: 2, name: 'Action' }
                ],
                platforms: [
                    { platform: { name: 'PC' } },
                    { platform: { name: 'PlayStation 5' } },
                    { platform: { name: 'Xbox' } }
                ],
                background_image: 'https://example.com/background_image.jpg',
            },
        ];

        // Mock für die `find` Methode
        const mockExec = vi.fn().mockResolvedValue(mockSpiele);

        // Die find Methode mocken
        const mockFind = vi.fn().mockReturnValue({ exec: mockExec });
        Spiel.find = mockFind;

        const result = await getAlleSpiele();

        expect(result).toEqual(mockSpiele);
        expect(mockExec).toHaveBeenCalled(); // Sicherstellen, dass exec aufgerufen wurde
    });

    it('wirft Fehler, wenn kein Spiel zurückgegeben wird', async () => {
        // Mock für die `find` Methode, die einen Fehler wirft
        const mockExec = vi.fn().mockRejectedValue(new Error('DB-Fehler'));

        const mockFind = vi.fn().mockReturnValue({ exec: mockExec });
        Spiel.find = mockFind;

        await expect(getAlleSpiele()).rejects.toThrow('Keine Spiele zurückgegeben');
        expect(mockExec).toHaveBeenCalled(); // Sicherstellen, dass exec aufgerufen wurde
    });
});


describe('getSpiel', () => {
    const mockId = new Types.ObjectId().toString(); // Erstelle eine ID

    beforeEach(() => {
        vi.clearAllMocks(); // Alle Mocks vor jedem Test zurücksetzen
    });

    it('wirft Fehler, wenn keine ID übergeben wurde', async () => {
        await expect(getSpiel('')).rejects.toThrow('Keine ID gefunden');
    });

    it('wirft Fehler, wenn das Spiel nicht gefunden wird', async () => {
        // Mock für `Spiel.findById`, der null zurückgibt
        (Spiel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null), // Wir mocken exec als Funktion, die null zurückgibt
        });

        await expect(getSpiel(mockId)).rejects.toThrow('Keine Spiel-ID gefunden');
    });

    it('gibt das Spiel korrekt zurück, wenn es gefunden wird', async () => {
        const mockSpiel = {
            id: '1',
            name: 'Fifa 25',
            description: 'Fußballspiel',
            price: 59.99,
            released: new Date('2025-01-01'),
            developer: 'EA',
            availability: true,
            rating: 9.5,
            genres: [
                { id: 1, name: 'Sport' },
                { id: 2, name: 'Action' }
            ],
            platforms: [
                { platform: { name: 'PC' } },
                { platform: { name: 'PlayStation 5' } },
                { platform: { name: 'Xbox' } }
            ],
            background_image: 'https://example.com/background_image.jpg',
        };

        // Mock für `Spiel.findById`, das das mockSpiel zurückgibt
        (Spiel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockSpiel), // Wir mocken exec, dass es das Spiel zurückgibt
        });

        const result = await getSpiel(mockId);

        expect(result).toEqual({
            id: mockSpiel.id,
            name: mockSpiel.name,
            description: mockSpiel.description,
            price: mockSpiel.price,
            released: mockSpiel.released,
            developer: mockSpiel.developer,
            availability: mockSpiel.availability,
            platforms: mockSpiel.platforms,
            background_image: mockSpiel.background_image,
            rating: mockSpiel.rating,
            genres: mockSpiel.genres,
        });
    });
});


describe('createSpiel', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Alle Mocks vor jedem Test zurücksetzen
    });

    it('erstellt ein Spiel korrekt', async () => {
        const mockInput = {
            name: 'Fifa 25',
            description: 'Fußballspiel',
            price: 59.99,
            released: new Date('2025-01-01'),
            developer: 'EA',
            availability: true,
            rating: 9.5,
            genres: [
                { id: 1, name: 'Sport' },
                { id: 2, name: 'Action' }
            ],
            platforms: [
                { platform: { name: 'PC' } },
                { platform: { name: 'PlayStation 5' } },
                { platform: { name: 'Xbox' } }
            ],
            background_image: 'https://example.com/background_image.jpg',
        };

        const mockCreated = {
            id: '12345',
            ...mockInput,
            createdAt: new Date('2025-01-01T00:00:00Z'),
        };

        // Mock für die create Methode von Mongoose
        (Spiel.create as any).mockResolvedValue(mockCreated);

        const result = await createSpiel(mockInput);

        expect(result).toEqual({
            id: '12345',
            name: 'Fifa 25',
            description: 'Fußballspiel',
            price: 59.99,
            released: new Date('2025-01-01'),
            developer: 'EA',
            availability: true,
            rating: 9.5,
            genres: [
                { id: 1, name: 'Sport' },
                { id: 2, name: 'Action' }
            ],
            platforms: [
                { platform: { name: 'PC' } },
                { platform: { name: 'PlayStation 5' } },
                { platform: { name: 'Xbox' } }
            ],
            background_image: 'https://example.com/background_image.jpg',
        });

        // Sicherstellen, dass Spiel.create mit den richtigen Parametern aufgerufen wurde
        expect(Spiel.create).toHaveBeenCalledWith({
            name: 'Fifa 25',
            description: 'Fußballspiel',
            price: 59.99,
            released: new Date('2025-01-01'),
            developer: 'EA',
            availability: true,
            rating: 9.5,
            genres: [
                { id: 1, name: 'Sport' },
                { id: 2, name: 'Action' }
            ],
            platforms: [
                { platform: { name: 'PC' } },
                { platform: { name: 'PlayStation 5' } },
                { platform: { name: 'Xbox' } }
            ],
            background_image: 'https://example.com/background_image.jpg',
        });
    });
});



describe('deleteSpiel', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Alle Mocks vor jedem Test zurücksetzen
    });

    it('wirft Fehler, wenn keine ID übergeben wird', async () => {
        await expect(deleteSpiel('')).rejects.toThrow('Keine Spiel-ID, kann nichts löschen');
    });

    it('wirft Fehler, wenn das Spiel nicht gelöscht wird', async () => {
        const mockId = new Types.ObjectId().toString();

        // Mocks für deleteOne Methode mit exec(): simuliere keine Löschung (deletedCount ist 0)
        (Spiel.deleteOne as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue({ deletedCount: 0 }), // exec gibt ein Objekt mit deletedCount zurück
        });

        await expect(deleteSpiel(mockId)).rejects.toThrow('Spiel mit der ID wurde nicht gelöscht');
    });

    it('löscht ein Spiel erfolgreich', async () => {
        const mockId = new Types.ObjectId().toString();

        // Mocks für deleteOne Methode mit exec(): simuliere erfolgreiche Löschung (deletedCount ist 1)
        (Spiel.deleteOne as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue({ deletedCount: 1 }), // exec gibt ein Objekt mit deletedCount zurück
        });

        await expect(deleteSpiel(mockId)).resolves.toBeUndefined(); // Erwartet, dass kein Fehler geworfen wird
    });
});



describe('updateSpiel', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Alle Mocks vor jedem Test zurücksetzen
    });

    it('wirft Fehler, wenn das Spiel nicht gefunden wird', async () => {
        const mockSpielResource = {
            id: '12345',
            name: 'Fifa 25',
            description: 'Fußballspiel',
            price: 59.99,
            released: new Date('2025-01-01'),
            developer: 'EA',
            availability: true,
            rating: 9.5, // rating statt popularity
            genres: [
                { id: 1, name: 'Sport' },
                { id: 2, name: 'Action' }
            ],
            platforms: [
                { platform: { name: 'PC' } },
                { platform: { name: 'PlayStation 5' } },
                { platform: { name: 'Xbox' } }
            ],
            background_image: 'https://example.com/background_image.jpg',
        };

        // Simuliere, dass kein Spiel mit der ID gefunden wurde (exec wird hier mockt)
        (Spiel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null), // exec gibt null zurück
        });

        // Wir erwarten, dass der Fehler "Spiel-ID fehlt, kann nicht updaten" geworfen wird.
        await expect(updateSpiel(mockSpielResource)).rejects.toThrow('Spiel-ID fehlt, kann nicht updaten');
    });

    it('aktualisiert das Spiel erfolgreich', async () => {
        const mockSpielResource = {
            id: '12345',
            name: 'Fifa 25',
            description: 'Fußballspiel',
            price: 59.99,
            genre: 'Sport',
            released: new Date('2025-01-01'),
            developer: 'EA',
            availability: true,
            rating: 9.5, // rating statt popularity
            genres: [
                { id: 1, name: 'Sport' },
                { id: 2, name: 'Action' }
            ],
            platforms: [
                { platform: { name: 'PC' } },
                { platform: { name: 'PlayStation 5' } },
                { platform: { name: 'Xbox' } }
            ],
            background_image: 'https://example.com/background_image.jpg',
        };

        const mockSpiel = {
            id: '12345',
            name: 'Fifa 24',
            description: 'Fußballspiel 24',
            price: 49.99,
            genre: 'Sport',
            released: new Date('2024-01-01'),
            developer: 'EA',
            availability: false,
            genres: [
                { id: 1, name: 'Sport' }
            ],
            platforms: [
                { platform: { name: 'PC' } }
            ],
            background_image: 'https://example.com/old_background.jpg',
            save: vi.fn().mockResolvedValue({
                id: '12345',
                name: mockSpielResource.name,
                description: mockSpielResource.description,
                price: mockSpielResource.price,
                genre: mockSpielResource.genre,
                released: mockSpielResource.released,
                developer: mockSpielResource.developer,
                availability: mockSpielResource.availability,
                rating: mockSpielResource.rating, // rating hier eingefügt
                genres: mockSpielResource.genres,
                platforms: mockSpielResource.platforms,
                background_image: mockSpielResource.background_image,
            }),
        };

        // Simuliere, dass das Spiel mit der angegebenen ID gefunden wird (exec wird hier mockt)
        (Spiel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockSpiel), // exec gibt das mockte Spiel zurück
        });

        // Führe das Update durch
        const result = await updateSpiel(mockSpielResource);

        // Überprüfen, ob das Ergebnis das erwartete zurückgibt
        expect(result).toEqual({
            id: '12345',
            name: mockSpielResource.name,
            description: mockSpielResource.description,
            price: mockSpielResource.price,
            rating: mockSpielResource.rating, // rating hier eingebaut
            released: mockSpielResource.released,
            developer: mockSpielResource.developer,
            availability: mockSpielResource.availability,
            genres: mockSpielResource.genres,
            platforms: mockSpielResource.platforms,
            background_image: mockSpielResource.background_image,
        });

        // Sicherstellen, dass die `save`-Methode aufgerufen wurde
        expect(mockSpiel.save).toHaveBeenCalled();
    });
});
