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
  handler(postComment, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/artwork/:artworkId/comment/:commentId").patch(
  [isAuthenticated, checkParamsId],
  handler(patchComment, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router
  .route("/artwork/:artworkId/comment/:commentId")
  .get(
    [isAuthenticated, checkParamsId],
    handler(getComment, (req, res, next) => ({
      ...req.params,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteComment, (req, res, next) => ({
      ...req.params,
    }))
  );

export default router;
