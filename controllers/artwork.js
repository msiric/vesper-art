import mongoose from 'mongoose';
import createError from 'http-errors';
import { sanitize, deleteS3Object, formatParams } from '../utils/helpers.js';
import artworkValidator from '../utils/validation/artwork.js';
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

const getArtwork = async ({ cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundArtwork = await fetchActiveArtworks({ skip, limit });
  return { artwork: foundArtwork };
};

const getArtworkDetails = async ({ artworkId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundArtwork = await fetchArtworkDetails({ artworkId, skip, limit });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, 'Artwork not found');
};

const getArtworkComments = async ({ artworkId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundArtwork = await fetchArtworkComments({ artworkId, skip, limit });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, 'Artwork not found');
};

const getArtworkReviews = async ({ artworkId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundArtwork = await fetchArtworkReviews({ artworkId, skip, limit });
  if (foundArtwork) return { artwork: foundArtwork };
  throw createError(400, 'Artwork not found');
};

const getUserArtwork = async ({ userId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundArtwork = await fetchUserArtworks({
    userId,
    skip,
    limit,
  });
  return { artwork: foundArtwork };
};

const editArtwork = async ({ userId, artworkId }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
  });
  if (foundArtwork) return { artwork: foundArtwork.current };
  throw createError(400, 'Artwork not found');
};

const getLicenses = async ({ userId, artworkId }) => {
  const foundLicenses = await fetchArtworkLicenses({
    artworkId,
    userId,
  });
  return { licenses: foundLicenses };
};

const postNewArtwork = async ({ userId, artworkData, session }) => {
  const { error, value } = artworkValidator(sanitize(artworkData));
  if (error) throw createError(400, error);
  if (value.artworkPersonal || value.artworkCommercial) {
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
      (value.artworkPersonal || value.artworkCommercial) &&
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
    artworkData: value,
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
const updateArtwork = async ({ userId, artworkId, session }) => {
  const foundArtwork = await fetchArtworkByOwner({
    artworkId,
    userId,
    session,
  });
  const { error, value } = artworkValidator(sanitize(req.body));
  if (error) throw createError(400, error);
  if (foundArtwork) {
    if (value.artworkPersonal || value.artworkCommercial) {
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
        (value.artworkPersonal || value.artworkCommercial) &&
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
      artworkData: value,
      session,
    });
    const foundOrder = await fetchOrderByVersion({
      artworkId: foundArtwork._id,
      versionId: foundArtwork.current._id,
      session,
    });
    if (!foundOrder) {
      if (value.artworkCover && value.artworkMedia) {
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
const deleteArtwork = async ({ userId, artworkId, session }) => {
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
const saveArtwork = async ({ userId, artworkId, session }) => {
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

const unsaveArtwork = async ({ userId, artworkId, session }) => {
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
const saveLicenses = async ({ userId, artworkId, licenses, session }) => {
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

export default {
  getArtwork,
  getArtworkDetails,
  getArtworkComments,
  getArtworkReviews,
  getUserArtwork,
  postNewArtwork,
  editArtwork,
  updateArtwork,
  deleteArtwork,
  saveArtwork,
  unsaveArtwork,
  getLicenses,
  saveLicenses,
};
