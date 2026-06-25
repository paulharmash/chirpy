import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type APIConfig = {
  fileserverHits: number,
  platform: string,
  secret: string,
  polkaKey: string,
};

type DBConfig = {
  url: string,
  migrationConfig: MigrationConfig,
};

function envOrThrow(key: string | undefined, keyName: string) {
  if (key === undefined) {
    throw new Error(`${keyName} must exist`);
  }
  return key;
}

type Config = {
  api: APIConfig,
  db: DBConfig,
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    platform: envOrThrow(process.env.PLATFORM, "PLATFORM"),
    secret: envOrThrow(process.env.JWT_SECRET, "JWT_SECRET"),
    polkaKey: envOrThrow(process.env.POLKA_KEY, "POLKA_KEY"),
  },
  db: {
    url: envOrThrow(process.env.DB_URL, "DB_URL"),
    migrationConfig: migrationConfig,
  },
};