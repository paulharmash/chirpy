import { Request, Response, NextFunction } from "express";
import { BadRequest } from "./middleware.js";
import { createChirp, retrieveChirps, retrieveChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "./config.js";

export async function handlerChirps(req: Request, res: Response, next: NextFunction) {
    let userID: string;
    try {
        const bearerToken = getBearerToken(req);
        userID = validateJWT(bearerToken, config.api.secret);
    } catch (error) {
        next(error);
        return;
    }
    const chirpBody = await handlerValidation(req, res);
    if (typeof chirpBody !== "string") {
        return;
    }
    try { 
        const chirp = await createChirp({"body": chirpBody, "userId": userID});
        res.status(201).send(chirp);
    } catch (error) {
        next(error);
    }
}

export async function handlerValidation(req: Request, res: Response) {
    const { body } = req.body;

    if (typeof body !== "string") {
        return res.status(400).send({ error: "Something went wrong" });
    }

    if (body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }

    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const words = body.split(" ");
    let result: string[] = [];
    for (let word of words) {
        if (profaneWords.includes(word.toLowerCase())) {
                word = "****";
            } 
            result.push(word);
    }
    return result.join(" ");
}

export async function handlerChirpsRetrieval(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await retrieveChirps();
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
}

export async function handlerChirpRetrieval(req: Request, res: Response, next: NextFunction) {
    const chirpId = String(req.params.chirpId);
    try {
        const chirp = await retrieveChirp(chirpId);
        if (chirp === undefined) {
            res.status(404).send("");
            return;
        }
        res.status(200).send(chirp);
    } catch (error) {
        next(error);
    }
}