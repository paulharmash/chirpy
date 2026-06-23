import { Request, Response, NextFunction } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { hashPassword, getBearerToken, validateJWT } from "./auth.js";
import { config } from "./config.js";

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

export async function handlerCredentialsUpdate(req: Request, res: Response, next: NextFunction) {
    let userID: string;
    try {
        const bearerToken = getBearerToken(req);
        userID = validateJWT(bearerToken, config.api.secret);
    } catch (error) {
        next(error);
        return;
    }
    try {
        const email = req.body["email"];
        const password = req.body["password"];
        if (!email || !password) {
            res.status(400).send("Email and password must exist");
            return;
        }
        const hashedPassword = await hashPassword(password);
        const user = await updateUser(userID, email, hashedPassword);
        const {hashedPassword: _hashedPassword, ...userResponse} = user;
        res.status(200).send(userResponse); 
    } catch (error) {
        next(error);
    }
}