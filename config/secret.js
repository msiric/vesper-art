import dotenv from "dotenv";
import path from "path";

// current dir
// const __curdir = path.dirname(new URL(import.meta.url).pathname);

// root dir
const __rootdir = path.resolve();

dotenv.config({
  path: path.resolve(
    __rootdir,
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});

export const mongo = {
  database: `mongodb+srv://${process.env.MONGO_DEV_DB_USER}:${process.env.MONGO_DEV_DB_PASS}@${process.env.MONGO_DEV_DB_NAME}-5nkas.mongodb.net/test?retryWrites=true&w=majority`,
  secret: process.env.MONGO_DEV_DB_SECRET,
};

export const postgres = {
  database: process.env.PG_DEV_DB_URL,
};

export const server = {
  appName: process.env.APP,
  clientDomain: process.env.DOMAIN || "http://localhost:3000",
  serverDomain: process.env.DOMAIN || "http://localhost:5000",
  stripeDomain: "https://connect.stripe.com",
  port: process.env.PORT || 5000,
};

export const stripe = {
  secretKey: process.env.STRIPE_SECRET,
  publishableKey: process.env.STRIPE_PUBLISH,
  clientId: process.env.STRIPE_CLIENT,
  authorizeUri: "https://connect.stripe.com/express/oauth/authorize",
  tokenUri: "https://connect.stripe.com/oauth/token",
};

export const mailer = {
  sender: process.env.MAILER_SENDER,
  email: process.env.MAILER_MAIL,
  password: process.env.MAILER_PASS,
};

export const uuid = {
  version: 4,
  import: "v4",
};
