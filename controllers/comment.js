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

export const getComment = async ({ artworkId, commentId, session }) => {
  const foundComment = await fetchCommentById({
    artworkId,
    commentId,
    session,
  });
  return { comment: foundComment };
};

export const postComment = async ({ userId, artworkId, commentContent }) => {
  const { error } = await commentValidation.validate(
    sanitizeData({ commentContent })
  );
  if (error) throw createError(400, error);
  const foundArtwork = await fetchArtworkById({ artworkId });
  if (!foundArtwork) {
    throw createError(400, "Artwork not found");
  } else {
    const { commentId } = generateUuids({
      commentId: null,
    });
    const savedComment = await addNewComment({
      commentId,
      artworkId,
      userId,
      commentContent,
    });
    if (!savedComment.owner === foundArtwork.owner.id) {
      const { notificationId } = generateUuids({
        notificationId: null,
      });
      const savedNotification = await addNewNotification({
        notificationId,
        notificationLink: foundArtwork.id,
        notificationRef: savedComment.id,
        notificationType: "comment",
        notificationReceiver: foundArtwork.owner.id,
      });
      socketApi.sendNotification(foundArtwork.owner.id, savedNotification);
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
  const { error } = await commentValidation.validate(
    sanitizeData({ commentContent })
  );
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
