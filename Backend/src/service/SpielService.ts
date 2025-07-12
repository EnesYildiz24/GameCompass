import { Types } from "mongoose";
import { ISpiel, Spiel } from "../model/SpielModel";
import { SpielResource } from "../Resources";



export async function getAlleSpiele(): Promise<SpielResource[]> {
    try {
        const spiele = await Spiel.find().exec();

        return spiele.map((spiel) => ({
            id: spiel.id,
            name: spiel.name,
            description: spiel.description,
            price: spiel.price,
            released: spiel.released,
            developer: spiel.developer,
            availability: spiel.availability,
            genres: spiel.genres,
            rating: spiel.rating,
            background_image: spiel.background_image,
            platforms: spiel.platforms,
            screenshots_count: spiel.screenshots_count
        }));
    } catch (error) {
        throw new Error("Keine Spiele zurückgegeben");
    }
}



export async function getSpiel(id: string): Promise<SpielResource> {
    if (!id) {
        throw new Error("Keine ID gefunden");
    }

    const spielFind = await Spiel.findById(id).exec();

    if (!spielFind) {
        throw new Error("Keine Spiel-ID gefunden");
    }

    return {
        id: spielFind.id,
        name: spielFind.name,
        description: spielFind.description,
        price: spielFind.price,
        genres: spielFind.genres,
        released: spielFind.released,
        developer: spielFind.developer,
        availability: spielFind.availability,
        background_image: spielFind.background_image,
        rating: spielFind.rating,
        platforms: spielFind.platforms,
        screenshots_count: spielFind.screenshots_count
    };
}



export async function createSpiel(spielResource: SpielResource): Promise<SpielResource> {
    const newSpiel = await Spiel.create({
        name: spielResource.name,
        description: spielResource.description,
        price: spielResource.price,
        genres: spielResource.genres,
        released: spielResource.released || new Date(),
        developer: spielResource.developer,
        availability: spielResource.availability || false,
        background_image: spielResource.background_image,
        rating: spielResource.rating,
        platforms: spielResource.platforms,
        screenshots_count: spielResource.screenshots_count
    });

    return {
        id: newSpiel.id,
        name: newSpiel.name,
        description: newSpiel.description,
        price: newSpiel.price,
        genres: newSpiel.genres,
        released: newSpiel.released,
        developer: newSpiel.developer,
        availability: newSpiel.availability,
        background_image: newSpiel.background_image,
        rating: newSpiel.rating,
        platforms: newSpiel.platforms,
        screenshots_count: newSpiel.screenshots_count
    };
}



export async function updateSpiel(spielResource: SpielResource): Promise<SpielResource> {
    const spiel = await Spiel.findById(spielResource.id).exec();

    if (!spiel) {
        throw new Error("Spiel-ID fehlt, kann nicht updaten");
    }

    spiel.name = spielResource.name;
    spiel.description = spielResource.description;
    spiel.price = spielResource.price ?? 0;
    spiel.genres = spielResource.genres;
    spiel.released = spielResource.released;
    spiel.developer = spielResource.developer;
    spiel.availability = spielResource.availability;
    spiel.background_image = spielResource.background_image,
        spiel.rating = spielResource.rating,
        spiel.platforms = spielResource.platforms,
        spiel.screenshots_count = spielResource.screenshots_count

    const savedSpiel = await spiel.save();

    return {
        id: spiel.id,
        name: savedSpiel.name,
        description: savedSpiel.description,
        price: savedSpiel.price,
        genres: savedSpiel.genres,
        released: savedSpiel.released,
        developer: savedSpiel.developer,
        availability: savedSpiel.availability,
        background_image: savedSpiel.background_image,
        rating:  savedSpiel.rating,
        platforms: savedSpiel.platforms,
        screenshots_count: savedSpiel.screenshots_count
    };
}



export async function deleteSpiel(id: string): Promise<void> {
    if (!id) {
        throw new Error("Keine Spiel-ID, kann nichts löschen");
    }

    const spielId = new Types.ObjectId(id);
    const res = await Spiel.deleteOne({ _id: spielId }).exec();

    if (res.deletedCount !== 1) {
        throw new Error(`Spiel mit der ID wurde nicht gelöscht`);
    }
}