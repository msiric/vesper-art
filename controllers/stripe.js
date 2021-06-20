import axios from "axios";
import FormData from "form-data";
import createError from "http-errors";
import querystring from "querystring";
import * as Yup from "yup";
import { appName, errors } from "../common/constants";
import { isObjectEmpty, renderCommercialLicenses } from "../common/helpers";
import { licenseValidation, orderValidation } from "../common/validation";
import { domain, stripe as processor } from "../config/secret.js";
import socketApi from "../lib/socket";
import { fetchVersionDetails } from "../services/postgres/artwork.js";
import {
  fetchDiscountByCode,
  fetchDiscountById,
} from "../services/postgres/discount.js";
import { addNewLicense } from "../services/postgres/license";
import { addNewNotification } from "../services/postgres/notification";
import { addNewOrder } from "../services/postgres/order.js";
import {
  constructStripeEvent,
  constructStripeIntent,
  constructStripeLink,
  constructStripePayout,
  fetchStripeAccount,
  fetchStripeBalance,
  issueStripeRefund,
  retrieveStripeIntent,
  updateStripeIntent,
} from "../services/postgres/stripe.js";
import {
  addNewIntent,
  editUserStripe,
  fetchIntentByParents,
  fetchUserById,
  removeExistingIntent,
} from "../services/postgres/user.js";
import { generateUuids } from "../utils/helpers.js";
import { calculateTotalCharge } from "../utils/payment";

export const isIntentPending = (intent) => {
  return intent.status !== "succeeded" && intent.status !== "canceled";
};

export const receiveWebhookEvent = async ({
  stripeSignature,
  stripeBody,
  connection,
}) => {
  console.log("$TEST CHECKOUT RECEIVED WEBHOOK");
  const stripeSecret = process.env.STRIPE_WEBHOOK;
  let stripeEvent;

  try {
    stripeEvent = await constructStripeEvent({
      stripeBody,
      stripeSecret,
      stripeSignature,
    });
  } catch (err) {
    console.log("$TEST CHECKOUT event error");
  }

  console.log("$TEST CHECKOUT stripe event", stripeEvent.type);

  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      console.log("$TEST CHECKOUT Payment success");
      const paymentIntent = stripeEvent.data.object;
      await processTransaction({ stripeIntent: paymentIntent, connection });
      break;
    case "payment_intent.failed":
      console.log("$TEST CHECKOUT Failed payment");
      break;
    default:
      console.log("$TEST CHECKOUT Invalid event");
  }

  console.log("$TEST CHECKOUT done");
  return { message: "Event received" };
};

export const getStripeUser = async ({ accountId }) => {
  const foundAccount = await fetchStripeAccount({ accountId });
  return {
    capabilities: {
      cardPayments: foundAccount.capabilities.card_payments,
      // $TODO foundAccount.capabilities.platform_payments (platform_payments are deprecated, now called "transfers")
      platformPayments: foundAccount.capabilities.transfers,
    },
  };
};

// $TODO just inserted needs heavy testing
export const applyDiscount = async ({
  userId,
  versionId,
  discountCode,
  licenseType,
  connection,
}) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    const foundDiscount = await fetchDiscountByCode({
      discountCode,
      connection,
    });
    if (!isObjectEmpty(foundDiscount)) {
      const foundVersion = await fetchVersionDetails({ versionId, connection });
      await Yup.reach(licenseValidation, "licenseType").validate(licenseType);
      if (foundVersion) {
        if (foundVersion.artwork.active) {
          if (foundVersion.id === foundVersion.artwork.currentId) {
            if (foundVersion.artwork.owner.id !== foundUser.id) {
              const foundIntent = await fetchIntentByParents({
                userId: foundUser.id,
                versionId: foundVersion.id,
                connection,
              });
              if (!isObjectEmpty(foundIntent)) {
                const { buyerTotal, sellerTotal, platformTotal, licensePrice } =
                  calculateTotalCharge({
                    foundVersion,
                    foundDiscount,
                    licenseType,
                  });
                const orderData = {
                  discountId: foundDiscount.id,
                  spent: buyerTotal,
                  earned: sellerTotal,
                  fee: platformTotal,
                };
                const paymentIntent = await updateStripeIntent({
                  intentAmount: buyerTotal,
                  intentFee: platformTotal,
                  intentId: foundIntent.id,
                  orderData,
                  connection,
                });
                return {
                  discount: foundDiscount,
                  intent: {
                    id: paymentIntent.id,
                    secret: paymentIntent.client_secret,
                  },
                };
              }
              throw createError(
                errors.internalError,
                "Could not apply discount"
              );
            }
            throw createError(
              errors.badRequest,
              "You are the owner of this artwork"
            );
          }
          throw createError(errors.badRequest, "Artwork version is obsolete");
        }
        throw createError(errors.gone, "Artwork is no longer active");
      }
      throw createError(errors.notFound, "Artwork not found");
    }
    throw createError(errors.notFound, "Discount not found");
  }
  throw createError(errors.notFound, "User not found");
};

// $TODO validacija licenci
export const managePaymentIntent = async ({
  userId,
  versionId,
  discountId,
  artworkLicense,
  connection,
}) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    const foundVersion = await fetchVersionDetails({ versionId, connection });
    if (foundVersion) {
      if (foundVersion.artwork.active) {
        if (foundVersion.id === foundVersion.artwork.currentId) {
          if (foundVersion.artwork.owner.id !== foundUser.id) {
            const foundDiscount = discountId
              ? await fetchDiscountById({ discountId, connection })
              : {};
            if (!(discountId && isObjectEmpty(foundDiscount))) {
              const foundIntent = await fetchIntentByParents({
                userId: foundUser.id,
                versionId: foundVersion.id,
                connection,
              });
              const verifiedIntent = !isObjectEmpty(foundIntent)
                ? await retrieveStripeIntent({
                    intentId: foundIntent.id,
                    connection,
                  })
                : {};
              const shouldReinitialize =
                isObjectEmpty(verifiedIntent) ||
                !isIntentPending(verifiedIntent);
              if (!(shouldReinitialize && !isObjectEmpty(foundDiscount))) {
                const licenseData = shouldReinitialize
                  ? {
                      licenseAssignee: artworkLicense.assignee,
                      licenseCompany: artworkLicense.company,
                      licenseType: artworkLicense.type,
                    }
                  : { licenseType: artworkLicense.type };
                const availableLicenses = renderCommercialLicenses({
                  version: foundVersion,
                });
                if (
                  availableLicenses.some(
                    (item) => item.value === artworkLicense.type
                  )
                ) {
                  shouldReinitialize
                    ? await licenseValidation.validate({
                        ...licenseData,
                      })
                    : await Yup.reach(
                        licenseValidation,
                        "licenseType"
                      ).validate(licenseData.licenseType);
                  const {
                    buyerTotal,
                    sellerTotal,
                    platformTotal,
                    licensePrice,
                  } = calculateTotalCharge({
                    foundVersion,
                    foundDiscount,
                    licenseType: licenseData.licenseType,
                  });
                  const orderData = {
                    ...(shouldReinitialize && { buyerId: foundUser.id }),
                    ...(shouldReinitialize && {
                      sellerId: foundVersion.artwork.owner.id,
                    }),
                    ...(shouldReinitialize && {
                      artworkId: foundVersion.artwork.id,
                    }),
                    ...(shouldReinitialize && {
                      versionId: foundVersion.id,
                    }),
                    discountId: !isObjectEmpty(foundDiscount)
                      ? foundDiscount.id
                      : null,
                    spent: buyerTotal,
                    earned: sellerTotal,
                    fee: platformTotal,
                    licenseData: {
                      ...licenseData,
                      licensePrice: licensePrice,
                    },
                  };
                  // remove succeeded/canceled intent
                  if (
                    !isObjectEmpty(verifiedIntent) &&
                    !isIntentPending(verifiedIntent)
                  ) {
                    await removeExistingIntent({
                      intentId: verifiedIntent.id,
                      connection,
                    });
                  }
                  const paymentIntent = shouldReinitialize
                    ? await constructStripeIntent({
                        intentMethod: "card",
                        intentAmount: buyerTotal,
                        intentCurrency: "usd",
                        intentFee: platformTotal,
                        sellerId: foundVersion.artwork.owner.stripeId,
                        orderData,
                        connection,
                      })
                    : await updateStripeIntent({
                        intentAmount: buyerTotal,
                        intentFee: platformTotal,
                        intentData: verifiedIntent,
                        orderData,
                        connection,
                      });
                  // $TODO delete intent in the db if it succeeded or got canceled already
                  const savedIntent =
                    shouldReinitialize &&
                    (await addNewIntent({
                      intentId: paymentIntent.id,
                      userId: foundUser.id,
                      versionId: foundVersion.id,
                      connection,
                    }));
                  return {
                    intent: {
                      id: paymentIntent.id,
                      secret: paymentIntent.client_secret,
                    },
                  };
                }
                throw createError(errors.badRequest, "License is not valid");
              }
              throw createError(
                errors.internalError,
                "Could not process the payment"
              );
            }
            throw createError(errors.internalError, "Could not apply discount");
          }
          throw createError(
            errors.badRequest,
            "You are the owner of this artwork"
          );
        }
        throw createError(errors.badRequest, "Artwork version is obsolete");
      }
      throw createError(errors.gone, "Artwork is no longer active");
    }
    throw createError(errors.notFound, "Artwork not found");
  }
  throw createError(errors.notFound, "User not found");
};

export const redirectToStripe = async ({
  accountId,
  userOnboarded,
  connection,
}) => {
  if (!userOnboarded)
    throw createError(
      errors.unprocessable,
      "You need to complete the onboarding process before accessing your Stripe dashboard"
    );
  const loginLink = await constructStripeLink({
    accountId,
    serverDomain: domain.server,
  });

  return { url: loginLink.url };
};

export const onboardUser = async ({
  sessionData,
  responseData,
  userBusinessAddress,
  userEmail,
  connection,
}) => {
  sessionData.state = Math.random().toString(36).slice(2);
  sessionData.id = responseData.user.id;
  sessionData.name = responseData.user.name;

  const parameters = {
    client_id: processor.clientId,
    state: sessionData.state,
    redirect_uri: `${domain.server}/stripe/token`,
    "stripe_user[business_type]": "individual",
    "stripe_user[business_name]": undefined,
    "stripe_user[first_name]": undefined,
    "stripe_user[last_name]": undefined,
    "stripe_user[email]": userEmail || undefined,
    "stripe_user[country]": userBusinessAddress || undefined,
  };

  // If we're suggesting this account have the `card_payments` capability,
  // we can pass some additional fields to prefill:
  // 'suggested_capabilities[]': 'card_payments',
  // 'stripe_user[street_address]': req.user.address || undefined,
  // 'stripe_user[city]': req.user.city || undefined,
  // 'stripe_user[zip]': req.user.postalCode || undefined,
  // 'stripe_user[state]': req.user.city || undefined,

  return {
    url: `${processor.authorizeUri}?${querystring.stringify(parameters)}`,
  };
};

// $TODO cannot send headers (treba dobro testat)
export const assignStripeId = async ({
  sessionData,
  queryData,
  connection,
}) => {
  if (sessionData.state != queryData.state)
    throw createError(
      errors.internalError,
      "There was an error in the onboarding process"
    );

  const formData = new FormData();
  formData.append("grant_type", "authorization_code");
  formData.append("client_id", processor.clientId);
  formData.append("client_secret", processor.secretKey);
  formData.append("code", queryData.code);

  const expressAuthorized = await axios.post(processor.tokenUri, formData, {
    headers: formData.getHeaders(),
  });

  if (expressAuthorized.error)
    throw createError(errors.internalError, expressAuthorized.error);

  await editUserStripe({
    userId: sessionData.id,
    stripeId: expressAuthorized.data.stripe_user_id,
    connection,
  });

  const username = sessionData.name;

  sessionData.state = null;
  sessionData.id = null;
  sessionData.name = null;

  return { redirect: `${domain.client}/user/${username}` };
};

export const fetchIntentById = async ({ userId, intentId, connection }) => {
  const foundIntent = await retrieveStripeIntent({ intentId, connection });
  if (!isObjectEmpty(foundIntent)) {
    return {
      intent: foundIntent,
    };
  }
  throw createError(errors.notFound, "Intent not found");
};

export const createPayout = async ({ userId, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser.stripeId) {
    const balance = await fetchStripeBalance({
      stripeId: foundUser.stripeId,
      connection,
    });
    const { amount, currency } = balance.available[0];
    await constructStripePayout({
      payoutAmount: amount,
      payoutCurrency: currency,
      payoutDescriptor: appName,
      stripeId: foundUser.stripeId,
      connection,
    });
    return {
      message: "Payout successfully created",
    };
  }
  throw createError(errors.notFound, "User not found");
};

// $TODO not good
// $TODO validacija svih ID-ova
// $TODO validacija license i pricea
// vjerojatno najbolje fetchat svaki od ID-ova i verifyat data-u
const processTransaction = async ({ stripeIntent, connection }) => {
  try {
    console.log("PROCESS TRANSACTION STARTED");
    const orderData = JSON.parse(stripeIntent.metadata.orderData);
    const buyerId = orderData.buyerId;
    const sellerId = orderData.sellerId;
    const artworkId = orderData.artworkId;
    const versionId = orderData.versionId;
    const discountId = orderData.discountId;
    const intentId = stripeIntent.id;
    console.log("IDS DECODED");
    const { licenseAssignee, licenseCompany, licenseType, licensePrice } =
      orderData.licenseData;
    await licenseValidation.validate({
      licenseAssignee,
      licenseCompany,
      licenseType,
    });
    console.log("LICENSE VALIDATED");
    const { licenseId, orderId, notificationId } = generateUuids({
      licenseId: null,
      orderId: null,
      notificationId: null,
    });
    const savedLicense = await addNewLicense({
      licenseId,
      artworkId,
      licenseData: {
        licenseAssignee,
        licenseCompany,
        licenseType,
        licensePrice,
      },
      userId: buyerId,
      connection,
    });
    console.log("LICENSE SAVED");
    await orderValidation.validate({
      orderBuyer: buyerId,
      orderSeller: sellerId,
      orderArtwork: artworkId,
      orderVersion: versionId,
      orderDiscount: discountId,
      orderLicense: licenseId,
      orderSpent: orderData.spent,
      orderEarned: orderData.earned,
      orderFee: orderData.fee,
      orderIntent: intentId,
    });
    console.log("ORDER VALIDATED");
    const orderObject = {
      buyerId,
      sellerId,
      artworkId,
      versionId,
      discountId,
      licenseId,
      reviewId: null,
      spent: orderData.spent,
      earned: orderData.earned,
      fee: orderData.fee,
      type: "commercial",
      status: "completed",
      intentId,
    };
    const savedOrder = await addNewOrder({
      orderId,
      orderData: orderObject,
      connection,
    });
    console.log("ORDER SAVED");
    await removeExistingIntent({
      intentId,
      connection,
    });
    console.log("INTENT DELETED");
    // new start
    await addNewNotification({
      notificationId,
      notificationLink: orderId,
      notificationRef: "",
      notificationType: "order",
      notificationReceiver: sellerId,
      connection,
    });
    socketApi.sendNotification(sellerId, orderId);
    // new end
    return { message: "Order processed successfully" };
  } catch (err) {
    const foundIntent = await retrieveStripeIntent({
      intentId: stripeIntent.id,
      connection,
    });
    if (!isObjectEmpty(foundIntent)) {
      const refundedCharge = await issueStripeRefund({
        chargeData: foundIntent.charges.data,
        connection,
      });
    }
    throw createError(errors.internalError, "Could not process the order");
  }
};
