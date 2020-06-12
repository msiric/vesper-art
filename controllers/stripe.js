import mongoose from 'mongoose';
import { server, stripe as processor } from '../config/secret.js';
import License from '../models/license.js';
import crypto from 'crypto';
import createError from 'http-errors';
import axios from 'axios';
import Stripe from 'stripe';
import FormData from 'form-data';
import querystring from 'querystring';
import currency from 'currency.js';
import {
  constructStripeEvent,
  constructStripeLink,
  constructStripePayout,
  fetchStripeAccount,
  fetchStripeBalance,
} from '../services/stripe.js';
import {
  fetchUserDiscount,
  editUserStripe,
  editUserPurchase,
} from '../services/user.js';
import { fetchArtworkDetails } from '../services/artwork.js';
import { addNewLicenses } from '../services/license.js';
import { addNewOrder } from '../services/order.js';
import { addNewNotification } from '../services/notification.js';
import socketApi from '../realtime/io.js';

const stripe = Stripe(process.env.STRIPE_SECRET);

const receiveWebhookEvent = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK;

    const event = await constructStripeEvent({
      body: req.rawBody,
      signature,
      secret: endpointSecret,
    });

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await createOrder(paymentIntent);
        break;
      default:
        return res.status(400).end();
    }

    res.json({ received: true });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getStripeUser = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const foundAccount = await fetchStripeAccount({ accountId });

    res.json({
      capabilities: {
        cardPayments: foundAccount.capabilities.card_payments,
        platformPayments: foundAccount.capabilities.platform_payments,
      },
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const managePaymentIntent = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const { licenses, intentId } = req.body;
    const foundUser = await fetchUserDiscount({ userId: res.locals.user.id });
    if (foundUser) {
      const foundArtwork = await fetchArtworkDetails({ artworkId });
      if (foundArtwork) {
        let personalLicenses = 0;
        let commercialLicenses = 0;
        licenses.map((license) => {
          if (license.licenseType === 'personal') {
            personalLicenses += foundArtwork.current.personal;
            license.licensePrice = currency(
              foundArtwork.current.personal
            ).intValue;
          } else if (license.licenseType === 'commercial') {
            commercialLicenses += foundArtwork.current.commercial;
            license.licensePrice = currency(
              foundArtwork.current.commercial
            ).intValue;
          }
        });
        const buyerFee = currency(personalLicenses)
          .add(commercialLicenses)
          .multiply(0.05)
          .add(2.35);
        const sellerFee = currency(0.85);
        const discount = foundUser.discount
          ? currency(personalLicenses)
              .add(commercialLicenses)
              .multiply(foundUser.discount.discount)
          : 0;
        const buyerTotal = currency(personalLicenses)
          .add(commercialLicenses)
          .subtract(discount)
          .add(buyerFee);
        const sellerTotal = currency(personalLicenses)
          .add(commercialLicenses)
          .multiply(sellerFee);
        const platformTotal = currency(buyerTotal).subtract(sellerTotal);
        const stripeFees = currency(1.03).add(2).add(0.3);
        const total = currency(platformTotal).subtract(stripeFees);

        const orderData = {
          buyerId: foundUser._id,
          sellerId: foundArtwork.owner._id,
          artworkId: foundArtwork._id,
          versionId: foundArtwork.current._id,
          discountId: foundUser.discount ? foundUser.discount._id : null,
          spent: buyerTotal.intValue,
          earned: sellerTotal.intValue,
          fee: platformTotal.intValue,
          licenses: licenses,
        };
        const paymentIntent = intentId
          ? await stripe.paymentIntents.update(intentId, {
              amount: buyerTotal.intValue,
              application_fee_amount: platformTotal.intValue,
            })
          : await stripe.paymentIntents.create({
              payment_method_types: ['card'],
              amount: buyerTotal.intValue,
              currency: 'usd',
              application_fee_amount: platformTotal.intValue,
              on_behalf_of: foundArtwork.owner.stripeId,
              transfer_data: {
                destination: foundArtwork.owner.stripeId,
              },
              metadata: {
                orderData: JSON.stringify(orderData),
              },
            });
        res.json({
          intent: {
            id: paymentIntent.id,
            secret: paymentIntent.client_secret,
          },
        });
      } else {
        throw createError(400, 'Artwork not found');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const redirectToStripe = async (req, res, next) => {
  try {
    const onboarded = res.locals.user.onboarded;
    if (!onboarded) {
      throw createError(
        400,
        'You need to complete the onboarding process before accessing your Stripe dashboard'
      );
    }
    const loginLink = await constructStripeLink({
      onboarded,
      domain: server.serverDomain,
    });
    if (req.query.account) loginLink.url = `${loginLink.url}#/account`;

    return res.json({ url: loginLink.url });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const onboardUser = async (req, res, next) => {
  try {
    const { country, email } = req.body;
    req.session.state = Math.random().toString(36).slice(2);
    req.session.id = res.locals.user.id;
    req.session.name = res.locals.user.name;

    const parameters = {
      client_id: processor.clientId,
      state: req.session.state,
      redirect_uri: `${server.serverDomain}/stripe/token`,
      'stripe_user[business_type]': 'individual',
      'stripe_user[business_name]': undefined,
      'stripe_user[first_name]': undefined,
      'stripe_user[last_name]': undefined,
      'stripe_user[email]': email || undefined,
      'stripe_user[country]': country || undefined,
    };

    // If we're suggesting this account have the `card_payments` capability,
    // we can pass some additional fields to prefill:
    // 'suggested_capabilities[]': 'card_payments',
    // 'stripe_user[street_address]': req.user.address || undefined,
    // 'stripe_user[city]': req.user.city || undefined,
    // 'stripe_user[zip]': req.user.postalCode || undefined,
    // 'stripe_user[state]': req.user.city || undefined,

    /* return res.json({
      url: `${processor.authorizeUri}?${querystring.stringify(parameters)}`,
    }); */

    return res.json({
      url: `${processor.authorizeUri}?${querystring.stringify(parameters)}`,
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const assignStripeId = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  if (req.session.state != req.query.state) {
    throw createError(500, 'There was an error onboarding you');
  }
  try {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', processor.clientId);
    formData.append('client_secret', processor.secretKey);
    formData.append('code', req.query.code);

    const expressAuthorized = await axios.post(processor.tokenUri, formData, {
      headers: formData.getHeaders(),
    });

    if (expressAuthorized.error) {
      console.log(expressAuthorized.error);
      throw createError(500, expressAuthorized.error);
    }

    await editUserStripe({
      userId: req.session.id,
      stripeId: expressAuthorized.data.stripe_user_id,
      session,
    });

    const username = req.session.name;

    req.session.state = null;
    req.session.id = null;
    req.session.name = null;

    await session.commitTransaction();
    return res.redirect(`/user/${username}`);
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

const createPayout = async (req, res, next) => {
  try {
    const foundUser = await fetchUserById({ userId: res.locals.user.id });
    if (foundUser.stripeId) {
      const balance = await fetchStripeBalance({
        stripeId: foundUser.stripeId,
      });
      const { amount, currency } = balance.available[0];
      await constructStripePayout({
        amount,
        currency,
        descriptor: server.appName,
        stripeId: foundUser.stripeId,
      });
      res.json({
        message: 'Payout successfully created',
      });
    } else {
      throw createError(400, 'Cannot create payout for this user');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const createOrder = async (intent) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderData = JSON.parse(intent.metadata.orderData);
    const buyerId = mongoose.Types.ObjectId(orderData.buyerId);
    const sellerId = mongoose.Types.ObjectId(orderData.sellerId);
    const artworkId = mongoose.Types.ObjectId(orderData.artworkId);
    const versionId = mongoose.Types.ObjectId(orderData.versionId);
    const discountId = mongoose.Types.ObjectId(orderData.discountId);
    const intentId = intent.id;
    const licenseSet = [];
    const licenseIds = [];
    for (let license of orderData) {
      const newLicense = new License();
      newLicense.owner = buyerId;
      newLicense.artwork = artworkId;
      newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
      newLicense.type = license.licenseType;
      newLicense.active = true;
      newLicense.price = license.licensePrice;
      licenseSet.push(newLicense);
    }
    const savedLicenses = await addNewLicenses({
      licenses: licenseSet,
      session,
    });
    savedLicenses.forEach((license) => {
      licenseIds.push(license._id);
    });
    const orderObject = {
      buyer: buyerId,
      seller: sellerId,
      artwork: artworkId,
      version: versionId,
      discount: discountId,
      licenses: licenseIds,
      review: null,
      spent: orderData.spent,
      earned: orderData.earned,
      fee: orderData.fee,
      status: 'completed',
      intent: intentId,
    };
    const savedOrder = await addNewOrder({ orderData: orderObject, session });
    await editUserPurchase({
      userId: buyerId,
      orderId: savedOrder._id,
      session,
    });
    await editUserSale({ userId: sellerId, orderId: savedOrder._id, session });
    // new start
    await addNewNotification({
      notificationLink: savedOrder._id,
      notificationType: 'Order',
      notificationReceiver: sellerId,
      session,
    });
    socketApi.sendNotification(sellerId, savedOrder._id);
    // new end
    await session.commitTransaction();
    return true;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return false;
  } finally {
    session.endSession();
  }
};

export default {
  receiveWebhookEvent,
  getStripeUser,
  managePaymentIntent,
  redirectToStripe,
  onboardUser,
  assignStripeId,
  createPayout,
};
