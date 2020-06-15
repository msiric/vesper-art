import mongoose from 'mongoose';
import User from '../models/user.js';
import Artwork from '../models/artwork.js';
import Version from '../models/version.js';
import Order from '../models/order.js';
import createError from 'http-errors';
import { sanitize, deleteS3Object } from '../utils/helpers.js';
import Stripe from 'stripe';
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
} from '../services/user.js';
import postArtworkValidator from '../utils/validation/postArtworkValidator.js';
import putArtworkValidator from '../utils/validation/putArtworkValidator.js';
import { fetchOrderByVersion } from '../services/order.js';

const stripe = Stripe(process.env.STRIPE_SECRET);

const getArtwork = async (req, res, next) => {
  try {
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundArtwork = await fetchActiveArtworks({ skip, limit });
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getArtworkDetails = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundArtwork = await fetchArtworkDetails({ artworkId, skip, limit });
    if (foundArtwork)
      return res.json({
        artwork: foundArtwork,
      });
    else throw createError(400, 'Artwork not found');
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getArtworkComments = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundArtwork = await fetchArtworkComments({ artworkId, skip, limit });
    if (foundArtwork)
      return res.json({
        artwork: foundArtwork,
      });
    else throw createError(400, 'Artwork not found');
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getArtworkReviews = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundArtwork = await fetchArtworkReviews({ artworkId, skip, limit });
    if (foundArtwork)
      return res.json({
        artwork: foundArtwork,
      });
    else throw createError(400, 'Artwork not found');
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getUserArtwork = async (req, res, next) => {
  try {
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundArtwork = await fetchUserArtworks({
      userId: res.locals.user.id,
      skip,
      limit,
    });
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const editArtwork = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const foundArtwork = await fetchArtworkByOwner({
      artworkId,
      userId: res.locals.user.id,
    });
    if (foundArtwork) return res.json({ artwork: foundArtwork.current });
    else throw createError(400, 'Artwork not found');
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getLicenses = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const foundLicenses = await fetchArtworkLicenses({
      artworkId,
      userId: res.locals.user.id,
    });
    return res.json(foundLicenses);
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const postNewArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = postArtworkValidator(sanitize(req.body));
    if (error) throw createError(400, error);
    if (value.artworkPersonal || value.artworkCommercial) {
      const foundUser = await fetchUserById({
        userId: res.locals.user.id,
        session,
      });
      if (!foundUser) throw createError(400, 'User not found');
      if (!foundUser.stripeId)
        throw createError(
          400,
          'Please complete the Stripe onboarding process before making your artwork commercially available'
        );
      const foundAccount = await stripe.accounts.retrieve(foundUser.stripeId);
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
      userId: res.locals.user.id,
      session,
    });
    await User.updateOne(
      { _id: res.locals.user.id },
      { $push: { artwork: savedVersion.artwork } }
    ).session(session);
    await session.commitTransaction();
    return res.json('/my_artwork');
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// $TODO
// does it work in all cases?
// needs testing
const updateArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundArtwork = await fetchArtworkByOwner({
      artworkId,
      userId: res.locals.user.id,
      session,
    });
    const { error, value } = putArtworkValidator(sanitize(req.body));
    if (error) throw createError(400, error);
    if (foundArtwork) {
      if (value.artworkPersonal || value.artworkCommercial) {
        const foundUser = await fetchUserById({
          userId: res.locals.user.id,
          session,
        });
        if (!foundUser) throw createError(400, 'User not found');
        if (!foundUser.stripeId)
          throw createError(
            400,
            'Please complete the Stripe onboarding process before making your artwork commercially available'
          );
        const foundAccount = await stripe.accounts.retrieve(foundUser.stripeId);
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
      await session.commitTransaction();
      return res.json('/my_artwork');
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

// $TODO
// does it work in all cases?
// needs testing
const deleteArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundArtwork = await fetchArtworkByOwner({
      artworkId,
      userId: res.locals.user.id,
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
      await session.commitTransaction();
      return res.json('/my_artwork');
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const saveArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundUser = await fetchUserById({
      userId: res.locals.user.id,
      session,
    });
    if (foundUser) {
      if (!foundUser.savedArtwork.includes(artworkId)) {
        await addUserSave({ userId: foundUser._id, artworkId, session });
        await addArtworkSave({ artworkId, session });
        await session.commitTransaction();
        res.json({ message: 'Artwork saved' });
      } else {
        throw createError(400, 'Artwork could not be saved');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

const unsaveArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundUser = await fetchUserById({
      userId: res.locals.user.id,
      session,
    });
    if (foundUser) {
      if (foundUser.savedArtwork.includes(artworkId)) {
        await removeUserSave({ userId: foundUser._id, artworkId, session });
        await removeArtworkSave({ artworkId, session });
        await session.commitTransaction();
        res.json({ message: 'Artwork unsaved' });
      } else {
        throw createError(400, 'Artwork could not be unsaved');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const saveLicenses = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const { licenses } = req.body;
    if (licenses.length) {
      const foundArtwork = await fetchArtworkDetails({ artworkId, session });
      if (foundArtwork) {
        await saveLicenseSet({
          userId: res.locals.user.id,
          artworkData: foundArtwork,
          licenseData: licenses,
          session,
        });
        await session.commitTransaction();
        res
          .status(200)
          .json({ message: 'Licenses saved', licenses: savedLicenses });
      } else {
        throw createError(400, 'Artwork not found');
      }
    } else {
      throw createError(400, 'Artwork needs to have at least one license');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
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
