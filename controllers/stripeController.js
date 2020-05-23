const mongoose = require('mongoose');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const config = require('../config/secret');
const Order = require('../models/order');
const License = require('../models/license');
const Notification = require('../models/notification');
const crypto = require('crypto');
const createError = require('http-errors');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const FormData = require('form-data');
const querystring = require('querystring');
const currency = require('currency.js');
const { socketApi } = require('../realtime/io');

const receiveWebhookEvent = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK;

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      endpointSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await createOrder(paymentIntent);
        break;
      default:
        return res.status(400).end();
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getStripeUser = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const foundAccount = await stripe.accounts.retrieve(accountId);

    res.status(200).json({
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
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).populate('discount');
    if (foundUser) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }],
      })
        .populate('owner')
        .populate(
          'current',
          '_id cover created title personal type license availability description use commercial'
        );
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
    const user = res.locals.user;
    if (!user.onboarded) {
      throw createError(
        400,
        'You need to complete the onboarding process before accessing your Stripe dashboard'
      );
    }
    const loginLink = await stripe.accounts.createLoginLink(user.onboarded, {
      redirect_url: `${config.server.serverDomain}/stripe/dashboard`,
    });
    if (req.query.account) {
      loginLink.url = `${loginLink.url}#/account`;
    }
    return res.status(200).json({
      url: loginLink.url,
    });
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

    let parameters = {
      client_id: config.stripe.clientId,
      state: req.session.state,
    };

    parameters = Object.assign(parameters, {
      redirect_uri: `${config.server.serverDomain}/stripe/token`,
      'stripe_user[business_type]': 'individual',
      'stripe_user[business_name]': undefined,
      'stripe_user[first_name]': undefined,
      'stripe_user[last_name]': undefined,
      'stripe_user[email]': email || undefined,
      'stripe_user[country]': country || undefined,

      // If we're suggesting this account have the `card_payments` capability,
      // we can pass some additional fields to prefill:
      // 'suggested_capabilities[]': 'card_payments',
      // 'stripe_user[street_address]': req.user.address || undefined,
      // 'stripe_user[city]': req.user.city || undefined,
      // 'stripe_user[zip]': req.user.postalCode || undefined,
      // 'stripe_user[state]': req.user.city || undefined,
    });

    /* return res.status(200).json({
      url: `${config.stripe.authorizeUri}?${querystring.stringify(parameters)}`,
    }); */

    return res.status(200).json({
      url: `${config.stripe.authorizeUri}?${querystring.stringify(parameters)}`,
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
    formData.append('client_id', config.stripe.clientId);
    formData.append('client_secret', config.stripe.secretKey);
    formData.append('code', req.query.code);

    const expressAuthorized = await axios.post(
      config.stripe.tokenUri,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (expressAuthorized.error) {
      console.log(expressAuthorized.error);
      throw createError(500, expressAuthorized.error);
    }

    await User.updateOne(
      { _id: req.session.id },
      { stripeId: expressAuthorized.data.stripe_user_id }
    ).session(session);

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
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    });
    if (foundUser.stripeId) {
      const balance = await stripe.balance.retrieve({
        stripe_account: foundUser.stripeId,
      });
      const { amount, currency } = balance.available[0];
      await stripe.payouts.create(
        {
          amount: amount,
          currency: currency,
          statement_descriptor: config.server.appName,
        },
        {
          stripe_account: foundUser.stripeId,
        }
      );
      res.status(200).json({
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
    const intentId = intent.id;
    // $TODO notification
    const buyerId = mongoose.Types.ObjectId(orderData.buyerId);
    const sellerId = mongoose.Types.ObjectId(orderData.sellerId);
    const artworkId = mongoose.Types.ObjectId(orderData.artworkId);
    const versionId = mongoose.Types.ObjectId(orderData.versionId);
    const discountId = mongoose.Types.ObjectId(orderData.discountId);
    const licenseSet = [];
    const licenseIds = [];
    orderData.licenses.forEach(async (license) => {
      const newLicense = new License();
      newLicense.owner = buyerId;
      newLicense.artwork = artworkId;
      newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
      newLicense.type = license.licenseType;
      newLicense.active = true;
      newLicense.price = license.licensePrice;
      licenseSet.push(newLicense);
    });
    const savedLicenses = await License.insertMany(licenseSet, { session });
    savedLicenses.forEach((license) => {
      licenseIds.push(license._id);
    });
    const newOrder = new Order();
    newOrder.buyer = buyerId;
    newOrder.seller = sellerId;
    newOrder.artwork = artworkId;
    newOrder.version = versionId;
    newOrder.discount = discountId;
    newOrder.licenses = licenseIds;
    newOrder.review = null;
    newOrder.spent = orderData.spent;
    newOrder.earned = orderData.earned;
    newOrder.fee = orderData.fee;
    newOrder.status = 'completed';
    newOrder.intent = intentId;
    const savedOrder = await newOrder.save({ session });
    await User.updateOne(
      { _id: buyerId },
      { $push: { purchases: savedOrder._id } }
    ).session(session);
    await User.updateOne(
      { _id: sellerId },
      { $push: { sales: savedOrder._id }, $inc: { notifications: 1 } }
    ).session(session);
    // new start
    const newNotification = new Notification();
    newNotification.link = savedOrder._id;
    newNotification.type = 'Order';
    newNotification.receiver = sellerId;
    newNotification.read = false;
    await newNotification.save({ session });
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

module.exports = {
  receiveWebhookEvent,
  getStripeUser,
  managePaymentIntent,
  redirectToStripe,
  onboardUser,
  assignStripeId,
  createPayout,
};
