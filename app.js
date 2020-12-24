import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { mongo, postgres } from "./config/secret.js";
import api from "./routes/api/index.js";
import stripe from "./routes/stripe/index.js";
import { rateLimiter } from "./utils/limiter.js";

const app = express();
const dirname = path.resolve();

app.use(compression());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
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
app.use(express.static(path.join(dirname, "public")));

mongoose.connect(
  mongo.database,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) console.log(err);
    console.log("Connected to MongoDB");
  }
);

mongoose.set("useCreateIndex", true);

(async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      url: postgres.database,
      logging: true,
      // synchronize: true,
      migrations: [path.join(__dirname, "./migrations/*")],
      entities: [path.join(__dirname, "./entities/*")],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("Connected to PostgreSQL");
    await connection.synchronize();
  } catch (err) {
    console.log(err);
  }
})();

app.use(rateLimiter);

app.use("/api", api);
app.use("/stripe", stripe);

app.use((req, res, next) => {
  createError(404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

export default app;
