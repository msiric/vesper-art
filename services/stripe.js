import mongoose from 'mongoose';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const constructStripeEvent = async ({
  body,
  signature,
  secret,
  session = null,
}) => {
  return await stripe.webhooks.constructEvent(body, signature, secret);
};

export const constructStripeLink = async ({
  onboarded,
  domain,
  session = null,
}) => {
  return await stripe.accounts.createLoginLink(onboarded, {
    redirect_url: `${domain}/stripe/dashboard`,
  });
};

export const constructStripePayout = async ({
  amount,
  currency,
  descriptor,
  stripeId,
  session = null,
}) => {
  return await stripe.payouts.create(
    {
      amount: amount,
      currency: currency,
      statement_descriptor: descriptor,
    },
    {
      stripe_account: stripeId,
    }
  );
};

export const fetchStripeBalance = async ({ stripeId, session = null }) => {
  return await stripe.balance.retrieve({ stripe_account: stripeId });
};

export const fetchStripeAccount = async ({ accountId, session = null }) => {
  return await stripe.accounts.retrieve(accountId);
};
