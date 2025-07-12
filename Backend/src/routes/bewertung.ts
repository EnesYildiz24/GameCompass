import { Router } from "express";
import { createBewertung, deleteBewertung, getAlleBewertungen, getBewertung, updateBewertung } from "../service/BewertungService";
import { optionalAuthentication, requiresAuthentication } from "./authenticator";
import { body, matchedData, param, validationResult } from "express-validator";
import { BewertungResource } from "../Resources";


const bewertungRouter = Router();



bewertungRouter.get("/",
    optionalAuthentication,
    async (_req, res): Promise<void> => {
        try {
            const bewertungen = await getAlleBewertungen();
            res.status(200).json(bewertungen);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Fehler beim Laden der Bewertungen" });
        }
    });




bewertungRouter.post("/",
    requiresAuthentication,
    body("userId").isMongoId(),
    body("spielId").isMongoId(),
    body("comment").isString().isLength({ min: 1, max: 1000 }),
    body("stars").optional().isInt({ min: 1, max: 5 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const data = matchedData(req) as BewertungResource;

            const createdBew = await createBewertung({
                id: data.id,
                userId: data.userId,
                spielId: data.spielId,
                comment: data.comment,
                stars: data.stars,
                writtenAt: new Date()
            });

            res.status(201).json(createdBew);
        } catch (err) {
            console.error(err);
            res.sendStatus(400);
        }
    }
);



bewertungRouter.put("/",
    requiresAuthentication,
    param("userId").isMongoId(),
    body("spielId").isMongoId(),
    body("comment").isString().isLength({ min: 1, max: 1000 }),
    body("stars").optional().isInt({ min: 1, max: 5 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const data = matchedData(req) as BewertungResource;

            const updatedBew = await updateBewertung({
                id: data.id,
                userId: data.userId,
                spielId: data.spielId,
                comment: data.comment,
                stars: data.stars,
                writtenAt: new Date(),
                editedAt: new Date()
            });

            res.status(200).json(updatedBew);
        } catch (err) {
            console.error(err);
            res.sendStatus(400);
        }
    }
);



bewertungRouter.delete("/:id",
    requiresAuthentication,
    param("id").isMongoId(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const bewertungId = req.params.id;
            await deleteBewertung(bewertungId);
            res.sendStatus(204);
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    }
);



bewertungRouter.get("/:id",
    requiresAuthentication,
    param("id").isMongoId(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const bewertungId = req.params.id;
            const bewertung = await getBewertung(bewertungId);
            res.status(200).json(bewertung);
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    }
);

export default bewertungRouter;