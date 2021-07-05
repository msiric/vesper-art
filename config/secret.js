import dotenv from "dotenv";
import path from "path";

// current dir
// const __curdir = path.dirname(new URL(import.meta.url).pathname);

// root dir
const __rootdir = path.resolve();

dotenv.config({
  path: path.resolve(__rootdir, `.env.${process.env.NODE_ENV || "local"}`),
});

export const ENV_OPTIONS = {
  LOCAL: "local",
  TEST: "test",
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

export const environment = process.env.NODE_ENV;

export const domain = {
  client: process.env.CLIENT_URI || "http://localhost:3000",
  server: process.env.SERVER_URI || "http://localhost:5000",
};

export const mongo = {
  database: `mongodb+srv://${process.env.MONGO_DEV_DB_USER}:${process.env.MONGO_DEV_DB_PASS}@${process.env.MONGO_DEV_DB_NAME}-5nkas.mongodb.net/test?retryWrites=true&w=majority`,
  secret: process.env.MONGO_DEV_DB_SECRET,
};

export const postgres = {
  database: process.env.PG_DEV_DB_URL,
};

export const stripe = {
  secretKey: process.env.STRIPE_SECRET,
  publishableKey: process.env.STRIPE_PUBLISH,
  clientId: process.env.STRIPE_CLIENT,
  authorizeUri: process.env.STRIPE_AUTHORIZE_URI,
  tokenUri: process.env.STRIPE_TOKEN_URI,
};

export const mailer = {
  host: process.env.MAILER_HOST,
  sender: process.env.MAILER_SENDER,
  secure: environment === ENV_OPTIONS.TEST ? false : true,
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAILER_PASS,
  },
};

export const uuid = {
  version: 4,
  import: "v4",
};
