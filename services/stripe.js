import mongoose from 'mongoose';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const constructStripeEvent = async ({
  stripeBody,
  stripeSignature,
  stripeSecret,
  session = null,
}) => {
  return await stripe.webhooks.constructEvent(
    stripeBody,
    stripeSignature,
    stripeSecret
  );
};

export const constructStripeLink = async ({
  userOnboarded,
  serverDomain,
  session = null,
}) => {
  return await stripe.accounts.createLoginLink(userOnboarded, {
    redirect_url: `${serverDomain}/stripe/dashboard`,
  });
};

export const constructStripePayout = async ({
  payoutAmount,
  payoutCurrency,
  payoutDescriptor,
  stripeId,
  session = null,
}) => {
  return await stripe.payouts.create(
    {
      amount: payoutAmount,
      currency: payoutCurrency,
      statement_descriptor: payoutDescriptor,
    },
    {
      stripe_account: stripeId,
    }
  );
};

export const constructStripeIntent = async ({
  intentMethod,
  intentAmount,
  intentCurrency,
  intentFee,
  sellerId,
  orderData,
  session = null,
}) => {
  return await stripe.paymentIntents.create({
    payment_method_types: [intentMethod],
    amount: intentAmount,
    currency: intentCurrency,
    application_fee_amount: intentFee,
    on_behalf_of: sellerId,
    transfer_data: {
      destination: sellerId,
    },
    metadata: {
      orderData: JSON.stringify(orderData),
    },
  });
};

export const updateStripeIntent = async ({
  intentId,
  intentAmount,
  intentFee,
  session = null,
}) => {
  return await stripe.paymentIntents.update(intentId, {
    amount: intentAmount,
    application_fee_amount: intentFee,
  });
};

export const fetchStripeBalance = async ({ stripeId, session = null }) => {
  return await stripe.balance.retrieve({ stripe_account: stripeId });
};

export const fetchStripeAccount = async ({ accountId, session = null }) => {
  return await stripe.accounts.retrieve(accountId);
};
