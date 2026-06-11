import { config } from "./config.js";
export function handlerLoggingNumberOfRequests(req, res) {
    res.set({
        'Content-Type': 'text/plain',
        'charset': 'utf-8'
    });
    res.send(`Hits: ${config.fileserverHits}`);
}
