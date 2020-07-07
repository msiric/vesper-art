import mongoose from "mongoose";
import Artwork from "../models/artwork.js";
import Order from "../models/order.js";
import Version from "../models/version.js";
import Notification from "../models/notification.js";
import aws from "aws-sdk";
import User from "../models/user.js";
import Review from "../models/review.js";
import createError from "http-errors";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const fetchUserById = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  });
};

export const fetchUserByEmail = async ({ email, session = null }) => {
  return await User.findOne({
    $and: [{ email: email }, { active: true }],
  }).session(session);
};

export const fetchUserByToken = async ({ tokenId, session = null }) => {
  return await User.findOne({
    resetToken: tokenId,
    resetExpiry: { $gt: Date.now() },
  }).session(session);
};

export const fetchUserByCreds = async ({ username, session = null }) => {
  return await User.findOne({
    $and: [
      { $or: [{ email: username }, { name: username }] },
      { active: true },
    ],
  }).session(session);
};

export const fetchUserDiscount = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).populate("discount");
};

export const fetchUserSales = async ({ userId, session = null }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate("sales.buyer sales.version sales.review");
};

export const editUserStripe = async ({ userId, stripeId, session = null }) => {
  return await User.updateOne({ _id: userId }, { stripeId }).session(session);
};

export const editUserPurchase = async ({ userId, orderId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { purchases: orderId } }
  ).session(session);
};

export const editUserSale = async ({ userId, orderId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { sales: orderId }, $inc: { notifications: 1 } }
  ).session(session);
};

export const fetchUserPurchases = async ({ userId, session = null }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate("purchases.seller purchases.version purchases.review");
};

export const fetchUserProfile = async ({
  username,
  skip,
  limit,
  session = null,
}) => {
  return await User.findOne({
    $and: [{ name: username }, { active: true }],
  }).populate(
    skip && limit
      ? {
          path: "artwork",
          options: {
            limit,
            skip,
          },
          populate: {
            path: "current",
          },
        }
      : {
          path: "artwork",
          populate: {
            path: "current",
          },
        }
  );
};

export const fetchUserArtwork = async ({
  userId,
  cursor,
  ceiling,
  session = null,
}) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  return await Artwork.find(
    {
      $and: [{ owner: userId }, { active: true }],
    },
    undefined,
    {
      skip,
      limit,
    }
  );
};

export const fetchUserSaves = async ({
  userId,
  skip,
  limit,
  session = null,
}) => {
  return await User.findOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    undefined,
    {
      skip,
      limit,
    }
  ).populate({
    path: "savedArtwork",
    options: {
      limit,
      skip,
    },
    populate: {
      path: "current",
    },
  });
};

export const fetchUserStatistics = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).deepPopulate(
    "purchases.version purchases.licenses sales.version sales.licenses"
  );
};

export const editUserProfile = async ({
  userId,
  userMedia,
  userDescription,
  userCountry,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { photo: userMedia, description: userDescription, country: userCountry }
  );
};

export const fetchUserNotifications = async ({
  userId,
  skip,
  limit,
  session = null,
}) => {
  return await Notification.find({ receiver: userId }, undefined, {
    skip,
    limit,
  })
    .populate("user")
    .sort({ created: -1 });
};

export const editUserEmail = async ({
  userId,
  email,
  token,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { email: email, verificationToken: token, verified: false }
  ).session(session);
};

export const editUserPassword = async ({
  userId,
  password,
  session = null,
}) => {
  return await User.updateOne({ _id: userId }, { password: password }).session(
    session
  );
};

export const editUserPreferences = async ({
  userId,
  displaySaves,
  session = null,
}) => {
  return await User.updateOne(
    { _id: userId },
    { displaySaves: displaySaves }
  ).session(session);
};

export const addUserArtwork = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { artwork: artworkId } }
  ).session(session);
};

export const addUserSave = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { savedArtwork: artworkId } }
  ).session(session);
};

export const removeUserSave = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $pull: { savedArtwork: artworkId } }
  ).session(session);
};

export const addUserNotification = async ({ userId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $inc: { notifications: 1 } }
  ).session(session);
};

export const editUserRating = async ({
  userId,
  userRating,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    {
      rating: userRating,
      $inc: { reviews: 1, notifications: 1 },
    }
  ).session(session);
};

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
export const deactivateExistingUser = async ({ userId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    {
      $set: {
        name: null,
        email: null,
        password: null,
        photo: null,
        height: null,
        width: null,
        description: null,
        facebookId: null,
        googleId: null,
        customWork: false,
        displaySaves: false,
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
        artwork: null,
        savedArtwork: null,
        purchases: null,
        sales: null,
        stripeId: null,
        active: false,
      },
    }
  ).session(session);
};

export const addUserDiscount = async ({
  userId,
  discountId,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { discount: discountId }
  ).session(session);
};

export const removeUserDiscount = async ({ userId, session = null }) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { discount: null }
  ).session(session);
};
