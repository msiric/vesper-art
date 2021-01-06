import createError from "http-errors";
import { artworkValidation } from "../common/validation";
import {
  addNewArtwork,
  addNewCover,
  addNewFavorite,
  addNewMedia,
  addNewVersion,
  deactivateExistingArtwork,
  fetchActiveArtworks,
  fetchArtworkById,
  fetchArtworkByOwner,
  fetchArtworkComments,
  fetchArtworkDetails,
  fetchFavoriteByParents,
  fetchFavoritesCount,
  fetchUserArtworks,
  removeArtworkVersion,
  removeExistingFavorite,
} from "../services/postgres/artwork.js";
import { addNewLicense } from "../services/postgres/license.js";
import { fetchOrderByVersion } from "../services/postgres/order.js";
import { fetchStripeAccount } from "../services/postgres/stripe.js";
import { fetchUserById } from "../services/postgres/user.js";
import {
  formatArtworkValues,
  formatParams,
  generateUuids,
  sanitizeData,
} from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";

export const getArtwork = async ({ dataCursor, dataCeiling, connection }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchActiveArtworks({
    dataSkip,
    dataLimit,
    connection,
  });
  return { artwork: foundArtwork };
};

// $TODO how to handle limiting comments?
export const getArtworkDetails = async ({
  artworkId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchArtworkDetails({
    artworkId,
    dataSkip,
    dataLimit,
    connection,
  });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, "Artwork not found");
};

export const getArtworkComments = async ({
  artworkId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundComments = await fetchArtworkComments({
    artworkId,
    dataSkip,
    dataLimit,
    connection,
  });
  if (foundComments) return { comments: foundComments };
  throw createError(400, "Artwork not found");
};

// $TODO handle in user controller?
export const getUserArtwork = async ({
  userId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchUserArtworks({
    userId,
    dataSkip,
    dataLimit,
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
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, "Artwork not found");
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
    await artworkValidation.validate(sanitizeData(formattedData));
    if (formattedData.artworkPersonal || formattedData.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId,
        connection,
      });
      if (!foundUser) throw createError(400, "User not found");
      if (!foundUser.stripeId)
        throw createError(
          400,
          "Please complete the Stripe onboarding process before making your artwork commercially available"
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
          400,
          "Please complete your Stripe account before making your artwork commercially available"
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
      artworkUpload,
      connection,
    });
    await addNewArtwork({
      artworkId,
      versionId,
      userId,
      connection,
    });
    return { redirect: "/my_artwork" };
  }
  throw createError(400, "Please attach an artwork media before submitting");
};

// $TODO
// does it work in all cases?
// needs testing
export const updateArtwork = async ({
  userId,
  artworkId,
  artworkMimetype,
  artworkPath,
  artworkFilename,
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
  const formattedData = formatArtworkValues(artworkData);
  await artworkValidation.validate(sanitizeData(formattedData));
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    connection,
  });
  if (foundArtwork) {
    if (formattedData.artworkPersonal || formattedData.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId,
        connection,
      });
      if (!foundUser) throw createError(400, "User not found");
      if (!foundUser.stripeId)
        throw createError(
          400,
          "Please complete the Stripe onboarding process before making your artwork commercially available"
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
          400,
          "Please complete your Stripe account before making your artwork commercially available"
        );
      }
    }

    const savedCover = artworkUpload.fileCover
      ? await addNewCover({
          artworkUpload,
          connection,
        })
      : foundArtwork.current.cover;
    const savedMedia = artworkUpload.fileMedia
      ? await addNewMedia({
          artworkUpload,
          connection,
        })
      : foundArtwork.current.media;
    const savedVersion = await addNewVersion({
      prevArtwork: foundArtwork.current,
      artworkData: formattedData,
      artworkUpload,
      savedCover,
      savedMedia,
      connection,
    });
    const foundOrder = await fetchOrderByVersion({
      artworkId: foundArtwork.id,
      versionId: foundArtwork.current.id,
      connection,
    });
    if (!foundOrder) {
      if (formattedData.artworkCover && formattedData.artworkMedia) {
        await deleteS3Object({
          fileLink: foundArtwork.current.cover,
          folderName: "artworkCovers/",
        });

        await deleteS3Object({
          fileLink: foundArtwork.current.media,
          folderName: "artworkMedia/",
        });
      }
      await removeArtworkVersion({
        versionId: foundArtwork.current.id,
        connection,
      });
    } else {
      foundArtwork.versions.push(foundArtwork.current.id);
    }
    foundArtwork.current = savedVersion;
    await Artwork.save(foundArtwork);
    return { redirect: "my_artwork" };
  } else {
    throw createError(400, "Artwork not found");
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
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    connection,
  });
  if (foundArtwork) {
    // $TODO Check that artwork wasn't updated in the meantime (current === version)
    if (true) {
      const foundOrder = await fetchOrderByVersion({
        artworkId: foundArtwork.id,
        versionId: foundArtwork.current.id,
        connection,
      });
      if (!foundOrder) {
        await deleteS3Object({
          fileLink: foundArtwork.current.cover,
          folderName: "artworkCovers/",
        });

        await deleteS3Object({
          fileLink: foundArtwork.current.media,
          folderName: "artworkMedia/",
        });

        await removeArtworkVersion({
          versionId: foundArtwork.current.id,
          connection,
        });
      }
      await deactivateExistingArtwork({ artworkId, connection });
      return { redirect: "my_artwork" };
    }
    throw createError(400, "Artwork has a newer version");
  }
  throw createError(400, "Artwork not found");
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
    throw createError(400, "Artwork has already been favorited");
  }
  throw createError(400, "Cannot favorite your own artwork");
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
    throw createError(400, "Artwork has already been unfavorited");
  }
  throw createError(400, "Cannot unfavorite your own artwork");
};

// needs transaction (done)
// $TODO validacija licenci?
export const saveLicense = async ({
  userId,
  artworkId,
  license,
  connection,
}) => {
  const foundArtwork = await fetchArtworkDetails({ artworkId, connection });
  if (foundArtwork) {
    const { licenseId } = generateUuids({
      licenseId: null,
    });
    const savedLicense = await addNewLicense({
      licenseId,
      artworkData: foundArtwork,
      licenseData: license,
      userId,
      connection,
    });
    return { message: "License saved", license: license };
  }
  throw createError(400, "Artwork not found");
};
