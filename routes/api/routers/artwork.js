import express from "express";
import {
  countArtworkView,
  deleteArtwork,
  deleteComment,
  dislikeComment,
  favoriteArtwork,
  fetchArtworkFavorites,
  getArtwork,
  getArtworkComments,
  getArtworkDetails,
  getArtworkEdit,
  getComment,
  getUserArtworkById,
  getUserArtworkByUsername,
  getUserFavorites,
  getUserOwnership,
  getUserUploads,
  likeComment,
  patchComment,
  postComment,
  postNewArtwork,
  unfavoriteArtwork,
  updateArtwork,
} from "../../../controllers/artwork";
import multerApi from "../../../lib/multer";
import {
  isAuthenticated,
  isAuthenticatedNoFail,
  isAuthorized,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

// Public routes
router.route("/artwork").get(
  handler(getArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

router.route("/artwork/:artworkId").get(
  handler(getArtworkDetails, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
  }))
);

router.route("/artwork/:artworkId/analytics").post(
  [isAuthenticatedNoFail],
  handler(countArtworkView, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    request: req,
  }))
);

router.route("/artwork/:artworkId/comments").get(
  handler(getArtworkComments, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

router.route("/artwork/:artworkId/comments/:commentId").get(
  handler(getComment, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    commentId: req.params.commentId,
  }))
);

router.route("/artwork/:artworkId/favorites").get(
  handler(fetchArtworkFavorites, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
  }))
);

// Authenticated routes
router.route("/artwork").post(
  [isAuthenticated, multerApi.uploadArtworkLocal],
  handler(postNewArtwork, true, (req, res, next) => ({
    artworkPath: req.file ? req.file.path : "",
    artworkFilename: req.file ? req.file.filename : "",
    artworkMimetype: req.file ? req.file.mimetype : "",
    artworkData: { ...req.body },
  }))
);

router.route("/artwork/:artworkId/comments").post(
  [isAuthenticated],
  handler(postComment, true, (req, res, next) => ({
    artworkId: req.params.artworkId,
    commentContent: req.body.commentContent,
  }))
);

router
  .route("/artwork/:artworkId/favorites")
  .post(
    [isAuthenticated],
    handler(favoriteArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .delete(
    [isAuthenticated],
    handler(unfavoriteArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  );

router
  .route("/artwork/:artworkId/comments/:commentId/likes")
  .post(
    [isAuthenticated],
    handler(likeComment, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      commentId: req.params.commentId,
    }))
  )
  .delete(
    [isAuthenticated],
    handler(dislikeComment, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      commentId: req.params.commentId,
    }))
  );

// Authorized routes
router
  .route("/users/:userId/comments/:commentId")
  // TODO_ Add auth
  .patch(
    [isAuthenticated, isAuthorized],
    handler(patchComment, true, (req, res, next) => ({
      userId: req.params.userId,
      commentId: req.params.commentId,
      commentContent: req.body.commentContent,
    }))
  )
  // TODO_ Add auth
  .delete(
    [isAuthenticated, isAuthorized],
    handler(deleteComment, true, (req, res, next) => ({
      userId: req.params.userId,
      commentId: req.params.commentId,
    }))
  );

router
  .route("/users/:userId/artwork/:artworkId")
  .get(
    [isAuthenticated, isAuthorized],
    handler(getArtworkEdit, false, (req, res, next) => ({
      userId: req.params.userId,
      artworkId: req.params.artworkId,
    }))
  )
  // OLD ROUTE WITH MEDIA UPLOAD INCLUDED
  /*   .patch(
    [isAuthenticated, multerApi.uploadArtworkLocal],
    handler(updateArtwork, true, (req, res, next) => ({
      ...req.params,
      artworkPath: req.file ? req.file.path : "",
      artworkFilename: req.file ? req.file.filename : "",
      artworkMimetype: req.file ? req.file.mimetype : "",
      artworkData: { ...req.body },
    }))
  ) */
  // TODO_ Add auth
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateArtwork, true, (req, res, next) => ({
      userId: req.params.userId,
      artworkId: req.params.artworkId,
      artworkData: { ...req.body },
    }))
  )
  // TODO_ Add auth
  .delete(
    [isAuthenticated, isAuthorized],
    handler(deleteArtwork, true, (req, res, next) => ({
      userId: req.params.userId,
      artworkId: req.params.artworkId,
    }))
  );

router.route("/users/:userUsername/artwork").get(
  handler(getUserArtworkByUsername, false, (req, res, next) => ({
    userUsername: req.params.userUsername,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

router.route("/users/:userUsername/favorites").get(
  [isAuthenticatedNoFail],
  handler(getUserFavorites, false, (req, res, next) => ({
    userUsername: req.params.userUsername,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

router.route("/users/:userId/my_artwork").get(
  [isAuthenticated, isAuthorized],
  handler(getUserArtworkById, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);
router.route("/users/:userId/uploads").get(
  [isAuthenticated, isAuthorized],
  handler(getUserUploads, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);
router.route("/users/:userId/ownership").get(
  [isAuthenticated, isAuthorized],
  handler(getUserOwnership, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

export default router;
