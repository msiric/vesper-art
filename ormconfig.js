import dotenv from "dotenv";
import path from "path";
import { environment, ENV_OPTIONS } from "./config/secret";

const __rootdir = path.resolve();

// yarn run migrate:generate -- <INSERT NAME OF MIGRATION HERE>

dotenv.config({
  path: path.resolve(__rootdir, `.env.${process.env.NODE_ENV || "local"}`),
  override: true,
});

const config = {
  type: "postgres",
  url: process.env.PG_DB_URL,
  synchronize: environment === ENV_OPTIONS.PRODUCTION ? false : true,
  migrationsRun: environment === ENV_OPTIONS.PRODUCTION ? false : true,
  logging: environment === ENV_OPTIONS.DEVELOPMENT ? true : false,
  logger: environment === ENV_OPTIONS.PRODUCTION ? "file" : "advanced-console",
  migrations: [path.join(__rootdir, "dist/migrations/*{.ts,.js}")],
  entities: [path.join(__rootdir, "dist/entities/*{.ts,.js}")],
  cli: {
    migrationsDir: "migrations",
    entitiesDir: "entities",
  },
  ssl: false,
};

export default config;
