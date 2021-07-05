import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { featureFlags } from "./common/constants";
import { domain, environment, ENV_OPTIONS } from "./config/secret";
import { mongo } from "./config/secret.js";
import api from "./routes/api/index.js";
import stripe from "./routes/stripe/index.js";
import { connectToDatabase } from "./utils/database";
import {
  sanitizeBody,
  sanitizeParams,
  sanitizeQuery,
} from "./utils/helpers.js";

const app = express();
const dirname = path.resolve();

(async () => {
  app.use(
    cors({
      origin: domain.client,
      credentials: true,
    })
  );

  app.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        if (req.originalUrl.startsWith("/stripe")) req.rawBody = buf.toString();
      },
    })
  );

  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    cookieSession({
      name: "session",
      maxAge: 24 * 60 * 60 * 1000,
      secret: mongo.secret,
      keys: ["key1", "key2"],
    })
  );

  // mongoose.connect(
  //   mongo.database,
  //   { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  //   (err) => {
  //     if (err) console.log(err);
  //     console.log("Connected to MongoDB");
  //   }
  // );

  // mongoose.set("useCreateIndex", true);
  if (environment !== ENV_OPTIONS.TEST) {
    try {
      await connectToDatabase();
      console.log("Connected to PostgreSQL");
    } catch (err) {
      console.log("DB error", err);
    }
  }

  app.use(compression());
  app.use(helmet({ contentSecurityPolicy: false }));
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  //       "script-src": [
  //         "'self'",
  //         "'unsafe-inline'",
  //         "https://vesperart-dev.herokuapp.com/",
  //       ],
  //       "img-src": [
  //         "'self'",
  //         `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/`,
  //       ],
  //     },
  //   })
  // );

  // app.use(rateLimiter);

  app.use("/api", sanitizeParams, sanitizeQuery, sanitizeBody, api);
  // FEATURE FLAG - stripe
  featureFlags.stripe &&
    app.use("/stripe", sanitizeParams, sanitizeQuery, sanitizeBody, stripe);

  app.use(express.static(path.join(dirname, "client/build")));
  app.use(express.static(path.join(dirname, "public")));

  app.use((req, res, next) => {
    res.sendFile(path.join(dirname, "client/build", "index.html"));
  });

  app.use((req, res, next) => {
    createError(statusCodes.internalError, "An error occurred");
  });

  app.use((err, req, res, next) => {
    res.status(err.status || statusCodes.internalError);
    res.json({
      status_code: err.status || statusCodes.internalError,
      error: err.message,
    });
  });
})();

export default app;
