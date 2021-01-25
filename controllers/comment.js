import createError from "http-errors";
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
import { generateUuids, sanitizeData } from "../utils/helpers.js";

export const getComment = async ({ artworkId, commentId, connection }) => {
  const foundComment = await fetchCommentById({
    artworkId,
    commentId,
    connection,
  });
  return { comment: foundComment };
};

export const postComment = async ({
  userId,
  artworkId,
  commentContent,
  connection,
}) => {
  await commentValidation.validate(sanitizeData({ commentContent }));
  const foundArtwork = await fetchArtworkById({ artworkId, connection });
  if (!foundArtwork) {
    throw createError(400, "Artwork not found");
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
      payload: savedComment,
    };
  }
};

export const patchComment = async ({
  userId,
  artworkId,
  commentId,
  commentContent,
  connection,
}) => {
  await commentValidation.validate(sanitizeData({ commentContent }));
  await editExistingComment({
    commentId,
    artworkId,
    userId,
    commentContent,
    connection,
  });
  return { message: "Comment updated successfully" };
};

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
