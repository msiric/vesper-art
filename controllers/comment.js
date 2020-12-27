import createError from "http-errors";
import socketApi from "../lib/socket.js";
import {
  addArtworkComment,
  fetchArtworkById,
  removeArtworkComment,
} from "../services/mongo/artwork.js";
import {
  addNewComment,
  editExistingComment,
  fetchCommentById,
  removeExistingComment,
} from "../services/mongo/comment.js";
import { addNewNotification } from "../services/mongo/notification.js";
import { addUserNotification } from "../services/mongo/user.js";
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

export const postComment = async ({
  userId,
  artworkId,
  commentContent,
  session,
}) => {
  const { error } = commentValidator(sanitizeData({ commentContent }));
  if (error) throw createError(400, error);
  const foundArtwork = await fetchArtworkById({ artworkId, session });
  if (!foundArtwork) {
    throw createError(400, "Artwork not found");
  } else {
    const savedComment = await addNewComment({
      artworkId,
      userId,
      commentContent,
      session,
    });
    const updatedArtwork = await addArtworkComment({
      artworkId,
      commentId: savedComment.id,
      session,
    });
    if (!savedComment.owner.equals(updatedArtwork.owner)) {
      await addUserNotification({ userId: updatedArtwork.owner, session });
      const savedNotification = await addNewNotification({
        notificationLink: foundArtwork.id,
        notificationRef: savedComment.id,
        notificationType: "comment",
        notificationReceiver: updatedArtwork.owner,
        session,
      });
      socketApi.sendNotification(updatedArtwork.owner, savedNotification);
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

export const deleteComment = async ({
  userId,
  artworkId,
  commentId,
  session,
}) => {
  await removeArtworkComment({ artworkId, commentId, session });
  await removeExistingComment({
    commentId,
    artworkId,
    userId,
    session,
  });
  return { message: "Comment deleted successfully" };
};
