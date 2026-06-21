import { config } from "./config.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    res.on("finish", () => {
        config.api.fileserverHits++;
    });
    next();
}
export class BadRequest extends Error {
    constructor(message) {
        super(message);
    }
}
export class Unauthorized extends Error {
    constructor(message) {
        super(message);
    }
}
class Forbidden extends Error {
    constructor(message) {
        super(message);
    }
}
class NotFound extends Error {
    constructor(message) {
        super(message);
    }
}
export function middlewareErrorHandling(err, req, res, next) {
    console.log(err);
    if (err instanceof BadRequest) {
        res.status(400).json({
            "error": err.message
        });
    }
    else if (err instanceof Unauthorized) {
        res.status(401).json({
            "error": "Unauthorized"
        });
    }
    else if (err instanceof Forbidden) {
        res.status(403).json({
            "error": "Forbidden"
        });
    }
    else if (err instanceof NotFound) {
        res.status(404).json({
            "error": "Not Found"
        });
    }
    else {
        res.status(500).json({
            "error": "Something went wrong on our end"
        });
    }
}
