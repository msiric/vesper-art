const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../config/secret');
const createError = require('http-errors');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const FormData = require('form-data');
const querystring = require('querystring');

const redirectToStripe = async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user.stripeId) {
      throw createError(
        400,
        'You need to complete the onboarding process before accessing your Stripe dashboard'
      );
    }
    const loginLink = await stripe.accounts.createLoginLink(user.stripeId, {
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

    console.log(expressAuthorized);

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
    const balance = await stripe.balance.retrieve({
      stripe_account: res.locals.user.stripeId,
    });
    const { amount, currency } = balance.available[0];
    await stripe.payouts.create(
      {
        amount: amount,
        currency: currency,
        statement_descriptor: config.server.appName,
      },
      {
        stripe_account: res.locals.user.stripeId,
      }
    );
    res.status(200).json({
      message: 'Payout successfully created',
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

module.exports = {
  redirectToStripe,
  onboardUser,
  assignStripeId,
  createPayout,
};
