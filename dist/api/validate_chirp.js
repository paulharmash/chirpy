import { BadRequest } from "./middleware.js";
export async function handlerValidation(req, res) {
    const { body } = req.body;
    if (typeof body !== "string") {
        return res.status(400).send({ error: "Something went wrong" });
    }
    if (body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const words = body.split(" ");
    let result = [];
    for (let word of words) {
        if (profaneWords.includes(word.toLowerCase())) {
            word = "****";
        }
        result.push(word);
    }
    const joinedResult = result.join(" ");
    return res.status(200).send({ "cleanedBody": joinedResult });
}
