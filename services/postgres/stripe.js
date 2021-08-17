import { stripe } from "../../lib/stripe";

export const constructStripeEvent = async ({
  stripeBody,
  stripeSignature,
  stripeSecret,
  connection,
}) => {
  const constructedEvent = await stripe.webhooks.constructEvent(
    stripeBody,
    stripeSignature,
    stripeSecret
  );
  return constructedEvent;
};

export const constructStripeLink = async ({
  accountId,
  serverDomain,
  connection,
}) => {
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
  connection,
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

// ovo je test za novi checkout (trenutno delayed)
export const retrieveStripeIntent = async ({ intentId, connection }) => {
  const foundIntent = await stripe.paymentIntents.retrieve(intentId);
  console.log(foundIntent);
  return foundIntent;
};

export const constructStripeIntent = async ({
  intentMethod,
  intentAmount,
  intentCurrency,
  intentFee,
  sellerId,
  orderData,
  connection,
}) => {
  console.log(
    "construct",
    intentMethod,
    intentAmount,
    intentCurrency,
    intentFee,
    sellerId,
    orderData
  );
  const createdIntent = await stripe.paymentIntents.create({
    payment_method_types: [intentMethod],
    amount: intentAmount,
    currency: intentCurrency,
    application_fee_amount: intentFee,
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
  intentData,
  intentAmount,
  intentFee,
  orderData,
  connection,
}) => {
  const foundOrder = JSON.parse(intentData.metadata.orderData);
  const updatedIntent = await stripe.paymentIntents.update(intentData.id, {
    amount: intentAmount,
    application_fee_amount: intentFee,
    metadata: {
      orderData: JSON.stringify({
        ...foundOrder,
        ...orderData,
        licenseData: { ...foundOrder.licenseData, ...orderData.licenseData },
      }),
    },
  });
  return updatedIntent;
};

export const fetchStripeBalance = async ({ stripeId, connection }) => {
  const retrievedBalance = await stripe.balance.retrieve({
    stripe_account: stripeId,
  });
  return retrievedBalance;
};

export const fetchStripeAccount = async ({ accountId, connection }) => {
  const retrievedAccount = await stripe.accounts.retrieve(accountId);
  return retrievedAccount;
};

export const issueStripeRefund = async ({ chargeData, connection }) => {
  if (chargeData.length) {
    const refundedCharge = await stripe.refunds.create({
      charge: chargeData[0].id,
      reverse_transfer: true,
      refund_application_fee: true,
    });
    return refundedCharge;
  } else {
    return {};
  }
};
