import axios from 'axios';
import crypto from 'crypto';
import currency from 'currency.js';
import FormData from 'form-data';
import createError from 'http-errors';
import mongoose from 'mongoose';
import querystring from 'querystring';
import { payment } from '../config/constants.js';
import { server, stripe as processor } from '../config/secret.js';
import socketApi from '../lib/socket.js';
import License from '../models/license.js';
import { fetchArtworkDetails } from '../services/artwork.js';
import { addNewNotification } from '../services/notification.js';
import { addNewOrder } from '../services/order.js';
import {
  constructStripeEvent,
  constructStripeIntent,
  constructStripeLink,
  constructStripePayout,
  fetchStripeAccount,
  fetchStripeBalance,
  updateStripeIntent,
} from '../services/stripe.js';
import {
  editUserPurchase,
  editUserSale,
  editUserStripe,
  fetchUserDiscount,
} from '../services/user.js';
import { sanitizeData } from '../utils/helpers.js';
import licenseValidator from '../validation/license.js';
import orderValidator from '../validation/order.js';

export const receiveWebhookEvent = async ({
  stripeSignature,
  stripeBody,
  session,
}) => {
  const stripeSecret = process.env.STRIPE_WEBHOOK;
  const stripeEvent = await constructStripeEvent({
    stripeBody,
    stripeSecret,
    stripeSignature,
  });

  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = stripeEvent.data.object;
      await processTransaction({ stripeIntent: paymentIntent, session });
      break;
    default:
      throw createError(400, 'Invalid Stripe event');
  }

  return { received: true };
};

export const getStripeUser = async ({ accountId }) => {
  const foundAccount = await fetchStripeAccount({ accountId });
  return {
    capabilities: {
      cardPayments: foundAccount.capabilities.card_payments,
      // $TODO foundAccount.capabilities.platform_payments (platform_payments are deprecated, now called "transfers")
      platformPayments: foundAccount.capabilities.transfers,
    },
  };
};

// $TODO validacija licenci
export const managePaymentIntent = async ({
  userId,
  artworkId,
  intentId,
  artworkLicense,
  session,
}) => {
  const foundUser = await fetchUserDiscount({ userId, session });
  if (foundUser) {
    const foundArtwork = await fetchArtworkDetails({ artworkId, session });
    if (foundArtwork) {
      // $TODO Bolje sredit validaciju
      const licensePrice =
        artworkLicense.type === 'personal'
          ? foundArtwork.current.personal
          : artworkLicense.type === 'commercial'
          ? foundArtwork.current.commercial
          : 0;
      const buyerFee = currency(licensePrice)
        .multiply(payment.buyerFee.multiplier)
        .add(payment.buyerFee.addend);
      const sellerFee = currency(1 - payment.appFee);
      const discount = foundUser.discount
        ? currency(licensePrice).multiply(foundUser.discount.discount)
        : 0;
      const buyerTotal = currency(licensePrice)
        .subtract(discount)
        .add(buyerFee);
      const sellerTotal = currency(licensePrice).multiply(sellerFee);
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
        licenseData: {
          licenseAssignee: artworkLicense.assignee,
          licenseCompany: artworkLicense.company,
          licenseType: artworkLicense.type,
          licensePrice: foundArtwork.current[artworkLicense.type],
        },
      };
      const paymentIntent = intentId
        ? await updateStripeIntent({
            intentId,
            amount: buyerTotal.intValue,
            application_fee_amount: platformTotal.intValue,
            session,
          })
        : await constructStripeIntent({
            intentMethod: 'card',
            intentAmount: buyerTotal.intValue,
            intentCurrency: 'usd',
            intentFee: platformTotal.intValue,
            sellerId: foundArtwork.owner.stripeId,
            orderData: orderData,
            session,
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

export const redirectToStripe = async ({ userAccount, userOnboarded }) => {
  if (!userOnboarded)
    throw createError(
      400,
      'You need to complete the onboarding process before accessing your Stripe dashboard'
    );
  const loginLink = await constructStripeLink({
    userOnboarded,
    serverDomain: server.serverDomain,
  });
  if (userAccount) loginLink.url = `${loginLink.url}#/account`;

  return { url: loginLink.url };
};

export const onboardUser = async ({
  sessionData,
  responseData,
  userOrigin,
  userEmail,
}) => {
  sessionData.state = Math.random().toString(36).slice(2);
  sessionData.id = responseData.user.id;
  sessionData.name = responseData.user.name;

  const parameters = {
    client_id: processor.clientId,
    state: sessionData.state,
    redirect_uri: `${server.serverDomain}/stripe/token`,
    'stripe_user[business_type]': 'individual',
    'stripe_user[business_name]': undefined,
    'stripe_user[first_name]': undefined,
    'stripe_user[last_name]': undefined,
    'stripe_user[email]': userEmail || undefined,
    'stripe_user[country]': userOrigin || undefined,
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

export const assignStripeId = async ({
  responseObject,
  sessionData,
  queryData,
  session,
}) => {
  if (sessionData.state != queryData.state)
    throw createError(500, 'There was an error in the onboarding process');

  const formData = new FormData();
  formData.append('grant_type', 'authorization_code');
  formData.append('client_id', processor.clientId);
  formData.append('client_secret', processor.secretKey);
  formData.append('code', queryData.code);

  const expressAuthorized = await axios.post(processor.tokenUri, formData, {
    headers: formData.getHeaders(),
  });

  if (expressAuthorized.error) throw createError(500, expressAuthorized.error);

  await editUserStripe({
    userId: sessionData.id,
    stripeId: expressAuthorized.data.stripe_user_id,
    session,
  });

  const username = sessionData.name;

  sessionData.state = null;
  sessionData.id = null;
  sessionData.name = null;

  return responseObject.redirect(`http://localhost:3000/user/${username}`);
};

export const createPayout = async ({ userId, session }) => {
  const foundUser = await fetchUserById({ userId, session });
  if (foundUser.stripeId) {
    const balance = await fetchStripeBalance({
      stripeId: foundUser.stripeId,
      session,
    });
    const { amount, currency } = balance.available[0];
    await constructStripePayout({
      payoutAmount: amount,
      payoutCurrency: currency,
      payoutDescriptor: server.appName,
      stripeId: foundUser.stripeId,
      session,
    });
    return {
      message: 'Payout successfully created',
    };
  }
  throw createError(400, 'Cannot create payout for this user');
};

const processTransaction = async ({ stripeIntent, session }) => {
  const orderData = JSON.parse(stripeIntent.metadata.orderData);
  const buyerId = mongoose.Types.ObjectId(orderData.buyerId);
  const sellerId = mongoose.Types.ObjectId(orderData.sellerId);
  const artworkId = mongoose.Types.ObjectId(orderData.artworkId);
  const versionId = mongoose.Types.ObjectId(orderData.versionId);
  const discountId = mongoose.Types.ObjectId(orderData.discountId);
  const intentId = stripeIntent.id;
  const {
    licenseAssignee,
    licenseCompany,
    licenseType,
    licensePrice,
  } = orderData.licenseData;
  const { licenseError } = licenseValidator(
    sanitizeData({
      licenseOwner: buyerId,
      licenseArtwork: artworkId,
      licenseAssignee,
      licenseCompany,
      licenseType,
      licensePrice,
    })
  );
  if (licenseError) throw createError(400, licenseError);
  const newLicense = new License();
  newLicense.owner = buyerId;
  newLicense.artwork = artworkId;
  newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
  newLicense.assignee = licenseAssignee;
  newLicense.company = licenseCompany;
  newLicense.type = licenseType;
  newLicense.active = true;
  newLicense.price = licensePrice;
  const savedLicense = await newLicense.save({ session });
  const { orderError } = orderValidator(
    sanitizeData({
      orderBuyer: buyerId,
      orderSeller: sellerId,
      orderArtwork: artworkId,
      orderVersion: versionId,
      orderDiscount: discountId,
      orderLicense: savedLicense._id,
      orderSpent: orderData.spent,
      orderEarned: orderData.earned,
      orderFee: orderData.fee,
      orderIntent: intentId,
    })
  );
  if (orderError) throw createError(400, orderError);
  const orderObject = {
    buyerId,
    sellerId,
    artworkId,
    versionId,
    discountId,
    licenseId: savedLicense._id,
    review: null,
    spent: orderData.spent,
    earned: orderData.earned,
    fee: orderData.fee,
    status: 'completed',
    intentId: intentId,
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
