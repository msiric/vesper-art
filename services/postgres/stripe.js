import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const constructStripeEvent = async ({
  stripeBody,
  stripeSignature,
  stripeSecret,
}) => {
  const constructedEvent = await stripe.webhooks.constructEvent(
    stripeBody,
    stripeSignature,
    stripeSecret
  );
  return constructedEvent;
};

export const constructStripeLink = async ({ accountId, serverDomain }) => {
  const createdLink = await stripe.accounts.createLoginLink(accountId, {
    redirect_url: `${serverDomain}/stripe/dashboard`,
  });
  return createdLink;
};

export const constructStripePayout = async ({
  payoutAmount,
  payoutCurrency,
  payoutDescriptor,
  stripeId,
}) => {
  const createdPayout = await stripe.payouts.create(
    {
      amount: payoutAmount,
      currency: payoutCurrency,
      statement_descriptor: payoutDescriptor,
    },
    {
      stripe_account: stripeId,
    }
  );
  return createdPayout;
};

export const constructStripeIntent = async ({
  intentMethod,
  intentAmount,
  intentCurrency,
  intentFee,
  sellerId,
  orderData,
}) => {
  const createdIntent = await stripe.paymentIntents.create({
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
  return createdIntent;
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
  const updatedIntent = await stripe.paymentIntents.update(intentId, {
    amount: intentAmount,
    application_fee_amount: intentFee,
    metadata: {
      orderData: JSON.stringify(foundOrder),
    },
  });
  return updatedIntent;
};

export const fetchStripeBalance = async ({ stripeId }) => {
  const retrievedBalance = await stripe.balance.retrieve({
    stripe_account: stripeId,
  });
  return retrievedBalance;
};

export const fetchStripeAccount = async ({ accountId }) => {
  const retrievedAccount = await stripe.accounts.retrieve(accountId);
  return retrievedAccount;
};
