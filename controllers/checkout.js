import mongoose from 'mongoose';
import Stripe from 'stripe';
import { fetchArtworkDetails } from '../services/artwork.js';
import { fetchUserDiscount } from '../services/user.js';
import createError from 'http-errors';

const stripe = Stripe(process.env.STRIPE_SECRET);

const getCheckout = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const foundArtwork = await fetchArtworkDetails({ artworkId });
    if (foundArtwork) {
      const foundUser = await fetchUserDiscount({ userId: res.locals.user.id });
      res.json({
        artwork: foundArtwork,
        discount: foundUser.discount,
      });
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

export default {
  getCheckout,
};
