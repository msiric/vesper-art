import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import License from '../models/license.js';
import Order from '../models/order.js';
import Discount from '../models/discount.js';
import User from '../models/user.js';
import Notification from '../models/notification.js';
import crypto from 'crypto';
import createError from 'http-errors';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

const getCheckout = async ({ artworkId }) => {
  const foundArtwork = await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  }).populate(
    'current',
    '_id cover created title personal type license availability description use commercial'
  );
  if (foundArtwork) {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).populate('discount');
    res.json({
      artwork: foundArtwork,
      discount: foundUser.discount,
    });
  } else {
    throw createError(400, 'Artwork not found');
  }
};

export default {
  getCheckout,
};
