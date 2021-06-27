import createError from "http-errors";
import { errors } from "../common/constants";
import { commentValidation } from "../common/validation";
import socketApi from "../lib/socket.js";
import { fetchArtworkById } from "../services/postgres/artwork.js";
import {
  addNewComment,
  editExistingComment,
  fetchCommentById,
  removeExistingComment,
} from "../services/postgres/comment.js";
import { addNewNotification } from "../services/postgres/notification.js";
import { generateUuids } from "../utils/helpers.js";

export const getComment = async ({ artworkId, commentId, connection }) => {
  const foundComment = await fetchCommentById({
    artworkId,
    commentId,
    connection,
  });
  return { comment: foundComment };
};

// SNACKBAR $TODO Add expose to response
export const postComment = async ({
  userId,
  artworkId,
  commentContent,
  connection,
}) => {
  await commentValidation.validate({ commentContent });
  const foundArtwork = await fetchArtworkById({ artworkId, connection });
  if (!foundArtwork) {
    throw createError(errors.notFound, "Artwork not found", { expose: true });
  } else {
    const { commentId, notificationId } = generateUuids({
      commentId: null,
      notificationId: null,
    });
    const savedComment = await addNewComment({
      commentId,
      artworkId,
      userId,
      commentContent,
      connection,
    });
    if (userId !== foundArtwork.owner.id) {
      const savedNotification = await addNewNotification({
        notificationId,
        notificationLink: foundArtwork.id,
        notificationRef: commentId,
        notificationType: "comment",
        notificationReceiver: foundArtwork.owner.id,
        connection,
      });
      socketApi.sendNotification(
        foundArtwork.owner.id,
        // $TODO maybe this can be done better
        savedNotification.raw[0]
      );
    }
    return {
      message: "Comment posted successfully",
      payload: savedComment.raw[0],
    };
  }
};

// SNACKBAR $TODO Add expose to response
export const patchComment = async ({
  userId,
  artworkId,
  commentId,
  commentContent,
  connection,
}) => {
  await commentValidation.validate({ commentContent });
  await editExistingComment({
    commentId,
    artworkId,
    userId,
    commentContent,
    connection,
  });
  return { message: "Comment updated successfully" };
};

// SNACKBAR $TODO Add expose to response
export const deleteComment = async ({
  userId,
  artworkId,
  commentId,
  connection,
}) => {
  await removeExistingComment({
    commentId,
    artworkId,
    userId,
    connection,
  });
  return { message: "Comment deleted successfully" };
};
