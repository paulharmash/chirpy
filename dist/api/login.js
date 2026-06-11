import { userLookup } from "../db/queries/users.js";
import { checkPasswordHash } from "./auth.js";
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
        res.status(200).send(userResponse);
    }
    else {
        res.status(401).send("Incorrect email or password");
    }
}
