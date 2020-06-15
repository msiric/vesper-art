import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import Order from '../models/order.js';
import Version from '../models/version.js';
import aws from 'aws-sdk';
import User from '../models/user.js';
import randomString from 'randomstring';
import mailer from '../utils/email.js';
import config from '../config/mailer.js';
import { server } from '../config/secret.js';
import {
  fetchUserArtworks,
  fetchArtworksByOwner,
} from '../services/artwork.js';
import { fetchOrdersBySeller, fetchOrdersByBuyer } from '../services/order.js';
import {
  fetchUserById,
  fetchUserByEmail,
  fetchUserProfile,
  fetchUserSaves,
  fetchUserStatistics,
  fetchUserNotifications,
  editUserEmail,
  editUserPassword,
  editUserPreferences,
  deactivateExistingUser,
} from '../services/user.js';
import auth from '../utils/auth.js';
import createError from 'http-errors';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundUser = await fetchUserProfile({ username, skip, limit });
    if (foundUser) {
      return res.json({ user: foundUser, artwork: foundUser.artwork });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    next(err, res);
  }
};

const getUserArtwork = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundArtwork = fetchUserArtworks({
      userId,
      skip,
      limit,
    });
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    next(err, res);
  }
};

const getUserSaves = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundUser = await fetchUserSaves({ userId, skip, limit });
    return res.json({ saves: foundUser.savedArtwork });
  } catch (err) {
    next(err, res);
  }
};

const getUserStatistics = async (req, res, next) => {
  try {
    // brisanje accounta
    /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
    const { userId } = req.params;
    const foundUser = await fetchUserStatistics({ userId });
    const balance = await stripe.balance.retrieve({
      stripe_account: foundUser.stripeId,
    });
    const { amount, currency } = balance.available[0];
    return res.json({ statistics: foundUser, amount: amount });
  } catch (err) {
    next(err, res);
  }
};

const getUserSales = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;
    const foundOrders = await fetchOrdersBySeller({ userId, from, to });
    return res.json({ statistics: foundOrders });
  } catch (err) {
    next(err, res);
  }
};

const getUserPurchases = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;
    const foundOrders = await fetchOrdersByBuyer({ userId, from, to });
    return res.json({ statistics: foundOrders });
  } catch (err) {
    next(err, res);
  }
};

const updateUserProfile = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const { userPhoto, userDescription, userCountry } = req.body;
    const foundUser = await fetchUserById({ userId, session });
    if (foundUser) {
      if (userPhoto) foundUser.photo = userPhoto;
      if (userDescription) foundUser.description = userDescription;
      if (userCountry) foundUser.country = userCountry;
      await foundUser.save({ session });
      await session.commitTransaction();
      return res.json({ message: 'User details updated' });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const getUserSettings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const foundUser = await fetchUserById({ userId });
    if (foundUser) {
      return res.json({ user: foundUser });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    next(err, res);
  }
};

const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
    const foundNotifications = await fetchUserNotifications({
      userId,
      skip,
      limit,
    });
    return res.json({ notifications: foundNotifications });
  } catch (err) {
    next(err, res);
  }
};

const updateUserEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const { email } = req.body;
    const foundUser = await fetchUserByEmail({ email, session });
    if (foundUser) {
      throw createError(400, 'User with entered email already exists');
    } else {
      const token = randomString.generate();
      const link = `${server.clientDomain}/verify_token/${token}`;
      await editUserEmail({ userId, email, token, session });
      await mailer.sendEmail(
        config.app,
        email,
        'Please confirm your email',
        `Hello,
        Please click on the link to verify your email:

        <a href=${link}>Click here to verify</a>`
      );
      await session.commitTransaction();
      return res.json({ message: 'Email successfully updated' });
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const updateUserPassword = async (req, res, next) => {
  try {
    const { current, password, confirmPassword } = req.body;
    const { userId } = req.params;
    await editUserPassword({ userId, password });
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (done)
const updateUserPreferences = async (req, res, next) => {
  try {
    const { displaySaves } = req.body;
    const { userId } = req.params;
    await editUserPreferences({ userId, displaySaves });
    return res
      .status(200)
      .json({ message: 'Preferences updated successfully' });
  } catch (err) {
    next(err, res);
  }
};

/* const deleteUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }]
    });
    if (foundUser) {
      if (foundUser.photo.includes(foundUser._id)) {
        const folderName = 'profilePhotos/';
        const fileName = foundUser.photo.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        await s3.deleteObject(params).promise();
      }
      const updatedUser = await User.updateOne(
        { _id: foundUser._id },
        {
          $set: {
            name: 'Deleted User',
            password: null,
            photo: foundUser.gravatar(),
            description: null,
            facebookId: null,
            googleId: null,
            customWork: false,
            verificationToken: null,
            verified: false,
            resetToken: null,
            resetExpiry: null,
            cart: null,
            discount: null,
            inbox: null,
            notifications: null,
            rating: null,
            reviews: null,
            savedArtwork: null,
            earnings: null,
            incomingFunds: null,
            outgoingFunds: null,
            escrow: null,
            active: false
          }
        }
      );
      if (updatedUser) {
        req.logout();
        req.session.destroy(function(err) {
          res.json('/');
        });
      } else {
        return res.status(400).json({ message: 'User could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
}; */

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
const deactivateUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const foundUser = await fetchUserById({ userId, session });
    if (foundUser) {
      const foundArtwork = await fetchArtworksByOwner({
        userId: res.locals.user.id,
        session,
      });
      for (let artwork of foundArtwork) {
        const foundOrder = await fetchOrderByVersion({
          artworkId: artwork._id,
          versionId: artwork.current._id,
          session,
        });
        if (!foundOrder.length) {
          await deleteS3Object({
            link: artwork.current.cover,
            folder: 'artworkCovers/',
          });

          await deleteS3Object({
            link: artwork.current.media,
            folder: 'artworkMedia/',
          });

          await removeArtworkVersion({
            versionId: artwork.current._id,
            session,
          });
        }
        await deactivateExistingArtwork({ artworkId: artwork._id, session });
      }
      await deleteS3Object({
        link: foundUser.photo,
        folder: 'profilePhotos/',
      });
      await deactivateExistingUser({ userId: foundUser._id, session });
      await session.commitTransaction();
      req.logout();
      req.session.destroy(function (err) {
        res.json('/');
      });
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

export default {
  getUserProfile,
  getUserArtwork,
  getUserSaves,
  getUserStatistics,
  getUserSales,
  getUserPurchases,
  updateUserProfile,
  getUserSettings,
  getUserNotifications,
  updateUserEmail,
  updateUserPassword,
  updateUserPreferences,
  deactivateUser,
};
