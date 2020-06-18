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

export const constructStripeIntent = async ({
  method,
  amount,
  currency,
  fee,
  seller,
  order,
  session = null,
}) => {
  return await stripe.paymentIntents.create({
    payment_method_types: [method],
    amount: amount,
    currency: currency,
    application_fee_amount: fee,
    on_behalf_of: seller,
    transfer_data: {
      destination: seller,
    },
    metadata: {
      orderData: JSON.stringify(order),
    },
  });
};

export const updateStripeIntent = async ({
  intentId,
  amount,
  fee,
  session = null,
}) => {
  return await stripe.paymentIntents.update(intentId, {
    amount: amount,
    application_fee_amount: fee,
  });
};

export const fetchStripeBalance = async ({ stripeId, session = null }) => {
  return await stripe.balance.retrieve({ stripe_account: stripeId });
};

export const fetchStripeAccount = async ({ accountId, session = null }) => {
  return await stripe.accounts.retrieve(accountId);
};
