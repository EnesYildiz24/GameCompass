import { HydratedDocument, Types } from "mongoose";
import { Genre } from "../model/GenreModel";
import { GenreResource } from "../Resources";


export async function getAlleGenres(): Promise<GenreResource[]> {
    try {
        const genres = await Genre.find().exec();

        return genres.map((genre) => ({
            id: genre.id,
            name: genre.name,
            description: genre.description,
            createdAt: genre.createdAt,
            popularity: genre.popularity,
        }));

    } catch (error) {
        throw new Error("Keine Genre zurückgegeben");
    }
}


export async function getGenre(id: string): Promise<GenreResource> {
    if (!id) {
        throw new Error("Keine ID gefunden");
    }

    const genreFind = await Genre.findById(id).exec();

    if (!genreFind) {
        throw new Error("Keine Genre-ID gefunden");
    }

    return {
        id: genreFind.id,
        name: genreFind.name,
        description: genreFind.description,
        createdAt: genreFind.createdAt,
        popularity: genreFind.popularity,
    };
}


export async function createGenre(genreResource: GenreResource): Promise<GenreResource> {
    
    const newGenre = await Genre.create({
        name: genreResource.name,
        description: genreResource.description,
        createdAt: genreResource.createdAt || new Date(),
        popularity: genreResource.popularity || 0, // Defaultwert = 0
    });

    return {
        id: newGenre.id,
        name: newGenre.name,
        description: newGenre.description,
        createdAt: newGenre.createdAt,
        popularity: newGenre.popularity,
    };
}



export async function updateGenre(genreResource: GenreResource): Promise<GenreResource> {
    
    const genre = await Genre.findById(genreResource.id).exec();

    if (!genre) {
        throw new Error("Genre-ID fehlt, kann nicht updaten");
    }

    genre.name = genreResource.name;
    genre.description = genreResource.description;
    genre.popularity = genreResource.popularity;

    const savedGenre = await genre.save();

    return {
        id: genre.id,
        name: savedGenre.name,
        description: savedGenre.description,
        createdAt: savedGenre.createdAt,
        popularity: savedGenre.popularity,
    };
}


export async function deleteGenre(id: string): Promise<void> {
    if (!id) {
        throw new Error("Keine Genre-ID, kann nichts löschen");
    }

    const genreId = new Types.ObjectId(id);
    const res = await Genre.deleteOne({ _id: genreId }).exec();

    if (res.deletedCount !== 1) {
        throw new Error(`Genre mit der ID ${id} wurde nicht gelöscht`);
    }
}


