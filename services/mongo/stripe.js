import Stripe from "stripe";
import { stripe as stripeConfig } from "../../config/secret";

const stripe = Stripe(stripeConfig.stripeSecret);

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
  accountId,
  serverDomain,
  session = null,
}) => {
  return await stripe.accounts.createLoginLink(accountId, {
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
  orderData,
  session = null,
}) => {
  const foundIntent = await stripe.paymentIntents.retrieve(intentId);
  const foundOrder = JSON.parse(foundIntent.metadata.orderData);
  for (let item in orderData) {
    foundOrder[item] = orderData[item];
  }
  return await stripe.paymentIntents.update(intentId, {
    amount: intentAmount,
    application_fee_amount: intentFee,
    metadata: {
      orderData: JSON.stringify(foundOrder),
    },
  });
};

export const fetchStripeBalance = async ({ stripeId, session = null }) => {
  return await stripe.balance.retrieve({ stripe_account: stripeId });
};

export const fetchStripeAccount = async ({ accountId, session = null }) => {
  return await stripe.accounts.retrieve(accountId);
};
