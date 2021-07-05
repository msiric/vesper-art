import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { createConnection, getConnection } from "typeorm";
import { environment, ENV_OPTIONS, postgres } from "../config/secret.js";

const dirname = path.resolve();

export const FIXTURE_OPTIONS = {
  ARTWORK: "artwork",
  COMMENT: "comment",
  DISCOUNT: "discount",
  LICENSE: "license",
  NOTIFICATION: "notification",
  ORDER: "order",
  REVIEW: "review",
  USER: "user",
};

export const connectToDatabase = async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      url: postgres.database,
      logging: true,
      synchronize: true,
      migrations: [path.join(dirname, "dist/migrations/*{.ts,.js}")],
      entities: [path.join(dirname, "dist/entities/*{.ts,.js}")],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("Connected to PostgreSQL");
    return connection;
  } catch (err) {
    console.log("Could not connect to PostgreSQL", err);
  }
};

export const closeConnection = async (connection = null) => {
  return connection ? await connection.close() : await getConnection().close();
};

export const startTransaction = async (connection = null) => {
  const queryRunner = connection
    ? connection.createQueryRunner()
    : getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};

export const commitTransaction = async (queryRunner) => {
  await queryRunner.commitTransaction();
};

export const rollbackTransaction = async (queryRunner) => {
  await queryRunner.rollbackTransaction();
};

export const evaluateTransaction = async (queryRunner) => {
  if (environment === ENV_OPTIONS.TEST) {
    return await rollbackTransaction(queryRunner);
  }
  return await commitTransaction(queryRunner);
};

export const releaseTransaction = async (queryRunner) => {
  await queryRunner.release();
};

export const flushDatabase = async (connection = null) => {
  return connection
    ? await connection.synchronize(true)
    : await getConnection().synchronize(true);
};

export const loadFixture = async (name, connection) => {
  const items = [];
  try {
    const file = yaml.safeLoad(
      fs.readFileSync(`./test/fixtures/${name}.yml`, "utf8")
    );
    console.log(file);
    items = file["fixtures"];
  } catch (e) {
    console.log("fixtures error", e);
  }

  if (!items) return;

  for (let item of items) {
    const entityName = Object.keys(item)[0];
    const data = item[entityName];
    await connection
      .createQueryBuilder()
      .insert()
      .into(entityName)
      .values(data)
      .execute();
  }
};
