import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { createConnection, getConnection } from "typeorm";
import { environment, ENV_OPTIONS, postgres } from "../config/secret";
import { ArtworkVisibility } from "../entities/Artwork";
import { OrderStatus } from "../entities/Order";

const dirname = path.resolve();

const DEFAULT_VALUES = {
  ARTWORK: "artwork",
  VERSION: "version",
  COVER: "cover",
  MEDIA: "media",
  USER: "user",
  AVATAR: "avatar",
  ORDER: "order",
  LICENSE: "license",
  DISCOUNT: "discount",
  REVIEW: "review",
  COMMENT: "comment",
  FAVORITE: "favorite",
  NOTIFICATION: "notification",
  INTENT: "intent",
};

export const ARTWORK_SELECTION = {
  ACTIVE_STATUS: true,
  VISIBILITY_STATUS: ArtworkVisibility.visible,
  INVISIBILITY_STATUS: ArtworkVisibility.invisible,
  STRIPPED_INFO: (selector = DEFAULT_VALUES.ARTWORK) => [`${selector}.id`],
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.ARTWORK) => [
    `${selector}.id`,
    `${selector}.active`,
    `${selector}.visibility`,
    `${selector}.created`,
  ],
  OWNER_INFO: (selector = DEFAULT_VALUES.ARTWORK) => [`${selector}.ownerId`],
  CURRENT_INFO: (selector = DEFAULT_VALUES.ARTWORK) => [
    `${selector}.currentId`,
  ],
};

export const VERSION_SELECTION = {
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.VERSION) => [
    `${selector}.id`,
    `${selector}.title`,
    `${selector}.description`,
    `${selector}.availability`,
    `${selector}.type`,
    `${selector}.license`,
    `${selector}.use`,
    `${selector}.personal`,
    `${selector}.commercial`,
    `${selector}.created`,
  ],
  ARTWORK_INFO: (selector = DEFAULT_VALUES.VERSION) => [`${selector}.artwork`],
};

export const COVER_SELECTION = {
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.COVER) => [
    `${selector}.id`,
    `${selector}.source`,
    `${selector}.orientation`,
    `${selector}.dominant`,
    `${selector}.height`,
    `${selector}.width`,
    `${selector}.created`,
  ],
};

export const MEDIA_SELECTION = {
  STRIPPED_INFO: (selector = DEFAULT_VALUES.MEDIA) => [
    `${selector}.id`,
    `${selector}.orientation`,
    `${selector}.dominant`,
    `${selector}.height`,
    `${selector}.width`,
  ],
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.MEDIA) => [
    `${selector}.id`,
    `${selector}.source`,
    `${selector}.orientation`,
    `${selector}.dominant`,
    `${selector}.height`,
    `${selector}.width`,
    `${selector}.created`,
  ],
};

export const USER_SELECTION = {
  ACTIVE_STATUS: true,
  VERIFIED_STATUS: true,
  STRIPPED_INFO: (selector = DEFAULT_VALUES.USER) => [
    `${selector}.id`,
    `${selector}.name`,
    `${selector}.active`,
  ],
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.USER) => [
    `${selector}.id`,
    `${selector}.email`,
    `${selector}.name`,
    `${selector}.avatar`,
    `${selector}.description`,
    `${selector}.country`,
    `${selector}.active`,
    `${selector}.created`,
  ],
  STRIPE_INFO: (selector = DEFAULT_VALUES.USER) => [
    `${selector}.businessAddress`,
    `${selector}.stripeId`,
  ],
  DETAILED_INFO: (selector = DEFAULT_VALUES.USER) => [
    `${selector}.customWork`,
    `${selector}.displayFavorites`,
  ],
  VERIFICATION_INFO: (selector = DEFAULT_VALUES.USER) => [
    `${selector}.resetToken`,
    `${selector}.resetExpiry`,
    `${selector}.jwtVersion`,
    `${selector}.verificationToken`,
    `${selector}.verificationExpiry`,
    `${selector}.verified`,
  ],
  AUTH_INFO: (selector = DEFAULT_VALUES.USER) => [
    `${selector}.password`,
    `${selector}.jwtVersion`,
  ],
  LICENSE_INFO: (selector = DEFAULT_VALUES.USER) => [`${selector}.fullName`],
};

export const AVATAR_SELECTION = {
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.AVATAR) => [
    `${selector}.id`,
    `${selector}.source`,
    `${selector}.orientation`,
    `${selector}.dominant`,
    `${selector}.height`,
    `${selector}.width`,
    `${selector}.created`,
  ],
};

export const ORDER_SELECTION = {
  COMPLETED_STATUS: OrderStatus.completed,
  CANCELED_STATUS: OrderStatus.canceled,
  PROCESSING_STATUS: OrderStatus.processing,
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.ORDER) => [
    `${selector}.id`,
    `${selector}.status`,
    `${selector}.created`,
  ],
  DETAILED_INFO: (selector = DEFAULT_VALUES.ORDER) => [
    `${selector}.spent`,
    `${selector}.earned`,
    `${selector}.fee`,
  ],
  ARTWORK_INFO: (selector = DEFAULT_VALUES.ORDER) => [`${selector}.artworkId`],
  VERSION_INFO: (selector = DEFAULT_VALUES.ORDER) => [`${selector}.versionId`],
  SELLER_INFO: (selector = DEFAULT_VALUES.ORDER) => [`${selector}.sellerId`],
  BUYER_INFO: (selector = DEFAULT_VALUES.ORDER) => [`${selector}.buyerId`],
  SELLER_EARNED: (selector = DEFAULT_VALUES.ORDER) => [`${selector}.earned`],
  BUYER_SPENT: (selector = DEFAULT_VALUES.ORDER) => [
    `${selector}.spent`,
    `${selector}.fee`,
  ],
};

export const LICENSE_SELECTION = {
  ACTIVE_STATUS: true,
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.LICENSE) => [
    `${selector}.id`,
    `${selector}.fingerprint`,
    `${selector}.type`,
    `${selector}.price`,
    `${selector}.created`,
  ],
  USAGE_INFO: (selector = DEFAULT_VALUES.LICENSE) => [`${selector}.usage`],
  ASSIGNEE_INFO: (selector = DEFAULT_VALUES.LICENSE) => [
    `${selector}.assignor`,
    `${selector}.assignorIdentifier`,
  ],
  ASSIGNOR_INFO: (selector = DEFAULT_VALUES.LICENSE) => [
    `${selector}.assignee`,
    `${selector}.assigneeIdentifier`,
    `${selector}.company`,
  ],
};

export const DISCOUNT_SELECTION = {
  ACTIVE_STATUS: true,
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.DISCOUNT) => [
    `${selector}.id`,
    `${selector}.name`,
    `${selector}.discount`,
    `${selector}.created`,
  ],
};

export const REVIEW_SELECTION = {
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.REVIEW) => [
    `${selector}.id`,
    `${selector}.rating`,
    `${selector}.created`,
  ],
};

export const COMMENT_SELECTION = {
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.COMMENT) => [
    `${selector}.id`,
    `${selector}.content`,
    `${selector}.modified`,
    `${selector}.created`,
  ],
  ARTWORK_INFO: (selector = DEFAULT_VALUES.COMMENT) => [
    `${selector}.artworkId`,
  ],
};

export const FAVORITE_SELECTION = {
  STRIPPED_INFO: (selector = DEFAULT_VALUES.FAVORITE) => [`${selector}.id`],
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.FAVORITE) => [
    `${selector}.id`,
    `${selector}.created`,
  ],
  ARTWORK_INFO: (selector = DEFAULT_VALUES.FAVORITE) => [
    `${selector}.artworkId`,
  ],
};

export const NOTIFICATION_SELECTION = {
  STRIPPED_INFO: (selector = DEFAULT_VALUES.NOTIFICATION) => [`${selector}.id`],
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.NOTIFICATION) => [
    `${selector}.id`,
    `${selector}.link`,
    `${selector}.ref`,
    `${selector}.type`,
    `${selector}.read`,
    `${selector}.created`,
  ],
};

export const INTENT_SELECTION = {
  ESSENTIAL_INFO: (selector = DEFAULT_VALUES.INTENT) => [
    `${selector}.id`,
    `${selector}.created`,
  ],
};

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

export const resolveSubQuery = (
  queryBuilder,
  alias,
  entity,
  cursor,
  threshold
) =>
  cursor
    ? queryBuilder
        .subQuery()
        .select(`${alias}.serial`)
        .from(entity, alias)
        .where(`${alias}.id = :id`, { id: cursor })
        .getQuery()
    : threshold;
