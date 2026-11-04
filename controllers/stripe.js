import createError from "http-errors";
import { appName, featureFlags } from "../common/constants";
import {
  formatLicenseValues,
  isLicenseValid,
  isObjectEmpty,
  renderCommercialLicenses,
} from "../common/helpers";
import {
  actorsValidation,
  intentValidation,
  licenseValidation,
  orderValidation,
  priceValidation,
} from "../common/validation";
import { domain, stripe as stripeConfig } from "../config/secret";
import socketApi from "../lib/socket";
import { fetchVersionDetails } from "../services/artwork";
import { fetchDiscountById } from "../services/discount";
import { addNewNotification } from "../services/notification";
import {
  addNewOrder,
  fetchArtworkOrders,
  fetchOrderByIntent,
} from "../services/order";
import {
  constructLoginLink,
  constructRedirectLink,
  constructStripeEvent,
  constructStripeIntent,
  constructStripePayout,
  createStripeAccount,
  fetchStripeAccount,
  fetchStripeBalance,
  issueStripeRefund,
  retrieveStripeIntent,
  updateStripeIntent,
} from "../services/stripe";
import {
  addNewIntent,
  editUserOnboarded,
  editUserStripe,
  fetchIntentByParents,
  fetchUserById,
  removeExistingIntent,
} from "../services/user";
import { addNewLicense } from "../services/verifier";
import { USER_SELECTION } from "../utils/database";
import {
  dynamicError,
  formatError,
  formatResponse,
  generateUuids,
  isFullyOnboarded,
} from "../utils/helpers";
import { calculateTotalCharge } from "../utils/payment";
import { errors, responses } from "../utils/statuses";

export const isIntentPending = (intent) => {
  return intent.status !== "succeeded" && intent.status !== "canceled";
};

export const receiveWebhookEvent = async ({ signature, body, connection }) => {
  const secret = stripeConfig.webhookSecret;
  let event;

  try {
    event = await constructStripeEvent({
      body,
      signature,
      secret,
    });
  } catch (err) {
    throw createError(...formatError(dynamicError(err.message)));
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      // FEATURE FLAG - payment
      if (featureFlags.payment) {
        const intent = event.data.object;
        return await processTransaction({ intent, connection });
      }
      break;
    case "payment_intent.payment_failed":
      throw createError(...formatError(errors.paymentNotProcessed));
    default:
      return formatResponse(responses.eventReceived);
  }
};

// change method to return full stripe user but first find user
// in pg database by accountId and compare to userId passed as argument
export const getStripeUser = async ({ accountId }) => {
  const foundAccount = await fetchStripeAccount({ accountId });
  if (!isObjectEmpty(foundAccount)) {
    return {
      account: foundAccount,
    };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const managePaymentIntent = async ({
  userId,
  versionId,
  discountId,
  licenseUsage,
  licenseCompany,
  licenseType,
  connection,
}) => {
  const foundUser = await fetchUserById({
    userId,
    selection: [...USER_SELECTION["LICENSE_INFO"]()],
    connection,
  });
  if (isObjectEmpty(foundUser))
    throw createError(...formatError(errors.userNotFound));

  const foundVersion = await fetchVersionDetails({
    versionId,
    selection: [
      ...USER_SELECTION["LICENSE_INFO"]("owner"),
      ...USER_SELECTION["STRIPE_INFO"]("owner"),
    ],
    connection,
  });
  if (isObjectEmpty(foundVersion))
    throw createError(...formatError(errors.artworkNotFound));
  if (foundVersion.id !== foundVersion.artwork.currentId)
    throw createError(...formatError(errors.artworkVersionObsolete));
  if (foundVersion.artwork.owner.id === foundUser.id)
    throw createError(...formatError(errors.artworkDownloadedByOwner));

  // FEATURE FLAG - discount
  const foundDiscount =
    discountId && featureFlags.discount
      ? await fetchDiscountById({ discountId, connection })
      : {};
  if (discountId && isObjectEmpty(foundDiscount))
    throw createError(...formatError(errors.discountNotApplied));

  const foundIntent = await fetchIntentByParents({
    userId: foundUser.id,
    versionId: foundVersion.id,
    connection,
  });
  const verifiedIntent = !isObjectEmpty(foundIntent)
    ? await retrieveStripeIntent({ intentId: foundIntent.id })
    : {};
  const shouldReinitialize =
    isObjectEmpty(verifiedIntent) || !isIntentPending(verifiedIntent);
  if (shouldReinitialize && !isObjectEmpty(foundDiscount))
    throw createError(...formatError(errors.paymentNotProcessed));

  const licenseData = formatLicenseValues({
    ...(shouldReinitialize && {
      licenseAssignee: foundUser.fullName,
      licenseAssignor: foundVersion.artwork.owner.fullName,
    }),
    licenseUsage,
    licenseCompany,
    licenseType,
  });
  const validationSchema = shouldReinitialize
    ? licenseValidation.concat(actorsValidation)
    : licenseValidation;
  await validationSchema.validate({ ...licenseData });

  const availableLicenses = renderCommercialLicenses({ version: foundVersion });
  if (!availableLicenses.some((item) => item.value === licenseType))
    throw createError(...formatError(errors.artworkLicenseInvalid));

  const foundOrders = await fetchArtworkOrders({
    userId,
    artworkId: foundVersion.artwork.id,
    connection,
  });
  const licenseStatus = isLicenseValid({
    data: licenseData,
    orders: foundOrders,
  });
  if (!licenseStatus.valid)
    throw createError(...formatError(errors[licenseStatus.state.identifier]));

  const { buyerTotal, sellerTotal, platformTotal, licensePrice } =
    calculateTotalCharge({
      foundVersion,
      foundDiscount,
      licenseType: licenseData.licenseType,
    });
  const orderData = {
    ...(shouldReinitialize && {
      buyerId: foundUser.id,
      sellerId: foundVersion.artwork.owner.id,
      artworkId: foundVersion.artwork.id,
      versionId: foundVersion.id,
    }),
    discountId: !isObjectEmpty(foundDiscount) ? foundDiscount.id : null,
    spent: buyerTotal,
    earned: sellerTotal,
    fee: platformTotal,
    licenseData: {
      ...licenseData,
      licensePrice,
    },
  };

  if (!isObjectEmpty(verifiedIntent) && !isIntentPending(verifiedIntent)) {
    await removeExistingIntent({
      intentId: verifiedIntent.id,
      connection,
    });
  }
  const paymentIntent = shouldReinitialize
    ? await constructStripeIntent({
        intentMethod: "card",
        intentPaid: buyerTotal,
        intentSold: sellerTotal,
        intentCurrency: "usd",
        sellerId: foundVersion.artwork.owner.stripeId,
        orderData,
      })
    : await updateStripeIntent({
        intentPaid: buyerTotal,
        intentSold: sellerTotal,
        intentData: verifiedIntent,
        orderData,
      });
  if (shouldReinitialize) {
    await addNewIntent({
      intentId: paymentIntent.id,
      userId: foundUser.id,
      versionId: foundVersion.id,
      connection,
    });
  }
  return {
    intent: {
      id: paymentIntent.id,
      secret: paymentIntent.client_secret,
    },
  };
};

export const redirectToStripe = async ({ accountId, userId, connection }) => {
  const foundUser = await fetchUserById({
    userId,
    selection: [
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["STRIPE_INFO"](),
    ],
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    if (foundUser.onboarded && foundUser.stripeId) {
      const loginLink = await constructLoginLink({
        accountId,
        serverDomain: domain.server,
      });
      return { redirect: loginLink.url };
    }
    throw createError(...formatError(errors.stripeOnboardingIncomplete));
  }
  throw createError(...formatError(errors.userNotFound));
};

export const authorizeUser = async ({
  userBusinessAddress,
  userEmail,
  userId,
  connection,
}) => {
  const foundUser = await fetchUserById({
    userId,
    selection: [
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["STRIPE_INFO"](),
    ],
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    const linkParams = {
      account: foundUser.stripeId,
      refresh_url: `${domain.client}/onboarding`,
      return_url: `${domain.client}/onboarded`,
      type: "account_onboarding",
    };

    if (!linkParams.account) {
      const accountParams = {
        type: "express",
        country: userBusinessAddress || undefined,
        email: userEmail || undefined,
        metadata: {
          userId: foundUser.id,
        },
      };

      const createdAccount = await createStripeAccount({ accountParams });

      linkParams.account = createdAccount.id;

      await editUserStripe({
        userId: foundUser.id,
        stripeId: linkParams.account,
        connection,
      });
    }

    const redirectLink = await constructRedirectLink({ linkParams });

    return { redirect: redirectLink.url };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const onboardUser = async ({ userId, connection }) => {
  const foundUser = await fetchUserById({
    userId,
    selection: [
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["STRIPE_INFO"](),
    ],
    connection,
  });
  if (!isObjectEmpty(foundUser) && foundUser.stripeId) {
    if (!foundUser.onboarded) {
      const foundAccount = await fetchStripeAccount({
        accountId: foundUser.stripeId,
      });
      if (
        isFullyOnboarded({
          capabilities: foundAccount.capabilities,
          detailsSubmitted: foundAccount.details_submitted,
          payoutsEnabled: foundAccount.payouts_enabled,
        })
      ) {
        await editUserOnboarded({ onboarded: true, userId, connection });
        return { onboarded: true };
      }
    }
    return { onboarded: foundUser.onboarded };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const fetchIntentById = async ({ intentId }) => {
  const foundIntent = await retrieveStripeIntent({ intentId });
  if (!isObjectEmpty(foundIntent)) {
    return {
      intent: foundIntent,
    };
  }
  throw createError(...formatError(errors.intentNotFound));
};

export const createPayout = async ({ userId, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (!isObjectEmpty(foundUser) && foundUser.stripeId) {
    const balance = await fetchStripeBalance({
      stripeId: foundUser.stripeId,
    });
    const { amount, currency } = balance.available[0];
    await constructStripePayout({
      payoutAmount: amount,
      payoutCurrency: currency,
      payoutDescriptor: appName,
      stripeId: foundUser.stripeId,
    });
    return formatResponse(responses.payoutCreated);
  }
  throw createError(...formatError(errors.userNotFound));
};

const UNIQUE_VIOLATION = "23505";

const isIntentFulfilled = async ({ intentId, connection }) =>
  !isObjectEmpty(await fetchOrderByIntent({ intentId, connection }));

const fulfillOrder = async ({
  intentId,
  orderData,
  licenseId,
  orderId,
  notificationId,
  connection,
}) => {
  await addNewLicense({
    licenseId,
    artworkId: orderData.artworkId,
    licenseData: orderData.licenseData,
    userId: orderData.buyerId,
    sellerId: orderData.sellerId,
    connection,
  });
  await addNewOrder({
    orderId,
    orderData: {
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId,
      artworkId: orderData.artworkId,
      versionId: orderData.versionId,
      discountId: orderData.discountId,
      licenseId,
      reviewId: null,
      spent: orderData.spent,
      earned: orderData.earned,
      fee: orderData.fee,
      type: "commercial",
      status: "completed",
      intentId,
    },
    connection,
  });
  await removeExistingIntent({ intentId, connection });
  await addNewNotification({
    notificationId,
    notificationLink: orderId,
    notificationRef: "",
    notificationType: "order",
    notificationReceiver: orderData.sellerId,
    connection,
  });
  socketApi.sendNotification(orderData.sellerId);
};

const processTransaction = async ({ intent, connection }) => {
  const intentId = intent.id;
  if (await isIntentFulfilled({ intentId, connection }))
    return formatResponse(responses.paymentProcessed);

  try {
    const orderData = JSON.parse(intent.metadata.orderData);
    await licenseValidation
      .concat(actorsValidation)
      .concat(priceValidation)
      .validate(orderData.licenseData);
    const { licenseId, orderId, notificationId } = generateUuids({
      licenseId: null,
      orderId: null,
      notificationId: null,
    });
    await orderValidation.concat(intentValidation).validate({
      orderBuyer: orderData.buyerId,
      orderSeller: orderData.sellerId,
      orderArtwork: orderData.artworkId,
      orderVersion: orderData.versionId,
      orderDiscount: orderData.discountId,
      orderLicense: licenseId,
      orderSpent: orderData.spent,
      orderEarned: orderData.earned,
      orderFee: orderData.fee,
      orderIntent: intentId,
    });
    // The savepoint lets us recover when a parallel delivery inserts the same order first.
    await connection.transaction((manager) =>
      fulfillOrder({
        intentId,
        orderData,
        licenseId,
        orderId,
        notificationId,
        connection: manager,
      })
    );
    return formatResponse(responses.paymentProcessed);
  } catch (err) {
    if (
      err.code === UNIQUE_VIOLATION &&
      (await isIntentFulfilled({ intentId, connection }))
    )
      return formatResponse(responses.paymentProcessed);
    console.error("Transaction failed", err);
    const foundIntent = await retrieveStripeIntent({
      intentId: intent.id,
    });
    if (!isObjectEmpty(foundIntent)) {
      await issueStripeRefund({
        chargeData: foundIntent.charges.data,
      });
    }
    throw createError(...formatError(errors.orderNotProcessed));
  }
};
