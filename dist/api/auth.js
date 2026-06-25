import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { Unauthorized } from "./middleware.js";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    return await argon2.verify(hash, password);
}
export function makeJWT(userID, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const payLoad = {
        "iss": "chirpy",
        "sub": userID,
        "iat": iat,
        "exp": iat + 3600,
    };
    const signed = jwt.sign(payLoad, secret);
    return signed;
}
;
export function validateJWT(tokenString, secret) {
    try {
        const verified = jwt.verify(tokenString, secret);
        if (typeof verified.sub !== "string") {
            throw new Error("Invalid token: missing sub");
        }
        return verified.sub;
    }
    catch (err) {
        throw new Unauthorized(String(err));
    }
}
;
export function getBearerToken(req) {
    const fullBearerToken = req.get("Authorization");
    if (typeof fullBearerToken === "string") {
        const bearerToken = fullBearerToken.split(" ")[1];
        return bearerToken;
    }
    else {
        throw new Unauthorized("Token must exist");
    }
}
;
export function makeRefreshToken() {
    const buf = randomBytes(32);
    const refreshTokenString = buf.toString('hex');
    return refreshTokenString;
}
export function getAPIKey(req) {
    const fullApiKey = req.get("Authorization");
    if (typeof fullApiKey === "string") {
        const apiKey = fullApiKey.split(" ")[1];
        return apiKey;
    }
    else {
        throw new Unauthorized("API key must exist");
    }
}
;
