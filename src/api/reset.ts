import { Request, Response } from "express";
import { config } from "./config.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        res.status(403).send("403 Forbidden");
        return;
    }
    await deleteUsers();
    config.api.fileserverHits = 0;
    res.send("Hits reset to 0");
}