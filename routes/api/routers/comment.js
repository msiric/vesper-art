import express from "express";
import {
  deleteComment,
  getComment,
  patchComment,
  postComment,
} from "../../../controllers/comment.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router.route("/artwork/:artworkId/comment").post(
  [isAuthenticated, checkParamsId],
  handler(postComment, true, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/artwork/:artworkId/comment/:commentId").patch(
  [isAuthenticated, checkParamsId],
  handler(patchComment, false, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router
  .route("/artwork/:artworkId/comment/:commentId")
  .get(
    [isAuthenticated, checkParamsId],
    handler(getComment, true, (req, res, next) => ({
      ...req.params,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteComment, true, (req, res, next) => ({
      ...req.params,
    }))
  );

export default router;
