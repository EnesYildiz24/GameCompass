import { Router } from "express";
import { createGenre, deleteGenre, getAlleGenres, getGenre, updateGenre } from "../service/GenreService";
import { optionalAuthentication, requiresAuthentication } from "./authenticator";
import { body, matchedData, param, validationResult } from "express-validator";
import { GenreResource } from "../Resources";


const genreRouter = Router();

genreRouter.get("/alle", 
    optionalAuthentication,
    async (req, res) => {
    try {
        const genres = await getAlleGenres();
        res.status(200).json(genres);
    } catch (error) {
        console.error("Fehler beim Abrufen der Genres:", error);
        res.status(500).json({ message: 'Fehler beim Abrufen der Genres' });
    }
});



genreRouter.post("/",
    requiresAuthentication, 
    body('name').isString().isLength({ min: 1, max: 100 }),  
    body('description').optional().isString().isLength({ min: 1, max: 1000 }),  
    body('createdAt').optional().isISO8601(),  
    body('popularity').optional().isInt({ min: 0 }),  

    async (req, res, next) => {

        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        if (!req.user) {
            res.status(401).json({ message: 'Nicht authentifiziert' });
        }

        // Überprüfen, ob der Benutzer ein Admin ist
        if (req.role !== 'admin') {
            res.status(403).json({ message: 'Nur Admins dürfen Genres erstellen' });
        }

        try {
            const genreResource: GenreResource = req.body;

            
            const createdGenre = await createGenre(genreResource);

            
            res.status(201).json(createdGenre);
        } catch (err) {
            console.error('Fehler beim Erstellen des Genres:', err);
            res.status(400).json({ message: 'Genre konnte nicht erstellt werden' });
        }
    }
);


genreRouter.put("/",
    requiresAuthentication,
    param("id").isMongoId(),
    body("name").isString().isLength({ min: 1, max: 100 }),
    body("description").optional().isString().isLength({ max: 1000 }),
    body("popularity").optional().isInt({ min: 0 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const genreResource = matchedData(req) as GenreResource;
            const updatedGenre = await updateGenre(genreResource);
            res.status(200).json(updatedGenre);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Genres:", error);
            res.status(400).json({ message: "Genre konnte nicht aktualisiert werden" });
        }
    }
);


genreRouter.delete("/:id",
    requiresAuthentication,
    param("id").isMongoId(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const genreId = req.params.id;
            await deleteGenre(genreId);
            res.sendStatus(204);
        } catch (error) {
            console.error("Fehler beim Löschen des Genres:", error);
            res.status(404).json({ message: "Genre konnte nicht gelöscht werden" });
        }
    }
);



genreRouter.get("/:id",
    optionalAuthentication,
    param("id").isMongoId(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const genre = await getGenre(req.params.id);
            res.status(200).json(genre);
        } catch (error) {
            console.error("Fehler beim Abrufen des Genres:", error);
            res.status(404).json({ message: "Genre nicht gefunden" });
        }
    }
);



export { genreRouter };
    

