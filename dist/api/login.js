import { userLookup } from "../db/queries/users.js";
import { checkPasswordHash, getBearerToken } from "./auth.js";
import { makeJWT, makeRefreshToken } from "./auth.js";
import { config } from "./config.js";
import { createRefreshToken, getUserFromRefreshToken, revokeRefreshToken } from "../db/queries/tokens.js";
export async function handlerLogin(req, res, next) {
    const email = req.body["email"];
    const password = req.body["password"];
    if (!email || !password) {
        res.status(400).send("Email and password must exist");
        return;
    }
    const user = await userLookup(email);
    if (user === undefined) {
        res.status(401).send("Incorrect email or password");
        return;
    }
    if (await checkPasswordHash(password, user.hashedPassword)) {
        const { hashedPassword: _hashedPassword, ...userResponse } = user;
        const JWT = makeJWT(user.id, config.api.secret);
        const refreshToken = makeRefreshToken();
        await createRefreshToken({ token: refreshToken, userId: userResponse.id, expiresAt: new Date(Date.now() + (60 * 24 * 3600 * 1000)) });
        res.status(200).send({ ...userResponse, token: JWT, refreshToken: refreshToken });
    }
    else {
        res.status(401).send("Incorrect email or password");
    }
}
export async function handlerRefreshToken(req, res, next) {
    const refreshToken = getBearerToken(req);
    try {
        const userId = await getUserFromRefreshToken(refreshToken);
        const JWT = makeJWT(userId, config.api.secret);
        res.status(200).send({ token: JWT });
    }
    catch (error) {
        next(error);
    }
}
export async function handlerRevokeRefreshToken(req, res, next) {
    try {
        const refreshToken = getBearerToken(req);
        await revokeRefreshToken(refreshToken);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
