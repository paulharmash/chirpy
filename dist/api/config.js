process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
function envOrThrow(key, keyName) {
    if (key === undefined) {
        throw new Error(`${keyName} must exist`);
    }
    return key;
}
export const config = {
    api: {
        fileserverHits: 0,
        platform: envOrThrow(process.env.PLATFORM, "PLATFORM"),
        secret: envOrThrow(process.env.JWT_SECRET, "JWT_SECRET"),
    },
    db: {
        url: envOrThrow(process.env.DB_URL, "DB_URL"),
        migrationConfig: migrationConfig,
    },
};
