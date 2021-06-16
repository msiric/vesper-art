import express from "express";
import { getResults } from "../../../controllers/search.js";
import { requestHandler as handler } from "../../../utils/helpers.js";

const router = express.Router();

router.route("/search").get(
  handler(getResults, false, (req, res, next) => ({
    searchQuery: req.query.q,
    searchType: req.query.t,
  }))
);

export default router;
