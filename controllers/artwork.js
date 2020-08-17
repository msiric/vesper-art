import mongoose from 'mongoose';
import createError from 'http-errors';
import { sanitizeData, formatParams } from '../utils/helpers.js';
import { deleteS3Object, finalizeMediaUpload } from '../utils/upload.js';
import artworkValidator from '../validation/artwork.js';
import {
  fetchActiveArtworks,
  fetchArtworkDetails,
  fetchArtworkComments,
  fetchArtworkReviews,
  fetchUserArtworks,
  fetchArtworkByOwner,
  fetchArtworkLicenses,
  addNewArtwork,
  addNewVersion,
  addArtworkSave,
  removeArtworkSave,
  saveLicenseSet,
  removeArtworkVersion,
  deactivateExistingArtwork,
} from '../services/artwork.js';
import {
  fetchUserById,
  addUserSave,
  removeUserSave,
  addUserArtwork,
} from '../services/user.js';
import { fetchOrderByVersion } from '../services/order.js';
import { fetchStripeAccount } from '../services/stripe.js';

export const getArtwork = async ({ dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchActiveArtworks({ dataSkip, dataLimit });
  return { artwork: foundArtwork };
};

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
  throw createError(400, 'Artwork not found');
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
  throw createError(400, 'Artwork not found');
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
  throw createError(400, 'Artwork not found');
};

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
  if (foundArtwork) return { artwork: foundArtwork.current };
  throw createError(400, 'Artwork not found');
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
  artworkData,
  session,
}) => {
  const artworkUpload = await finalizeMediaUpload({
    filePath: artworkPath,
    fileName: artworkFilename,
    fileType: 'artwork',
  });
  const { error } = artworkValidator(sanitizeData(artworkData));
  if (error) throw createError(400, error);
  if (artworkData.artworkPersonal || artworkData.artworkCommercial) {
    const foundUser = await fetchUserById({
      userId,
      session,
    });
    if (!foundUser) throw createError(400, 'User not found');
    if (!foundUser.stripeId)
      throw createError(
        400,
        'Please complete the Stripe onboarding process before making your artwork commercially available'
      );
    const foundAccount = await fetchStripeAccount({
      accountId: foundUser.stripeId,
    });
    if (
      (artworkData.artworkPersonal || artworkData.artworkCommercial) &&
      // $TODO foundAccount.capabilities.platform_payments (platform_payments are deprecated, now called "transfers")
      (foundAccount.capabilities.card_payments !== 'active' ||
        foundAccount.capabilities.platform_payments !== 'active')
    ) {
      throw createError(
        400,
        'Please complete your Stripe account before making your artwork commercially available'
      );
    }
  }
  const savedVersion = await addNewArtwork({
    artworkData,
    artworkUpload,
    userId,
    session,
  });
  await addUserArtwork({
    artworkId: savedVersion.artwork,
    userId,
    session,
  });
  return { redirect: '/my_artwork' };
};

// $TODO
// does it work in all cases?
// needs testing
export const updateArtwork = async ({
  userId,
  artworkId,
  artworkData,
  artworkPath,
  artworkFilename,
  session,
}) => {
  const { artworkUpload } = finalizeMediaUpload({
    path: artworkPath,
    filename: artworkFilename,
    type: 'artwork',
  });
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    session,
  });
  const { error } = artworkValidator(sanitizeData(artworkData));
  if (error) throw createError(400, error);
  if (foundArtwork) {
    if (artworkData.artworkPersonal || artworkData.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId,
        session,
      });
      if (!foundUser) throw createError(400, 'User not found');
      if (!foundUser.stripeId)
        throw createError(
          400,
          'Please complete the Stripe onboarding process before making your artwork commercially available'
        );
      const foundAccount = await fetchStripeAccount({
        accountId: foundUser.stripeId,
      });
      if (
        (artworkData.artworkPersonal || artworkData.artworkCommercial) &&
        // $TODO foundAccount.capabilities.platform_payments (platform_payments are deprecated, now called "transfers")
        (foundAccount.capabilities.card_payments !== 'active' ||
          foundAccount.capabilities.platform_payments !== 'active')
      ) {
        throw createError(
          400,
          'Please complete your Stripe account before making your artwork commercially available'
        );
      }
    }
    const savedVersion = await addNewVersion({
      prevArtwork: foundArtwork.current,
      artworkData,
      artworkUpload,
      session,
    });
    const foundOrder = await fetchOrderByVersion({
      artworkId: foundArtwork._id,
      versionId: foundArtwork.current._id,
      session,
    });
    if (!foundOrder) {
      if (artworkData.artworkCover && artworkData.artworkMedia) {
        await deleteS3Object({
          link: foundArtwork.current.cover,
          folder: 'artworkCovers/',
        });

        await deleteS3Object({
          link: foundArtwork.current.media,
          folder: 'artworkMedia/',
        });
      }
      await removeArtworkVersion({
        versionId: foundArtwork.current._id,
        session,
      });
    } else {
      foundArtwork.versions.push(foundArtwork.current._id);
    }
    foundArtwork.current = savedVersion._id;
    await foundArtwork.save({ session });
    return { redirect: 'my_artwork' };
  } else {
    throw createError(400, 'Artwork not found');
  }
};

// $TODO
// does it work in all cases?
// needs testing
export const deleteArtwork = async ({ userId, artworkId, session }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    session,
  });
  if (foundArtwork) {
    const foundOrder = await fetchOrderByVersion({
      artworkId: foundArtwork._id,
      versionId: foundArtwork.current._id,
      session,
    });
    if (!foundOrder.length) {
      await deleteS3Object({
        link: foundArtwork.current.cover,
        folder: 'artworkCovers/',
      });

      await deleteS3Object({
        link: foundArtwork.current.media,
        folder: 'artworkMedia/',
      });

      await removeArtworkVersion({
        versionId: foundArtwork.current._id,
        session,
      });
    }
    await deactivateExistingArtwork({ artworkId, session });
    return { redirect: 'my_artwork' };
  }
  throw createError(400, 'Artwork not found');
};

// needs transaction (done)
export const saveArtwork = async ({ userId, artworkId, session }) => {
  const foundUser = await fetchUserById({
    userId,
    session,
  });
  if (foundUser) {
    if (!foundUser.savedArtwork.includes(artworkId)) {
      await addUserSave({ userId: foundUser._id, artworkId, session });
      await addArtworkSave({ artworkId, session });
      return { message: 'Artwork saved' };
    }
    throw createError(400, 'Artwork could not be saved');
  }
  throw createError(400, 'User not found');
};

export const unsaveArtwork = async ({ userId, artworkId, session }) => {
  const foundUser = await fetchUserById({
    userId,
    session,
  });
  if (foundUser) {
    if (foundUser.savedArtwork.includes(artworkId)) {
      await removeUserSave({ userId: foundUser._id, artworkId, session });
      await removeArtworkSave({ artworkId, session });
      return { message: 'Artwork unsaved' };
    }
    throw createError(400, 'Artwork could not be unsaved');
  }
  throw createError(400, 'User not found');
};

// needs transaction (done)
// $TODO validacija licenci?
export const saveLicenses = async ({
  userId,
  artworkId,
  licenses,
  session,
}) => {
  if (licenses.length) {
    const foundArtwork = await fetchArtworkDetails({ artworkId, session });
    if (foundArtwork) {
      await saveLicenseSet({
        artworkData: foundArtwork,
        licenseData: licenses,
        userId,
        session,
      });
      return { message: 'Licenses saved', licenses: savedLicenses };
    }
    throw createError(400, 'Artwork not found');
  }
  throw createError(400, 'Artwork needs to have at least one license');
};
