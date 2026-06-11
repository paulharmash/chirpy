import { Request, Response, NextFunction } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";

export async function handlerUserCreation(req: Request, res: Response, next: NextFunction) {
    try {
        const email = req.body["email"];
        const password = req.body["password"];
        if (!email || !password) {
            res.status(400).send("Email and password must exist");
            return;
        }
        const hashedPassword = await hashPassword(password);
        const user = await createUser({"email": email, "hashedPassword": hashedPassword});
        const {hashedPassword: _hashedPassword, ...userResponse} = user;
        res.status(201).send(userResponse); 
    } catch (error) {
        next(error);
    }
};