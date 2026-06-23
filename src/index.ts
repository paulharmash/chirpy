import express from "express";
import postgres from "postgres";
import { handleReadiness } from "./api/healthz.js";
import { middlewareLogResponses, middlewareMetricsInc, middlewareErrorHandling } from "./api/middleware.js";
import { handlerLoggingNumberOfRequests} from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerUserCreation, handlerCredentialsUpdate } from "./api/users.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./api/config.js";
import { handlerChirps, handlerChirpsRetrieval, handlerChirpRetrieval, handlerChirpDeletion } from "./api/chirps.js";
import { handlerLogin, handlerRefreshToken, handlerRevokeRefreshToken } from "./api/login.js";

const migrationClient = postgres(config.db.url, {max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerLoggingNumberOfRequests);
app.get("/api/healthz", handleReadiness);
app.get("/api/chirps", handlerChirpsRetrieval);
app.get("/api/chirps/:chirpId", handlerChirpRetrieval);
app.post("/admin/reset", handlerReset);
app.post("/api/chirps", handlerChirps);
app.post("/api/users", handlerUserCreation);
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeRefreshToken);
app.put("/api/users", handlerCredentialsUpdate);
app.delete("/api/chirps/:chirpId", handlerChirpDeletion);

app.use(middlewareErrorHandling);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}); 