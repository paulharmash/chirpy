import { config } from "./config.js";
export function handlerReset(req, res) {
    config.fileserverHits = 0;
    res.send("Hits reset to 0");
}
