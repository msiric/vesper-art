import createError from "http-errors";
import socketApi from "../lib/socket.js";
import {
  addArtworkComment,
  fetchArtworkById,
} from "../services/postgres/artwork.js";
import {
  addNewComment,
  editExistingComment,
  fetchCommentById,
  removeExistingComment,
} from "../services/postgres/comment.js";
import { addNewNotification } from "../services/postgres/notification.js";
import {
  addUserComment,
  addUserNotification,
} from "../services/postgres/user.js";
import { sanitizeData } from "../utils/helpers.js";
import commentValidator from "../validation/comment.js";

export const getComment = async ({ artworkId, commentId, session }) => {
  const foundComment = await fetchCommentById({
    artworkId,
    commentId,
    session,
  });
  return { comment: foundComment };
};

export const postComment = async ({ userId, artworkId, commentContent }) => {
  const { error } = commentValidator(sanitizeData({ commentContent }));
  if (error) throw createError(400, error);
  const foundArtwork = await fetchArtworkById({ artworkId });
  if (!foundArtwork) {
    throw createError(400, "Artwork not found");
  } else {
    const savedComment = await addNewComment({
      artworkId,
      userId,
      commentContent,
    });
    await addArtworkComment({
      artworkId,
      savedComment,
    });
    const updatedUser = await addUserComment({
      userId,
      savedComment,
    });
    if (!savedComment.owner === updatedUser.id) {
      await addUserNotification({ userId: updatedUser.id });
      const savedNotification = await addNewNotification({
        notificationLink: foundArtwork.id,
        notificationRef: savedComment.id,
        notificationType: "comment",
        notificationReceiver: updatedUser.id,
      });
      socketApi.sendNotification(updatedUser.id, savedNotification);
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
  session,
}) => {
  const { error } = commentValidator(sanitizeData({ commentContent }));
  if (error) throw createError(400, error);
  await editExistingComment({
    commentId,
    artworkId,
    userId,
    commentContent,
    session,
  });
  return { message: "Comment updated successfully" };
};

export const deleteComment = async ({ userId, artworkId, commentId }) => {
  await removeExistingComment({
    commentId,
    artworkId,
    userId,
  });
  return { message: "Comment deleted successfully" };
};
