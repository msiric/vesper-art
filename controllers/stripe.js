import mongoose from 'mongoose';
import { server, stripe as processor } from '../config/secret.js';
import { payment } from '../config/constants.js';
import License from '../models/license.js';
import crypto from 'crypto';
import createError from 'http-errors';
import axios from 'axios';
import FormData from 'form-data';
import querystring from 'querystring';
import currency from 'currency.js';
import {
  constructStripeEvent,
  constructStripeLink,
  constructStripePayout,
  constructStripeIntent,
  updateStripeIntent,
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
import socketApi from '../lib/socket.js';
import orderValidator from '../utils/validation/order.js';
import licenseValidator from '../utils/validation/license.js';
import { sanitizeData } from '../utils/helpers.js';

const receiveWebhookEvent = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK;

  const event = await constructStripeEvent({
    body: req.rawBody,
    secret: endpointSecret,
    signature,
  });

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await createOrder(paymentIntent);
      break;
    default:
      return res.status(400).end();
  }

  return { received: true };
};

const getStripeUser = async ({ accountId }) => {
  const foundAccount = await fetchStripeAccount({ accountId });
  return {
    capabilities: {
      cardPayments: foundAccount.capabilities.card_payments,
      platformPayments: foundAccount.capabilities.platform_payments,
    },
  };
};

// $TODO validacija licenci
const managePaymentIntent = async ({
  userId,
  artworkId,
  intentId,
  licenses,
}) => {
  const foundUser = await fetchUserDiscount({ userId });
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
        .multiply(payment.buyerFee.multiplier)
        .add(payment.buyerFee.addend);
      const sellerFee = currency(1 - payment.appFee);
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
        ? await updateStripeIntent({
            intentId,
            amount: buyerTotal.intValue,
            application_fee_amount: platformTotal.intValue,
          })
        : await constructStripeIntent({
            method: 'card',
            amount: buyerTotal.intValue,
            currency: 'usd',
            fee: platformTotal.intValue,
            seller: foundArtwork.owner.stripeId,
            order: orderData,
          });
      return {
        intent: {
          id: paymentIntent.id,
          secret: paymentIntent.client_secret,
        },
      };
    }
    throw createError(400, 'Artwork not found');
  }
  throw createError(400, 'User not found');
};

const redirectToStripe = async ({ req, userOnboarded }) => {
  if (!userOnboarded)
    throw createError(
      400,
      'You need to complete the onboarding process before accessing your Stripe dashboard'
    );
  const loginLink = await constructStripeLink({
    userOnboarded,
    domain: server.serverDomain,
  });
  if (req.query.account) loginLink.url = `${loginLink.url}#/account`;

  return { url: loginLink.url };
};

const onboardUser = async ({ req, res, country, email }) => {
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

  return {
    url: `${processor.authorizeUri}?${querystring.stringify(parameters)}`,
  };
};

const assignStripeId = async ({ req, session }) => {
  if (req.session.state != req.query.state)
    throw createError(500, 'There was an error in the onboarding process');

  const formData = new FormData();
  formData.append('grant_type', 'authorization_code');
  formData.append('client_id', processor.clientId);
  formData.append('client_secret', processor.secretKey);
  formData.append('code', req.query.code);

  const expressAuthorized = await axios.post(processor.tokenUri, formData, {
    headers: formData.getHeaders(),
  });

  if (expressAuthorized.error) throw createError(500, expressAuthorized.error);

  await editUserStripe({
    userId: req.session.id,
    stripeId: expressAuthorized.data.stripe_user_id,
    session,
  });

  const username = req.session.name;

  req.session.state = null;
  req.session.id = null;
  req.session.name = null;

  return res.redirect(`/user/${username}`);
};

const createPayout = async ({ userId }) => {
  const foundUser = await fetchUserById({ userId });
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
    return {
      message: 'Payout successfully created',
    };
  }
  throw createError(400, 'Cannot create payout for this user');
};

const createOrder = async ({ intent, session }) => {
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
    const { error } = licenseValidator(
      sanitizeData({
        licenseOwner: buyerId,
        licenseArtwork: artworkId,
        licenseType: license.licenseType,
        licensePrice: license.licensePrice,
      })
    );
    if (error) throw createError(400, error);
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
  const { error } = orderValidator(
    sanitizeData({
      orderBuyer: buyerId,
      orderSeller: sellerId,
      orderArtwork: artworkId,
      orderVersion: versionId,
      orderDiscount: discountId,
      orderLicenses: licenseIds,
      orderSpent: orderData.spent,
      orderEarned: orderData.earned,
      orderFee: orderData.fee,
      orderIntent: intentId,
    })
  );
  if (error) throw createError(400, error);
  const orderObject = {
    buyer: buyerId,
    seller: sellerId,
    artwork: artworkId,
    version: versionId,
    discount: discountId,
    licenses: licenseIds,
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
    notificationType: 'order',
    notificationReceiver: sellerId,
    session,
  });
  socketApi.sendNotification(sellerId, savedOrder._id);
  // new end
  return true;
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
