import { Request, Response } from "express";

export function handleReadiness(req: Request, res: Response) {
    res.set({
        'Content-Type': 'text/plain',
        'charset': 'utf-8'
    });
    res.send("OK");
}