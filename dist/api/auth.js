import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    return await argon2.verify(hash, password);
}
export function makeJWT(userID, expiresIn, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const payLoad = {
        "iss": "chirpy",
        "sub": userID,
        "iat": iat,
        "exp": iat + expiresIn,
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
        throw new Error(String(err));
    }
}
;
