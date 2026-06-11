import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type APIConfig = {
  fileserverHits: number,
  platform: string,
};

type DBConfig = {
  url: string,
  migrationConfig: MigrationConfig,
};

function envOrThrow(key: string | undefined) {
  if (key === undefined) {
    throw new Error("There must be a DB url");
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
    platform: envOrThrow(process.env.PLATFORM),
  },
  db: {
    url: envOrThrow(process.env.DB_URL),
    migrationConfig: migrationConfig,
  },
};