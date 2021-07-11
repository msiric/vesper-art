import createError from "http-errors";
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
  if (foundArtwork) {
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
  if (foundArtwork) {
    await editExistingComment({
      commentId,
      artworkId,
      userId,
      commentContent,
      connection,
    });
    return formatResponse(responses.commentUpdated);
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
  if (foundArtwork) {
    await removeExistingComment({
      commentId,
      artworkId,
      userId,
      connection,
    });
    return formatResponse(responses.commentDeleted);
  }
  throw createError(...formatError(errors.artworkNotFound));
};
