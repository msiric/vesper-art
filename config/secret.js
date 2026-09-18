import "dotenv/config";
import { environment, ENV_OPTIONS } from "../common/environment";
export { environment, ENV_OPTIONS } from "../common/environment";

export const domain = {
  client: process.env.CLIENT_URI || "http://127.0.0.1:5175",
  server: process.env.SERVER_URI || "http://127.0.0.1:5075",
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
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshToken: process.env.REFRESH_TOKEN_SECRET,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "24h",
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
