import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const constructStripeEvent = async ({
  stripeBody,
  stripeSignature,
  stripeSecret,
}) => {
  return await stripe.webhooks.constructEvent(
    stripeBody,
    stripeSignature,
    stripeSecret
  );
};

export const constructStripeLink = async ({ accountId, serverDomain }) => {
  return await stripe.accounts.createLoginLink(accountId, {
    redirect_url: `${serverDomain}/stripe/dashboard`,
  });
};

export const constructStripePayout = async ({
  payoutAmount,
  payoutCurrency,
  payoutDescriptor,
  stripeId,
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

export const fetchStripeBalance = async ({ stripeId }) => {
  return await stripe.balance.retrieve({ stripe_account: stripeId });
};

export const fetchStripeAccount = async ({ accountId }) => {
  return await stripe.accounts.retrieve(accountId);
};
