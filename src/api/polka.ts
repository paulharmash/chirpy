import { Request, Response, NextFunction } from "express";
import { updateUserToChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "./auth.js";
import { config } from "./config.js";

export async function handlerUpdateUserToChirpyRed(req: Request, res: Response, next: NextFunction) {
    try {
        const apiKey = getAPIKey(req);
        if (apiKey !== config.api.polkaKey) {
            res.status(401).send();
            return;
        }
    } catch(error) {
        next(error);
        return;
    }
    
    const event = req.body["event"];
    if (event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    const userId = req.body["data"]["userId"];
    try {
        const user = await updateUserToChirpyRed(userId);
        if (user === undefined) {
            res.status(404).send();
            return;
        }
        res.status(204).send();
    } catch(error) {
        next(error);
    }
}