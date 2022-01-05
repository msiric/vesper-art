import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import { commentValidation } from "../common/validation";
import socketApi from "../lib/socket";
import { fetchArtworkById } from "../services/postgres/artwork";
import {
  addNewComment,
  editExistingComment,
  fetchCommentById,
  removeExistingComment,
} from "../services/postgres/comment";
import { addNewNotification } from "../services/postgres/notification";
import { formatError, formatResponse, generateUuids } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

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
  await commentValidation.validate({ commentContent });
  const foundArtwork = await fetchArtworkById({ artworkId, connection });
  if (!isObjectEmpty(foundArtwork)) {
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
    if (userId !== foundArtwork.ownerId) {
      const savedNotification = await addNewNotification({
        notificationId,
        notificationLink: foundArtwork.id,
        notificationRef: commentId,
        notificationType: "comment",
        notificationReceiver: foundArtwork.ownerId,
        connection,
      });
      socketApi.sendNotification(
        foundArtwork.ownerId,
        // $TODO maybe this can be done better
        savedNotification.raw[0]
      );
    }
    return formatResponse({
      ...responses.commentCreated,
      payload: savedComment.raw[0],
    });
  }
  throw createError(...formatError(errors.artworkNotFound));
};

export const patchComment = async ({
  userId,
  artworkId,
  commentId,
  commentContent,
  connection,
}) => {
  await commentValidation.validate({ commentContent });
  const foundArtwork = await fetchArtworkById({ artworkId, connection });
  if (!isObjectEmpty(foundArtwork)) {
    const updatedComment = await editExistingComment({
      commentId,
      artworkId,
      userId,
      commentContent,
      connection,
    });
    if (updatedComment.affected !== 0) {
      return formatResponse(responses.commentUpdated);
    }
    throw createError(...formatError(errors.commentNotFound));
  }
  throw createError(...formatError(errors.artworkNotFound));
};

export const deleteComment = async ({
  userId,
  artworkId,
  commentId,
  connection,
}) => {
  const foundArtwork = await fetchArtworkById({ artworkId, connection });
  if (!isObjectEmpty(foundArtwork)) {
    const deletedComment = await removeExistingComment({
      commentId,
      artworkId,
      userId,
      connection,
    });
    if (deletedComment.affected !== 0) {
      return formatResponse(responses.commentDeleted);
    }
    throw createError(...formatError(errors.commentNotFound));
  }
  throw createError(...formatError(errors.artworkNotFound));
};
