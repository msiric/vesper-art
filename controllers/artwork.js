import createError from "http-errors";
import requestIp from "request-ip";
import {
  formatArtworkValues,
  isArrayEmpty,
  isFormAltered,
  isObjectEmpty,
} from "../common/helpers";
import { artworkValidation, commentValidation } from "../common/validation";
import { deleteS3Object, getSignedS3Object } from "../lib/s3";
import socketApi from "../lib/socket";
import {
  addNewArtwork,
  addNewComment,
  addNewCover,
  addNewFavorite,
  addNewLike,
  addNewMedia,
  addNewVersion,
  addNewView,
  deactivateArtworkVersion,
  deactivateExistingArtwork,
  editExistingComment,
  fetchActiveArtworks,
  fetchAllUserArtwork,
  fetchArtworkById,
  fetchArtworkComments,
  fetchArtworkDetails,
  fetchArtworkEdit,
  fetchArtworkId,
  fetchArtworkMedia,
  fetchCommentByOwner,
  fetchCommentByParent,
  fetchFavoriteByParents,
  fetchFavoritesCount,
  fetchLikeByParents,
  fetchUserArtwork,
  fetchUserFavorites,
  fetchUserPurchasesWithMedia,
  fetchUserUploadsWithMedia,
  fetchUserView,
  removeArtworkVersion,
  removeExistingComment,
  removeExistingFavorite,
  removeExistingLike,
  removeExistingLikes,
  updateArtworkVersion,
} from "../services/artwork";
import { addNewNotification } from "../services/notification";
import { fetchOrderByVersion, fetchOrdersByArtwork } from "../services/order";
import { fetchStripeAccount } from "../services/stripe";
import {
  fetchUserById,
  fetchUserByUsername,
  fetchUserIdByUsername,
} from "../services/user";
import { USER_SELECTION } from "../utils/database";
import {
  ARTWORK_KEYS,
  formatError,
  formatResponse,
  generateUuids,
  verifyVersionValidity,
} from "../utils/helpers";
import { formatArtworkPrices } from "../utils/payment";
import { errors, responses } from "../utils/statuses";
import { finalizeMediaUpload } from "../utils/upload";

export const getArtwork = async ({ cursor, limit, connection }) => {
  const foundArtwork = await fetchActiveArtworks({
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getArtworkDetails = async ({ artworkId, connection }) => {
  const foundArtwork = await fetchArtworkDetails({
    artworkId,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) return { artwork: foundArtwork };
  throw createError(...formatError(errors.artworkNotFound));
};

export const getArtworkEdit = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await fetchArtworkEdit({
    userId,
    artworkId,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) return { artwork: foundArtwork };
  throw createError(...formatError(errors.artworkNotFound));
};

export const countArtworkView = async ({
  userId,
  artworkId,
  request,
  connection,
}) => {
  const ipAddress = requestIp.getClientIp(request);
  const [foundArtworkId, foundView] = await Promise.all([
    fetchArtworkId({ artworkId, connection }),
    fetchUserView({ userId, ipAddress, artworkId, connection }),
  ]);
  if (foundArtworkId) {
    if (isObjectEmpty(foundView)) {
      await addNewView({
        userId,
        artworkId: foundArtworkId,
        ipAddress,
        connection,
      });
    }
    return formatResponse(responses.viewTracked);
  }
};

export const getArtworkComments = async ({
  artworkId,
  cursor,
  limit,
  connection,
}) => {
  const foundComments = await fetchArtworkComments({
    artworkId,
    cursor,
    limit,
    connection,
  });
  return { comments: foundComments };
};

export const postNewArtwork = async ({
  userId,
  artworkPath,
  artworkFilename,
  artworkMimetype,
  artworkData,
  connection,
}) => {
  // $TODO Validate data passed to upload
  const artworkUpload = await finalizeMediaUpload({
    filePath: artworkPath,
    fileName: artworkFilename,
    mimeType: artworkMimetype,
    fileType: "artwork",
  });
  if (
    artworkUpload.fileCover &&
    artworkUpload.fileMedia &&
    artworkUpload.fileHeight &&
    artworkUpload.fileWidth &&
    artworkUpload.fileDominant &&
    artworkUpload.fileOrientation
  ) {
    const alteredData = formatArtworkValues(artworkData);
    await artworkValidation.validate(alteredData);
    const formattedData = formatArtworkPrices(alteredData);
    const foundUser = await fetchUserById({
      userId,
      selection: [...USER_SELECTION["STRIPE_INFO"]()],
      connection,
    });
    if (!isObjectEmpty(foundUser)) {
      const foundAccount = foundUser.stripeId
        ? await fetchStripeAccount({
            accountId: foundUser.stripeId,
          })
        : null;
      verifyVersionValidity({ data: formattedData, foundUser, foundAccount });
      const { coverId, mediaId, versionId, artworkId } = generateUuids({
        coverId: null,
        mediaId: null,
        versionId: null,
        artworkId: null,
      });
      await addNewCover({
        coverId,
        artworkUpload,
        connection,
      });
      await addNewMedia({
        mediaId,
        artworkUpload,
        connection,
      });
      await addNewVersion({
        versionId,
        artworkId,
        coverId,
        mediaId,
        userId,
        prevArtwork: { cover: null, media: null, artwork: null },
        artworkData: formattedData,
        connection,
      });
      await addNewArtwork({
        artworkId,
        versionId,
        userId,
        artworkVisibility: formattedData.artworkVisibility,
        connection,
      });
      return formatResponse(responses.artworkCreated);
    }
    throw createError(...formatError(errors.userNotFound));
  }
  throw createError(...formatError(errors.artworkMediaMissing));
};

export const updateArtwork = async ({
  userId,
  artworkId,
  artworkData,
  connection,
}) => {
  // $TODO Validate data passed to upload
  /*   const artworkUpload = await finalizeMediaUpload({
    filePath: artworkPath,
    fileName: artworkFilename,
    mimeType: artworkMimetype,
    fileType: "artwork",
  }); */
  const alteredData = formatArtworkValues(artworkData);
  await artworkValidation.validate(alteredData);
  const formattedData = formatArtworkPrices(alteredData);
  const foundArtwork = await fetchArtworkMedia({
    artworkId,
    userId,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) {
    const shouldUpdate = isFormAltered(
      { ...formattedData, artworkVisibility: null },
      { ...foundArtwork.current, visibility: null },
      ARTWORK_KEYS
    );
    const visibilityChanged =
      formattedData.artworkVisibility !== foundArtwork.visibility;
    if (shouldUpdate || visibilityChanged) {
      const foundUser = await fetchUserById({
        userId,
        selection: [...USER_SELECTION["STRIPE_INFO"]()],
        connection,
      });
      if (!isObjectEmpty(foundUser)) {
        const foundAccount = foundUser.stripeId
          ? await fetchStripeAccount({
              accountId: foundUser.stripeId,
            })
          : null;
        verifyVersionValidity({ data: formattedData, foundUser, foundAccount });
        if (shouldUpdate) {
          const { coverId, mediaId, versionId } = generateUuids({
            coverId: null,
            mediaId: null,
            versionId: null,
          });
          const savedVersion = await addNewVersion({
            versionId,
            coverId: foundArtwork.current.cover.id,
            mediaId: foundArtwork.current.media.id,
            artworkId,
            prevArtwork: foundArtwork.current,
            artworkData: formattedData,
            connection,
          });
          const foundOrder = await fetchOrderByVersion({
            artworkId: foundArtwork.id,
            versionId: foundArtwork.current.id,
            connection,
          });
          const oldVersion = foundArtwork.current;
          const savedArtwork = await updateArtworkVersion({
            artworkId: foundArtwork.id,
            currentId: versionId,
            artworkVisibility: formattedData.artworkVisibility,
            connection,
          });
          if (!foundOrder) {
            /*         if (formattedData.artworkCover && formattedData.artworkMedia) {
          await deleteS3Object({
            fileLink: oldVersion.cover.source,
            folderName: "artworkCovers/",
          });
  
          await deleteS3Object({
            fileLink: oldVersion.media.source,
            folderName: "artworkMedia/",
          });
        } */
            await removeArtworkVersion({
              versionId: oldVersion.id,
              connection,
            });
          }
        } else if (visibilityChanged) {
          const savedArtwork = await updateArtworkVersion({
            artworkId: foundArtwork.id,
            currentId: foundArtwork.current.id,
            artworkVisibility: formattedData.artworkVisibility,
            connection,
          });
        }
        return formatResponse(responses.artworkUpdated);
      }
      throw createError(...formatError(errors.userNotFound));
    }
    throw createError(...formatError(errors.artworkDetailsIdentical));
  }
  throw createError(...formatError(errors.artworkNotFound));
};

export const deleteArtwork = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await fetchArtworkMedia({
    artworkId,
    userId,
    connection,
  });
  if (foundArtwork) {
    const foundOrders = await fetchOrdersByArtwork({
      userId,
      artworkId: foundArtwork.id,
      connection,
    });
    if (isArrayEmpty(foundOrders)) {
      const oldVersion = foundArtwork.current;
      await deactivateArtworkVersion({ artworkId, connection });
      await deleteS3Object({
        fileLink: oldVersion.cover.source,
        folderName: "artworkCovers/",
      });
      await deleteS3Object({
        fileLink: oldVersion.media.source,
        folderName: "artworkMedia/",
      });
      await removeArtworkVersion({
        versionId: oldVersion.id,
        connection,
      });
    } else if (
      foundOrders.some((item) => item.versionId === foundArtwork.current.id)
    ) {
      await deactivateExistingArtwork({ artworkId, connection });
    } else {
      const oldVersion = foundArtwork.current;
      await deactivateArtworkVersion({ artworkId, connection });
      await removeArtworkVersion({
        versionId: oldVersion.id,
        connection,
      });
    }
    return formatResponse(responses.artworkDeleted);
  }
  throw createError(...formatError(errors.artworkNotFound));
};

export const fetchArtworkFavorites = async ({ artworkId, connection }) => {
  const foundFavorites = await fetchFavoritesCount({
    artworkId,
    connection,
  });
  return { favorites: foundFavorites };
};

export const favoriteArtwork = async ({ userId, artworkId, connection }) => {
  const [foundFavorite, foundArtwork] = await Promise.all([
    fetchFavoriteByParents({
      userId,
      artworkId,
      connection,
    }),
    fetchArtworkById({ artworkId, connection }),
  ]);
  if (!isObjectEmpty(foundArtwork)) {
    if (foundArtwork.ownerId !== userId) {
      if (isObjectEmpty(foundFavorite)) {
        const { favoriteId } = generateUuids({
          favoriteId: null,
        });
        await addNewFavorite({
          favoriteId,
          userId,
          artworkId,
          connection,
        });
        return formatResponse(responses.artworkFavorited);
      }
      throw createError(...formatError(errors.artworkAlreadyFavorited));
    }
    throw createError(...formatError(errors.artworkFavoritedByOwner));
  }
  throw createError(...formatError(errors.artworkNotFound));
};

export const unfavoriteArtwork = async ({ userId, artworkId, connection }) => {
  const [foundFavorite, foundArtwork] = await Promise.all([
    fetchFavoriteByParents({
      userId,
      artworkId,
      connection,
    }),
    fetchArtworkById({ artworkId, connection }),
  ]);
  if (!isObjectEmpty(foundArtwork)) {
    if (foundArtwork.ownerId !== userId) {
      if (!isObjectEmpty(foundFavorite)) {
        await removeExistingFavorite({
          favoriteId: foundFavorite.id,
          connection,
        });
        return formatResponse(responses.artworkUnfavorited);
      }
      throw createError(...formatError(errors.artworkAlreadyUnfavorited));
    }
    throw createError(...formatError(errors.artworkUnfavoritedByOwner));
  }
  throw createError(...formatError(errors.artworkNotFound));
};

export const likeComment = async ({
  userId,
  artworkId,
  commentId,
  connection,
}) => {
  const [foundLike, foundComment] = await Promise.all([
    fetchLikeByParents({
      userId,
      commentId,
      connection,
    }),
    fetchCommentByParent({ artworkId, commentId, connection }),
  ]);
  if (!isObjectEmpty(foundComment)) {
    if (foundComment.owner.id !== userId) {
      if (isObjectEmpty(foundLike)) {
        const { likeId } = generateUuids({
          likeId: null,
        });
        await addNewLike({
          likeId,
          userId,
          commentId,
          connection,
        });
        return formatResponse(responses.commentLiked);
      }
      throw createError(...formatError(errors.commentAlreadyLiked));
    }
    throw createError(...formatError(errors.commentLikedByOwner));
  }
  throw createError(...formatError(errors.commentNotFound));
};

export const dislikeComment = async ({
  userId,
  artworkId,
  commentId,
  connection,
}) => {
  const [foundLike, foundComment] = await Promise.all([
    fetchLikeByParents({
      userId,
      commentId,
      connection,
    }),
    fetchCommentByParent({ artworkId, commentId, connection }),
  ]);
  if (!isObjectEmpty(foundComment)) {
    if (foundComment.owner.id !== userId) {
      if (!isObjectEmpty(foundLike)) {
        await removeExistingLike({
          likeId: foundLike.id,
          connection,
        });
        return formatResponse(responses.commentDisliked);
      }
      throw createError(...formatError(errors.commentAlreadyDisliked));
    }
    throw createError(...formatError(errors.commentDislikedByOwner));
  }
  throw createError(...formatError(errors.commentNotFound));
};

export const getUserArtworkByUsername = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  if (foundId) {
    const foundArtwork = await fetchUserArtwork({
      userId: foundId,
      cursor,
      limit,
      connection,
    });
    return { artwork: foundArtwork };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getUserArtworkById = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundArtwork = await fetchAllUserArtwork({
    userId,
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getUserUploads = async ({ userId, cursor, limit, connection }) => {
  const foundArtwork = await fetchUserUploadsWithMedia({
    userId,
    cursor,
    limit,
    connection,
  });
  const formattedUploads = await Promise.all(
    foundArtwork.map(async (upload) => {
      const { url, file } = await getSignedS3Object({
        fileLink: upload.current.media.source,
        folderName: "artworkMedia/",
      });
      return {
        ...upload,
        current: {
          ...upload.current,
          media: { ...upload.current.media, source: url },
        },
      };
    })
  );
  return { artwork: formattedUploads };
};

export const getUserOwnership = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundPurchases = await fetchUserPurchasesWithMedia({
    userId,
    cursor,
    limit,
    connection,
  });
  const formattedPurchases = await Promise.all(
    foundPurchases.map(async (purchase) => {
      const { url, file } = await getSignedS3Object({
        fileLink: purchase.version.media.source,
        folderName: "artworkMedia/",
      });
      return {
        ...purchase,
        version: {
          ...purchase.version,
          media: { ...purchase.version.media, source: url },
        },
      };
    })
  );
  return { purchases: formattedPurchases };
};

export const getUserFavorites = async ({
  userId,
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundUser = await fetchUserByUsername({
    userUsername,
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    if (foundUser.displayFavorites || userId === foundUser.id) {
      const foundFavorites = await fetchUserFavorites({
        userId: foundUser.id,
        cursor,
        limit,
        connection,
      });
      return { favorites: foundFavorites };
    }
    throw createError(...formatError(errors.userFavoritesNotAllowed));
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getComment = async ({ artworkId, commentId, connection }) => {
  const foundComment = await fetchCommentByParent({
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
        // $TODO Maybe this can be done better
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
  commentId,
  commentContent,
  connection,
}) => {
  await commentValidation.validate({ commentContent });
  const updatedComment = await editExistingComment({
    commentId,
    userId,
    commentContent,
    connection,
  });
  if (updatedComment.affected !== 0) {
    return formatResponse(responses.commentUpdated);
  }
  throw createError(...formatError(errors.commentNotFound));
};

export const deleteComment = async ({ userId, commentId, connection }) => {
  const foundComment = await fetchCommentByOwner({
    commentId,
    userId,
    connection,
  });
  if (!isObjectEmpty(foundComment)) {
    await removeExistingLikes({
      commentId,
      connection,
    });
    await removeExistingComment({
      commentId,
      userId,
      connection,
    });
    return formatResponse(responses.commentDeleted);
  }
  throw createError(...formatError(errors.commentNotFound));
};
