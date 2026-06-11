import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
   return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const payLoad: JwtPayload = {
        "iss": "chirpy",
        "sub": userID,
        "iat": iat,
        "exp": iat + expiresIn,
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
        throw new Error(String(err));
        }
};