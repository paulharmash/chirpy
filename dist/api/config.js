process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
function envOrThrow(key) {
    if (key === undefined) {
        throw new Error("There must be a DB url");
    }
    return key;
}
export const config = {
    api: {
        fileserverHits: 0,
        platform: envOrThrow(process.env.PLATFORM),
    },
    db: {
        url: envOrThrow(process.env.DB_URL),
        migrationConfig: migrationConfig,
    },
};
