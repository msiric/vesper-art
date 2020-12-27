import createError from "http-errors";
import { fetchOrderByVersion } from "../services/mongo/order.js";
import { fetchStripeAccount } from "../services/mongo/stripe.js";
import {
  addUserArtwork,
  addUserFavorite,
  fetchUserById,
  removeUserFavorite,
} from "../services/mongo/user.js";
import {
  addArtworkFavorite,
  addNewArtwork,
  addNewVersion,
  deactivateExistingArtwork,
  fetchActiveArtworks,
  fetchArtworkByOwner,
  fetchArtworkComments,
  fetchArtworkDetails,
  fetchArtworkLicenses,
  fetchArtworkReviews,
  fetchUserArtworks,
  removeArtworkFavorite,
  removeArtworkVersion,
} from "../services/postgres/artwork.js";
import { addNewLicense } from "../services/postgres/license.js";
import {
  formatArtworkValues,
  formatParams,
  sanitizeData,
} from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";
import artworkValidator from "../validation/artwork.js";

export const getArtwork = async ({ dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchActiveArtworks({ dataSkip, dataLimit });
  return { artwork: foundArtwork };
};

// $TODO how to handle limiting comments?
export const getArtworkDetails = async ({
  artworkId,
  dataCursor,
  dataCeiling,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchArtworkDetails({
    artworkId,
    dataSkip,
    dataLimit,
  });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, "Artwork not found");
};

export const getArtworkComments = async ({
  artworkId,
  dataCursor,
  dataCeiling,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchArtworkComments({
    artworkId,
    dataSkip,
    dataLimit,
  });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, "Artwork not found");
};

export const getArtworkReviews = async ({
  artworkId,
  dataCursor,
  dataCeiling,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchArtworkReviews({
    artworkId,
    dataSkip,
    dataLimit,
  });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, "Artwork not found");
};

// $TODO handle in user controller?
export const getUserArtwork = async ({ userId, dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchUserArtworks({
    userId,
    dataSkip,
    dataLimit,
  });
  return { artwork: foundArtwork };
};

export const editArtwork = async ({ userId, artworkId }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
  });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, "Artwork not found");
};

export const getLicenses = async ({ userId, artworkId }) => {
  const foundLicenses = await fetchArtworkLicenses({
    artworkId,
    userId,
  });
  return { licenses: foundLicenses };
};

export const postNewArtwork = async ({
  userId,
  artworkPath,
  artworkFilename,
  artworkMimetype,
  artworkData,
  session,
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
    const { error } = artworkValidator(sanitizeData(formattedData));
    if (error) throw createError(400, error);
    if (formattedData.artworkPersonal || formattedData.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId,
        session,
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
    const savedCover = await addNewCover({
      artworkUpload,
    });
    const savedMedia = await addNewMedia({
      artworkUpload,
    });
    const savedVersion = await addNewVersion({
      prevArtwork: { cover: null, media: null, artwork: null },
      artworkData: formattedData,
      artworkUpload,
      userId,
      savedCover,
      savedMedia,
    });
    const favoritedArtwork = await addNewArtwork({
      savedVersion,
      userId,
    });
    await addUserArtwork({
      artworkId: favoritedArtwork.id,
      userId,
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
  session,
}) => {
  // $TODO Validate data passed to upload
  const artworkUpload = await finalizeMediaUpload({
    filePath: artworkPath,
    fileName: artworkFilename,
    mimeType: artworkMimetype,
    fileType: "artwork",
  });
  const formattedData = formatArtworkValues(artworkData);
  const { error } = artworkValidator(sanitizeData(formattedData));
  if (error) throw createError(400, error);
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    session,
  });
  if (foundArtwork) {
    if (formattedData.artworkPersonal || formattedData.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId,
        session,
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
        })
      : foundArtwork.current.cover;
    const savedMedia = artworkUpload.fileMedia
      ? await addNewMedia({
          artworkUpload,
        })
      : foundArtwork.current.media;
    const savedVersion = await addNewVersion({
      prevArtwork: foundArtwork.current,
      artworkData: formattedData,
      artworkUpload,
      savedCover,
      savedMedia,
    });
    const foundOrder = await fetchOrderByVersion({
      artworkId: foundArtwork.id,
      versionId: foundArtwork.current.id,
      session,
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
        session,
      });
    } else {
      foundArtwork.versions.push(foundArtwork.current.id);
    }
    foundArtwork.current = savedVersion;
    await Artwork.save({ foundArtwork });
    return { redirect: "my_artwork" };
  } else {
    throw createError(400, "Artwork not found");
  }
};

// $TODO
// does it work in all cases?
// needs testing
export const deleteArtwork = async ({ userId, artworkId, data }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
  });
  if (foundArtwork) {
    // $TODO Check that artwork wasn't updated in the meantime (current === version)
    if (true) {
      const foundOrder = await fetchOrderByVersion({
        artworkId: foundArtwork.id,
        versionId: foundArtwork.current.id,
        session,
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
          session,
        });
      }
      await deactivateExistingArtwork({ artworkId, session });
      return { redirect: "my_artwork" };
    }
    throw createError(400, "Artwork has a newer version");
  }
  throw createError(400, "Artwork not found");
};

// needs transaction (done)
export const favoriteArtwork = async ({ userId, artworkId, session }) => {
  const foundUser = await fetchUserById({
    userId,
    session,
  });
  if (foundUser) {
    if (!foundUser.favoritedArtwork.includes(artworkId)) {
      await addUserFavorite({ userId: foundUser.id, artworkId, session });
      await addArtworkFavorite({ artworkId, session });
      return { message: "Artwork saved" };
    }
    throw createError(400, "Artwork could not be saved");
  }
  throw createError(400, "User not found");
};

export const unfavoriteArtwork = async ({ userId, artworkId, session }) => {
  const foundUser = await fetchUserById({
    userId,
    session,
  });
  if (foundUser) {
    if (foundUser.favoritedArtwork.includes(artworkId)) {
      await removeUserFavorite({ userId: foundUser.id, artworkId, session });
      await removeArtworkFavorite({ artworkId, session });
      return { message: "Artwork unsaved" };
    }
    throw createError(400, "Artwork could not be unsaved");
  }
  throw createError(400, "User not found");
};

// needs transaction (done)
// $TODO validacija licenci?
export const saveLicense = async ({ userId, artworkId, license, session }) => {
  const foundArtwork = await fetchArtworkDetails({ artworkId, session });
  if (foundArtwork) {
    await addNewLicense({
      artworkData: foundArtwork,
      licenseData: license,
      userId,
      session,
    });
    return { message: "License saved", license: license };
  }
  throw createError(400, "Artwork not found");
};
