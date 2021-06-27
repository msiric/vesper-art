import createError from "http-errors";
import { errors } from "../common/constants";
import { isObjectEmpty, isVersionDifferent } from "../common/helpers";
import { artworkValidation } from "../common/validation";
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
  fetchArtworkMedia,
  fetchFavoriteByParents,
  fetchFavoritesCount,
  fetchUserArtworks,
  removeArtworkVersion,
  removeExistingFavorite,
  updateArtworkVersion,
} from "../services/postgres/artwork.js";
import {
  fetchOrderByVersion,
  fetchOrdersByArtwork,
} from "../services/postgres/order.js";
import { fetchStripeAccount } from "../services/postgres/stripe.js";
import { fetchUserById } from "../services/postgres/user.js";
import { formatArtworkValues, generateUuids } from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";

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
  throw createError(errors.notFound, "Artwork not found", { expose: true });
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

// $TODO handle in user controller?
export const getUserArtwork = async ({ userId, cursor, limit, connection }) => {
  const foundArtwork = await fetchUserArtworks({
    userId,
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const editArtwork = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    connection,
  });
  if (!isObjectEmpty(foundArtwork)) return { artwork: foundArtwork };
  throw createError(errors.notFound, "Artwork not found", { expose: true });
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
    const formattedData = formatArtworkValues(artworkData);
    await artworkValidation.validate(formattedData);
    if (formattedData.artworkPersonal || formattedData.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId,
        connection,
      });
      if (!foundUser)
        throw createError(errors.notFound, "User not found", { expose: true });
      if (!foundUser.stripeId)
        throw createError(
          errors.unprocessable,
          "Please complete the Stripe onboarding process before making your artwork commercially available",
          { expose: true }
        );
      const foundAccount = await fetchStripeAccount({
        accountId: foundUser.stripeId,
      });
      if (
        (formattedData.artworkPersonal || formattedData.artworkCommercial) &&
        (foundAccount.capabilities.card_payments !== "active" ||
          foundAccount.capabilities.transfers !== "active")
      ) {
        throw createError(
          errors.unprocessable,
          "Please complete your Stripe account before making your artwork commercially available",
          { expose: true }
        );
      }
    }
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
      connection,
    });
    return { message: "Artwork published successfully", expose: true };
  }
  throw createError(
    errors.badRequest,
    "Please attach artwork media before submitting",
    { expose: true }
  );
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
  const formattedData = formatArtworkValues(artworkData);
  await artworkValidation.validate(formattedData);
  const foundArtwork = await fetchArtworkMedia({
    artworkId,
    userId,
    connection,
  });
  const shouldUpdate = isVersionDifferent(formattedData, foundArtwork.current);
  if (shouldUpdate) {
    if (foundArtwork) {
      if (formattedData.artworkPersonal || formattedData.artworkCommercial) {
        const foundUser = await fetchUserById({
          userId,
          connection,
        });
        if (!foundUser)
          throw createError(errors.notFound, "User not found", {
            expose: true,
          });
        if (!foundUser.stripeId)
          throw createError(
            errors.unprocessable,
            "Please complete the Stripe onboarding process before making your artwork commercially available",
            { expose: true }
          );
        const foundAccount = await fetchStripeAccount({
          accountId: foundUser.stripeId,
        });
        if (
          (formattedData.artworkPersonal || formattedData.artworkCommercial) &&
          (foundAccount.capabilities.card_payments !== "active" ||
            foundAccount.capabilities.transfers !== "active")
        ) {
          throw createError(
            errors.unprocessable,
            "Please complete your Stripe account before making your artwork commercially available",
            { expose: true }
          );
        }
      }
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

      return { message: "Artwork updated successfully", expose: true };
    } else {
      throw createError(errors.notFound, "Artwork not found", { expose: true });
    }
  } else {
    throw createError(
      errors.badRequest,
      "Artwork is identical to the previous version",
      { expose: true }
    );
  }
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
      if (!foundOrders.length) {
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
      return { message: "Artwork deleted successfully", expose: true };
    }
    throw createError(errors.badRequest, "Artwork has a newer version", {
      expose: true,
    });
  }
  throw createError(errors.notFound, "Artwork not found", { expose: true });
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
  if (foundArtwork.owner.id !== userId) {
    if (!foundFavorite) {
      const { favoriteId } = generateUuids({
        favoriteId: null,
      });
      const savedFavorite = await addNewFavorite({
        favoriteId,
        userId,
        artworkId,
        connection,
      });
      return { message: "Artwork favorited" };
    }
    throw createError(errors.badRequest, "Artwork has already been favorited", {
      expose: true,
    });
  }
  throw createError(errors.badRequest, "Cannot favorite your own artwork", {
    expose: true,
  });
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
  if (foundArtwork.owner.id !== userId) {
    if (foundFavorite) {
      await removeExistingFavorite({
        favoriteId: foundFavorite.id,
        connection,
      });
      return { message: "Artwork unfavorited" };
    }
    throw createError(
      errors.badRequest,
      "Artwork has already been unfavorited",
      { expose: true }
    );
  }
  throw createError(errors.badRequest, "Cannot unfavorite your own artwork", {
    expose: true,
  });
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
