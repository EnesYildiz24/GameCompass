import { Types } from "mongoose";
import { Bewertung, IBewertung } from "../model/BewertungModel";
import { Spiel } from "../model/SpielModel";
import { User } from "../model/UserModel";
import { BewertungResource } from "../Resources";





export async function getAlleBewertungen(): Promise<BewertungResource[]> {
    try {
        const bewertungen = await Bewertung.find()
            .populate("userId")
            .populate("spielId")
            .exec();

        return bewertungen.map((bewertung) => ({
            id: bewertung.id.toString(),
            userId: bewertung.userId.toString(),
            spielId: bewertung.spielId.toString(),
            comment: bewertung.comment,
            stars: bewertung.stars,
            writtenAt: bewertung.writtenAt,
            editedAt: bewertung.editedAt
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der Bewertungen:", error);
        throw new Error("Keine Bewertungen zurückgegeben");
    }
}


export async function getBewertung(bewertungId: string): Promise<BewertungResource> {
    if (!bewertungId?.trim()) {
        throw new Error("Keine Bewertungs-ID angegeben");
    }

    if (!Types.ObjectId.isValid(bewertungId)) {
        throw new Error("Ungültige Bewertungs-ID");
    }

    try {
        const bewertung = await Bewertung.findById(bewertungId)
            .populate("userId")
            .populate("spielId")
            .exec();

        if (!bewertung) {
            throw new Error("Bewertung nicht gefunden");
        }

        return {
            id: bewertung.id.toString(),
            userId: bewertung.userId.toString(),
            spielId: bewertung.spielId.toString(),
            comment: bewertung.comment,
            stars: bewertung.stars,
            writtenAt: bewertung.writtenAt,
            editedAt: bewertung.editedAt,
        };
    } catch (error) {
        console.error("Fehler beim Abrufen der Bewertung:", error);
    
        // Bekannte Fehler durchlassen
        if (error instanceof Error && error.message) {
            throw error;
        }
    
        throw new Error("Datenbankfehler");
    }
}






export async function createBewertung(bewertungresource: BewertungResource): Promise<BewertungResource> {
    if (!Types.ObjectId.isValid(bewertungresource.userId)) {
        throw new Error("Ungültige User-ID");
    }

    if (!Types.ObjectId.isValid(bewertungresource.spielId)) {
        throw new Error("Ungültige Spiel-ID");
    }


    const userExists = await User.findById(bewertungresource.userId).exec();
    if (!userExists) {
        throw new Error("Benutzer nicht gefunden");
    }


    const spielExists = await Spiel.findById(bewertungresource.spielId).exec();
    if (!spielExists) {
        throw new Error("Spiel nicht gefunden");
    }


    const newBewertung = await Bewertung.create({
        userId: bewertungresource.userId,
        spielId: bewertungresource.spielId,
        comment: bewertungresource.comment,
        stars: bewertungresource.stars,
        writtenAt: bewertungresource.writtenAt || new Date(),
        editedAt: bewertungresource.editedAt || null
    });


    return {
        id: newBewertung.id.toString(),
        userId: newBewertung.userId.toString(),
        spielId: newBewertung.spielId.toString(),
        comment: newBewertung.comment,
        stars: newBewertung.stars,
        writtenAt: newBewertung.writtenAt,
        editedAt: newBewertung.editedAt
    };
}



export async function updateBewertung(bewertungResource: BewertungResource): Promise<BewertungResource> {
    if (!bewertungResource.userId || !bewertungResource.spielId) {
        throw new Error("Benutzer- oder Spiel-ID fehlt, kann nicht aktualisieren");
    }

    const bewertung = await Bewertung.findOne({
        userId: bewertungResource.userId,
        spielId: bewertungResource.spielId
    }).exec();

    if (!bewertung) {
        throw new Error("Bewertung nicht gefunden");
    }

    bewertung.comment = bewertungResource.comment;
    bewertung.stars = bewertungResource.stars;
    bewertung.editedAt = new Date();

    const updated = await bewertung.save();

    return {
        id: bewertung.id.toString(),
        userId: bewertung.userId.toString(),
        spielId: bewertung.spielId.toString(),
        comment: updated.comment,
        stars: updated.stars,
        writtenAt: bewertung.writtenAt,
        editedAt: updated.editedAt
    };
}



export async function deleteBewertung(id: string): Promise<void> {
    if (!id) {
        throw new Error("Keine Bewertungs-ID angegeben, kann nichts löschen");
    }

    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Ungültige Bewertungs-ID");
    }

    const res = await Bewertung.deleteOne({ _id: new Types.ObjectId(id) }).exec();

    if (res.deletedCount !== 1) {
        throw new Error(`Bewertung mit der ID ${id} wurde nicht gelöscht`);
    }
}