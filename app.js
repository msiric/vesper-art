import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { global } from "./common/constants";
import { mongo, postgres } from "./config/secret.js";
import api from "./routes/api/index.js";
import stripe from "./routes/stripe/index.js";
import { validateParams } from "./utils/helpers.js";

const app = express();
const dirname = path.resolve();
const root = path.dirname(require.main.filename);

app.use(
  cors({
    origin: global.clientDomain,
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

(async () => {
  try {
    await createConnection({
      type: "postgres",
      url: postgres.database,
      logging: true,
      synchronize: true,
      migrations: [path.join(__dirname, "./migrations/*")],
      entities: [path.join(__dirname, "./entities/*")],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.log(err);
  }
})();

app.use(compression());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": [
        "'self'",
        `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/`,
      ],
    },
  })
);

// app.use(rateLimiter);

app.use("/api", validateParams, api);
app.use("/stripe", validateParams, stripe);

app.use(express.static(path.join(root, "../../client/build")));
app.use(express.static(path.join(root, "../../public")));

app.use((req, res, next) => {
  res.sendFile(path.join(root, "../../client/build", "index.html"));
});

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

export default app;
