import compression from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";
import isBot from "isbot";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { featureFlags, statusCodes } from "./common/constants";
import { cookie, domain, environment, ENV_OPTIONS } from "./config/secret";
import { authRateLimiter, commonRateLimiter } from "./lib/limiter";
import api from "./routes/api/index";
import auth from "./routes/auth/index";
import bot from "./routes/bot/index";
import stripe from "./routes/stripe/index";
import hooks from "./routes/webhooks/index";
import { connectToDatabase } from "./utils/database";
import { handleDelegatedError } from "./utils/helpers";

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
    express.json({
      verify: (req, res, buf) => {
        if (req.originalUrl.startsWith("/webhook"))
          req.rawBody = buf.toString();
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
      secret: cookie.secret,
      keys: [
        "aq`&DOC5'()%I=`hvk9cu^>A0VYg{B",
        "Wx{IR%)Gqf%Skw5Od&?T6v!$l3lOTV",
      ],
    })
  );

  if (environment !== ENV_OPTIONS.TESTING) {
    try {
      await connectToDatabase();
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

  // FEATURE FLAG - stripe
  featureFlags.stripe && app.use("/webhook", hooks);

  app.use(express.json({ type: "application/json" }));

  app.use("/auth", authRateLimiter, auth);
  app.use("/api", commonRateLimiter, api);
  app.use("/bot", commonRateLimiter, bot);
  // FEATURE FLAG - stripe
  featureFlags.stripe && app.use("/stripe", stripe);

  app.use(express.static(path.join(dirname, "client/build")));
  app.use(express.static(path.join(dirname, "public")));

  app.use(async (req, res, next) => {
    try {
      if (isBot(req.get("user-agent"))) {
        req.url = `/bot${req.url}`;
        app.handle(req, res);
      } else {
        res.sendFile(path.join(dirname, "client/build", "index.html"));
      }
    } catch (err) {
      // do nothing
    }
  });

  app.use((req, res, next) => {
    createError(statusCodes.internalError, "An error occurred");
  });

  app.use((err, req, res, next) => {
    const error = handleDelegatedError({ err });
    res.status(error.status);
    res.json({ ...error });
  });
})();

export default app;
