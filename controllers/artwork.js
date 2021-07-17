import createError from "http-errors";
import {
  formatArtworkValues,
  isArrayEmpty,
  isFormAltered,
  isObjectEmpty,
  verifyVersionValidity,
} from "../common/helpers";
import { artworkValidation } from "../common/validation";
import { deleteS3Object } from "../lib/s3";
import {
  addNewArtwork,
  addNewCover,
  addNewFavorite,
  addNewMedia,
  addNewVersion,
  deactivateArtworkVersion,
  deactivateExistingArtwork,
  fetchActiveArtworks,
  fetchArtworkById,
  fetchArtworkByOwner,
  fetchArtworkComments,
  fetchArtworkDetails,
  fetchArtworkEdit,
  fetchArtworkMedia,
  fetchFavoriteByParents,
  fetchFavoritesCount,
  removeArtworkVersion,
  removeExistingFavorite,
  updateArtworkVersion,
} from "../services/postgres/artwork";
import {
  fetchOrderByVersion,
  fetchOrdersByArtwork,
} from "../services/postgres/order";
import { fetchStripeAccount } from "../services/postgres/stripe";
import { fetchUserById } from "../services/postgres/user";
import {
  formatArtworkPrices,
  formatError,
  formatResponse,
  formattedClientKeys,
  generateUuids,
} from "../utils/helpers";
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

// $TODO how to handle limiting comments?
export const getArtworkDetails = async ({
  artworkId,
  cursor,
  limit,
  connection,
}) => {
  const foundArtwork = await fetchArtworkDetails({
    artworkId,
    cursor,
    limit,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) return { artwork: foundArtwork };
  throw createError(...formatError(errors.artworkNotFound));
};

export const getArtworkEdit = async ({ artworkId, connection }) => {
  const foundArtwork = await fetchArtworkEdit({
    artworkId,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) return { artwork: foundArtwork };
  throw createError(...formatError(errors.artworkNotFound));
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

export const editArtwork = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) return { artwork: foundArtwork };
  throw createError(...formatError(errors.artworkNotFound));
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

// $TODO
// does it work in all cases?
// needs testing
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
      formattedData,
      { ...foundArtwork.current, visibility: foundArtwork.visibility },
      formattedClientKeys.artwork
    );
    if (shouldUpdate) {
      const foundUser = await fetchUserById({
        userId,
        connection,
      });
      if (!isObjectEmpty(foundUser)) {
        const foundAccount = foundUser.stripeId
          ? await fetchStripeAccount({
              accountId: foundUser.stripeId,
            })
          : null;
        verifyVersionValidity({ data: formattedData, foundUser, foundAccount });
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
        return formatResponse(responses.artworkUpdated);
      }
      throw createError(...formatError(errors.userNotFound));
    }
    throw createError(...formatError(errors.artworkDetailsIdentical));
  }
  throw createError(...formatError(errors.artworkNotFound));
};

// $TODO
// does it work in all cases?
// needs testing
export const deleteArtwork = async ({
  userId,
  artworkId,
  data,
  connection,
}) => {
  const foundArtwork = await fetchArtworkMedia({
    artworkId,
    userId,
    connection,
  });
  if (foundArtwork) {
    // $TODO Check that artwork wasn't updated in the meantime (current === version)
    if (true) {
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
        foundOrders.find((item) => item.versionId === foundArtwork.current.id)
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
    throw createError(...formatError(errors.artworkVersionObsolete));
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

// needs transaction (done)
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
    if (foundArtwork.owner.id !== userId) {
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
    if (foundArtwork.owner.id !== userId) {
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

// needs transaction (done)
// $TODO validacija licenci?

// Not used?
// export const saveLicense = async ({
//   userId,
//   artworkId,
//   license,
//   connection,
// }) => {
//   const foundArtwork = await fetchArtworkDetails({ artworkId, connection });
//   if (foundArtwork) {
//     const { licenseId } = generateUuids({
//       licenseId: null,
//     });
//     const savedLicense = await addNewLicense({
//       licenseId,
//       artworkId: foundArtwork.ic,
//       licenseData: license,
//       userId,
//       connection,
//     });
//     return { message: "License saved", license: license };
//   }
//   throw createError(400, "Artwork not found");
// };
