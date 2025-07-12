import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Types } from 'mongoose';
import { Bewertung } from '../../src/model/BewertungModel';
import { createBewertung, deleteBewertung, getAlleBewertungen, getBewertung, updateBewertung } from '../../src/service/BewertungService';
import { User } from '../../src/model/UserModel';
import { Spiel } from '../../src/model/SpielModel';
import { BewertungResource } from '../../src/Resources';


vi.mock('../../src/model/BewertungModel', () => {
    return {
        Bewertung: {
            findOne: vi.fn(),
            exists: vi.fn(),
            find: vi.fn(),
            findById: vi.fn(),
            deleteOne: vi.fn(),
            create: vi.fn().mockImplementation((data) => Promise.resolve({ ...data, id: "123" })),
        },
    };
});

vi.mock("../../src/model/SpielModel", () => {
    return {
        Spiel: {
            findById: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId().toString() })
            }),
        },
    };
});

vi.mock("../../src/model/UserModel", () => {
    return {
        User: {
            findById: vi.fn().mockImplementation(() => ({
                exec: vi.fn().mockResolvedValue(null),
            })),
        },
    };
});

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

describe('getAlleBewertungen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('gibt formatierte Bewertungen zurück', async () => {
        const mockBewertungen = [
            {
                id: '1',
                userId: { toString: () => 'user1' },
                spielId: { toString: () => 'spiel1' },
                comment: 'Tolles Spiel!',
                stars: 5,
                writtenAt: new Date(),
                editedAt: null
            }
        ];

        (Bewertung.find as any).mockReturnValue({
            populate: vi.fn().mockReturnThis(),
            exec: vi.fn().mockResolvedValue(mockBewertungen)
        });

        const result = await getAlleBewertungen();

        expect(result).toEqual([
            {
                id: '1',
                userId: 'user1',
                spielId: 'spiel1',
                comment: 'Tolles Spiel!',
                stars: 5,
                writtenAt: mockBewertungen[0].writtenAt,
                editedAt: null
            }
        ]);
    });

    it('wirft Fehler, wenn etwas schiefläuft', async () => {
        (Bewertung.find as any).mockReturnValue({
            populate: vi.fn().mockReturnThis(),
            exec: vi.fn().mockRejectedValue(new Error('DB-Fehler'))
        });

        await expect(getAlleBewertungen()).rejects.toThrow('Keine Bewertungen zurückgegeben');
    });
});



describe("getBewertung", () => {
    const validId = new Types.ObjectId().toString();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wirft Fehler, wenn keine ID angegeben wurde", async () => {
        await expect(getBewertung("")).rejects.toThrow("Keine Bewertungs-ID angegeben");
    });

    it("wirft Fehler, wenn die ID ungültig ist", async () => {
        await expect(getBewertung("ungültig")).rejects.toThrow("Ungültige Bewertungs-ID");
    });

    it("wirft Fehler, wenn Bewertung nicht gefunden wird", async () => {
        (Bewertung.findById as any).mockReturnValue({
            populate: vi.fn().mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    exec: vi.fn().mockResolvedValue(null), // <- Bewertung wird nicht gefunden
                }),
            }),
        });

        await expect(getBewertung(validId)).rejects.toThrow("Bewertung nicht gefunden");
    });

    it("gibt Bewertung korrekt zurück", async () => {
        const mockBewertung = {
            id: validId,
            userId: { toString: () => "user1" },
            spielId: { toString: () => "spiel1" },
            comment: "Top Spiel",
            stars: 5,
            writtenAt: new Date("2023-01-01T00:00:00Z"),
            editedAt: new Date("2023-01-02T00:00:00Z"),
        };

        (Bewertung.findById as any).mockReturnValue({
            populate: vi.fn().mockReturnValue({
                populate: vi.fn().mockReturnValue({
                    exec: vi.fn().mockResolvedValue(mockBewertung),
                }),
            }),
        });

        const result = await getBewertung(validId);

        expect(result).toEqual({
            id: validId,
            userId: "user1",
            spielId: "spiel1",
            comment: "Top Spiel",
            stars: 5,
            writtenAt: new Date("2023-01-01T00:00:00Z"),
            editedAt: new Date("2023-01-02T00:00:00Z"),
        });
    });
});



describe("createBewertung", () => {
    it("wirft Fehler bei ungültiger User-ID", async () => {
        await expect(
            createBewertung({
                userId: "invalid-id", spielId: new Types.ObjectId().toString(), comment: "Test", stars: 5,
                writtenAt: new Date("2023-01-02T00:00:00Z"),
            })
        ).rejects.toThrow("Ungültige User-ID");
    });

    it("wirft Fehler bei ungültiger Spiel-ID", async () => {
        await expect(
            createBewertung({
                userId: new Types.ObjectId().toString(), spielId: "invalid-id", comment: "Test", stars: 5,
                writtenAt: new Date("2023-01-02T00:00:00Z"),
            })
        ).rejects.toThrow("Ungültige Spiel-ID");
    });

    it("wirft Fehler, wenn Benutzer nicht gefunden wird", async () => {
        (User.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null), // Benutzer nicht gefunden
        });

        await expect(
            createBewertung({
                userId: new Types.ObjectId().toString(), spielId: new Types.ObjectId().toString(), comment: "Test", stars: 5,
                writtenAt: new Date("2023-01-02T00:00:00Z"),
            })
        ).rejects.toThrow("Benutzer nicht gefunden");
    });

    it("wirft Fehler, wenn Spiel nicht gefunden wird", async () => {
        (User.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId() }), // Benutzer existiert
        });

        (Spiel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue(null), // Spiel nicht gefunden
        });

        await expect(
            createBewertung({
                userId: new Types.ObjectId().toString(), spielId: new Types.ObjectId().toString(), comment: "Test", stars: 5,
                writtenAt: new Date("2023-01-02T00:00:00Z"),
            })
        ).rejects.toThrow("Spiel nicht gefunden");
    });

    it("erstellt eine Bewertung korrekt", async () => {
        const userId = new Types.ObjectId().toString();
        const spielId = new Types.ObjectId().toString();

        (User.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId() }), // Benutzer existiert
        });

        (Spiel.findById as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(), titel: "Fifa 25" }), // Spiel existiert
        });

        const mockBewertung = {
            id: new Types.ObjectId().toString(),
            userId,
            spielId,
            comment: "Tolles Spiel!",
            stars: 5,
            writtenAt: new Date(),
            editedAt: null,
        };

        (Bewertung.create as any).mockResolvedValue(mockBewertung);

        const result = await createBewertung({
            userId,
            spielId,
            comment: "Tolles Spiel!",
            stars: 5,
            writtenAt: new Date("2023-01-02T00:00:00Z"),
        });

        expect(result).toEqual({
            id: mockBewertung.id,
            userId: mockBewertung.userId,
            spielId: mockBewertung.spielId,
            comment: mockBewertung.comment,
            stars: mockBewertung.stars,
            writtenAt: mockBewertung.writtenAt,
            editedAt: mockBewertung.editedAt,
        });
    });
});




describe('getBewertung', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    it('wirft Fehler, wenn Bewertung nicht gefunden wird', async () => {
      const mockExec = vi.fn().mockResolvedValue(null);
      const mockPopulate = vi.fn().mockReturnThis();
  
      (Bewertung.findById as any).mockReturnValue({
        populate: mockPopulate,
        exec: mockExec
      });
  
      const id = new Types.ObjectId().toString();
      await expect(getBewertung(id)).rejects.toThrow("Bewertung nicht gefunden");
    });
  
    it('gibt Bewertung korrekt zurück', async () => {
      const id = new Types.ObjectId();
      const fakeBewertung = {
        id,
        userId: new Types.ObjectId('64a1f87e5fc13a7c2061a124'),
        spielId: new Types.ObjectId('64a1f87e5fc13a7c2061a125'),
        comment: 'Gut',
        stars: 4,
        writtenAt: new Date('2023-01-01'),
        editedAt: new Date('2023-01-02'),
      };
  
      const mockExec = vi.fn().mockResolvedValue(fakeBewertung);
      const mockPopulate = vi.fn().mockReturnThis();
  
      (Bewertung.findById as any).mockReturnValue({
        populate: mockPopulate,
        exec: mockExec
      });
  
      const result = await getBewertung(id.toString());
  
      expect(result).toEqual({
        id: id.toString(),
        userId: fakeBewertung.userId.toString(),
        spielId: fakeBewertung.spielId.toString(),
        comment: 'Gut',
        stars: 4,
        writtenAt: fakeBewertung.writtenAt,
        editedAt: fakeBewertung.editedAt,
      });
    });
  });



describe('deleteBewertung', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    it('soll einen Fehler werfen, wenn keine ID übergeben wurde', async () => {
      await expect(deleteBewertung('')).rejects.toThrow("Keine Bewertungs-ID angegeben, kann nichts löschen");
    });
  
    it('soll einen Fehler werfen, wenn die ID ungültig ist', async () => {
      await expect(deleteBewertung('abc')).rejects.toThrow("Ungültige Bewertungs-ID");
    });
  
    it('soll deleteOne mit der richtigen ID aufrufen', async () => {
      const id = new Types.ObjectId().toString();
      (Bewertung.deleteOne as any).mockReturnValueOnce({
        exec: () => Promise.resolve({ deletedCount: 1 })
      });
  
      await expect(deleteBewertung(id)).resolves.toBeUndefined();
      expect(Bewertung.deleteOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(id) });
    });
  
    it('soll einen Fehler werfen, wenn keine Bewertung gelöscht wurde', async () => {
      const id = new Types.ObjectId().toString();
      (Bewertung.deleteOne as any).mockReturnValueOnce({
        exec: () => Promise.resolve({ deletedCount: 0 })
      });
  
      await expect(deleteBewertung(id)).rejects.toThrow(`Bewertung mit der ID ${id} wurde nicht gelöscht`);
    });
  });



  describe('updateBewertung', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    it('soll Fehler werfen, wenn userId oder spielId fehlt', async () => {
      const resource = { comment: 'Test', stars: 4 } as BewertungResource;
      await expect(updateBewertung(resource)).rejects.toThrow("Benutzer- oder Spiel-ID fehlt, kann nicht aktualisieren");
    });
  
    it('soll Fehler werfen, wenn keine Bewertung gefunden wird', async () => {
      (Bewertung.findOne as any).mockReturnValueOnce({ exec: () => Promise.resolve(null) });
  
      const resource: BewertungResource = {
          userId: 'user123',
          spielId: 'spiel123',
          comment: 'Neue Bewertung',
          stars: 5,
          writtenAt: new Date('2024-01-01')
      };
  
      await expect(updateBewertung(resource)).rejects.toThrow("Bewertung nicht gefunden");
    });
  
    it('soll Bewertung aktualisieren und zurückgeben', async () => {
      const fakeBewertung = {
        id: 'bewertung123',
        userId: 'user123',
        spielId: 'spiel123',
        comment: 'Alt',
        stars: 2,
        writtenAt: new Date('2022-01-01'),
        editedAt: null,
        save: vi.fn().mockResolvedValue({
          comment: 'Neu',
          stars: 5,
          editedAt: new Date('2024-01-01')
        })
      };
  
      (Bewertung.findOne as any).mockReturnValueOnce({
        exec: () => Promise.resolve(fakeBewertung)
      });
  
      const resource: BewertungResource = {
          userId: 'user123',
          spielId: 'spiel123',
          comment: 'Neu',
          stars: 5,
          writtenAt: new Date('2024-01-01')
      };
  
      const result = await updateBewertung(resource);
  
      expect(fakeBewertung.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 'bewertung123',
        userId: 'user123',
        spielId: 'spiel123',
        comment: 'Neu',
        stars: 5,
        writtenAt: fakeBewertung.writtenAt,
        editedAt: expect.any(Date)
      });
    });
  });