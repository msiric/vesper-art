import dotenv from "dotenv";
import path from "path";

// current dir
// const __curdir = path.dirname(new URL(import.meta.url).pathname);

// root dir
const __rootdir = path.resolve();

dotenv.config({
  path: path.resolve(__rootdir, `.env.${process.env.NODE_ENV || "local"}`),
  override: true,
});

export const ENV_OPTIONS = {
  STAGING: "staging",
  TESTING: "testing",
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  SEEDING: "seeding",
};

export const environment = process.env.NODE_ENV;

export const domain = {
  client: process.env.CLIENT_URI || "http://localhost:3000",
  server: process.env.SERVER_URI || "http://localhost:5000",
};

export const postgres = {
  database: process.env.PG_DB_URL,
};

export const stripe = {
  secretKey: process.env.STRIPE_SECRET,
  publishableKey: process.env.STRIPE_PUBLISH,
  clientId: process.env.STRIPE_CLIENT,
  authorizeUri: process.env.STRIPE_AUTHORIZE_URI,
  tokenUri: process.env.STRIPE_TOKEN_URI,
  webhookSecret: process.env.STRIPE_WEBHOOK,
};

export const mailer = {
  host: process.env.MAILER_HOST,
  sender: process.env.MAILER_SENDER,
  secure: environment === ENV_OPTIONS.TESTING ? false : true,
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAILER_PASS,
  },
};

export const aws = {
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET,
  signatureVersion: "v4",
  expires: 180,
};

export const tokens = {
  accessToken: process.env.ACCESS_TOKEN_SECRET,
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshToken: process.env.REFRESH_TOKEN_SECRET,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY,
};

export const uuid = {
  version: 4,
  import: "v4",
};

export const admin = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

export const cookie = {
  secret: process.env.COOKIE_SECRET,
};
