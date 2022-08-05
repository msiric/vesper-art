import express from "express";
import { getResults } from "../../../controllers/search";
import { requestHandler as handler } from "../../../middleware/index";

const router = express.Router();

router.route("/search").get(
  handler(getResults, false, (req, res, next) => ({
    searchQuery: req.query.q,
    searchType: req.query.t,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

export default router;
