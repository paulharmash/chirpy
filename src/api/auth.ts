import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "node:crypto";
import { Unauthorized } from "./middleware.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
   return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const payLoad: JwtPayload = {
        "iss": "chirpy",
        "sub": userID,
        "iat": iat,
        "exp": iat + 3600,
    }
    const signed = jwt.sign(payLoad, secret);
    return signed;
};

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const verified = jwt.verify(tokenString, secret);
            if (typeof verified.sub !== "string") {
                throw new Error("Invalid token: missing sub");
            }
            return verified.sub;
    } catch (err) {
        throw new Unauthorized(String(err));
        }
};

export function getBearerToken(req: Request): string {
    const fullBearerToken = req.get("Authorization");
    if (typeof fullBearerToken === "string") {
        const bearerToken = fullBearerToken.split(" ")[1];
        return bearerToken;
    } else {
        throw new Unauthorized("Token must exist");
    }    
};

export function makeRefreshToken() {
    const buf = randomBytes(32);
    const refreshTokenString = buf.toString('hex');
    return refreshTokenString;
}

export function getAPIKey(req: Request): string {
    const fullApiKey = req.get("Authorization");
    if (typeof fullApiKey === "string") {
        const apiKey = fullApiKey.split(" ")[1];
        return apiKey;
    } else {
        throw new Unauthorized("API key must exist");
    }    
};