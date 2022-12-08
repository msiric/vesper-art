import { stripe } from "../lib/stripe";

export const constructStripeEvent = async ({ body, signature, secret }) => {
  const constructedEvent = await stripe.webhooks.constructEvent(
    body,
    signature,
    secret
  );
  return constructedEvent;
};

export const constructLoginLink = async ({ accountId, serverDomain }) => {
  const createdLink = await stripe.accounts.createLoginLink(accountId, {
    redirect_url: `${serverDomain}/stripe/dashboard`,
  });
  return createdLink;
};

export const constructRedirectLink = async ({ linkParams }) => {
  const createdLink = await stripe.accountLinks.create(linkParams);
  return createdLink;
};

export const createStripeAccount = async ({ accountParams }) => {
  const createdAccount = await stripe.accounts.create(accountParams);
  return createdAccount;
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

// ovo je test za novi checkout (trenutno delayed)
export const retrieveStripeIntent = async ({ intentId }) => {
  const foundIntent = await stripe.paymentIntents.retrieve(intentId);
  return foundIntent;
};

export const constructStripeIntent = async ({
  intentMethod,
  intentPaid,
  intentSold,
  intentCurrency,
  sellerId,
  orderData,
}) => {
  const createdIntent = await stripe.paymentIntents.create({
    payment_method_types: [intentMethod],
    amount: intentPaid,
    currency: intentCurrency,
    transfer_data: {
      amount: intentSold,
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
  intentPaid,
  intentSold,
  orderData,
}) => {
  const foundOrder = JSON.parse(intentData.metadata.orderData);
  const updatedIntent = await stripe.paymentIntents.update(intentData.id, {
    amount: intentPaid,
    transfer_data: {
      ...intentData.transfer_data,
      amount: intentSold,
    },
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

export const issueStripeRefund = async ({ chargeData }) => {
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

export const deleteStripeAccount = async ({ stripeId }) => {
  await stripe.accounts.del(stripeId);
};
