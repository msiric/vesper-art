import axios from "axios";
import FormData from "form-data";
import createError from "http-errors";
import querystring from "querystring";
import { appName, featureFlags } from "../common/constants";
import { isObjectEmpty, renderCommercialLicenses } from "../common/helpers";
import {
  licenseActors,
  licenseValidation,
  orderValidation,
  priceValidation,
} from "../common/validation";
import { domain, stripe as stripeConfig } from "../config/secret";
import socketApi from "../lib/socket";
import { fetchVersionDetails } from "../services/postgres/artwork";
import { fetchDiscountById } from "../services/postgres/discount";
import { addNewLicense } from "../services/postgres/license";
import { addNewNotification } from "../services/postgres/notification";
import { addNewOrder } from "../services/postgres/order";
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
} from "../services/postgres/stripe";
import {
  addNewIntent,
  editUserStripe,
  fetchIntentByParents,
  fetchUserById,
  removeExistingIntent,
} from "../services/postgres/user";
import { formatError, formatResponse, generateUuids } from "../utils/helpers";
import { calculateTotalCharge } from "../utils/payment";
import { USER_SELECTION } from "../utils/selectors";
import { errors, responses } from "../utils/statuses";

export const isIntentPending = (intent) => {
  return intent.status !== "succeeded" && intent.status !== "canceled";
};

export const receiveWebhookEvent = async ({
  stripeSignature,
  stripeBody,
  connection,
}) => {
  console.log("$TEST CHECKOUT RECEIVED WEBHOOK");
  const stripeSecret = stripeConfig.webhookSecret;
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
      // FEATURE FLAG - payment
      if (featureFlags.payment) {
        const paymentIntent = stripeEvent.data.object;
        await processTransaction({ stripeIntent: paymentIntent, connection });
      }
      break;
    case "payment_intent.failed":
      console.log("$TEST CHECKOUT Failed payment");
      break;
    default:
      console.log("$TEST CHECKOUT Invalid event");
  }

  console.log("$TEST CHECKOUT done");
  return formatResponse(responses.eventReceived);
};

export const getStripeUser = async ({ accountId }) => {
  const foundAccount = await fetchStripeAccount({ accountId });
  if (!isObjectEmpty(foundAccount)) {
    return {
      capabilities: {
        cardPayments: foundAccount.capabilities.card_payments,
        // $TODO foundAccount.capabilities.platform_payments (platform_payments are deprecated, now called "transfers")
        platformPayments: foundAccount.capabilities.transfers,
      },
    };
  }
  throw createError(...formatError(errors.userNotFound));
};

// $TODO validacija licenci
export const managePaymentIntent = async ({
  userId,
  versionId,
  discountId,
  artworkLicense,
  connection,
}) => {
  const foundUser = await fetchUserById({
    userId,
    selection: USER_SELECTION["LICENSE_INFO"](),
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    const foundVersion = await fetchVersionDetails({
      versionId,
      connection,
    });
    if (!isObjectEmpty(foundVersion)) {
      if (foundVersion.id === foundVersion.artwork.currentId) {
        if (foundVersion.artwork.owner.id !== foundUser.id) {
          // FEATURE FLAG - discount
          const foundDiscount =
            discountId && featureFlags.discount
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
              isObjectEmpty(verifiedIntent) || !isIntentPending(verifiedIntent);
            if (!(shouldReinitialize && !isObjectEmpty(foundDiscount))) {
              const licenseData = {
                ...(shouldReinitialize && {
                  licenseAssignee: foundUser.fullName,
                }),
                ...(shouldReinitialize && {
                  licenseAssignor: foundVersion.artwork.owner.fullName,
                }),
                licenseCompany: artworkLicense.company,
                licenseType: artworkLicense.type,
              };
              const availableLicenses = renderCommercialLicenses({
                version: foundVersion,
              });
              if (
                availableLicenses.some(
                  (item) => item.value === artworkLicense.type
                )
              ) {
                const validationSchema = shouldReinitialize
                  ? licenseValidation.concat(licenseActors)
                  : licenseValidation;
                await validationSchema.validate({
                  ...licenseData,
                });
                const { buyerTotal, sellerTotal, platformTotal, licensePrice } =
                  calculateTotalCharge({
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
                    licensePrice,
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
              throw createError(...formatError(errors.artworkLicenseInvalid));
            }
            throw createError(...formatError(errors.paymentNotProcessed));
          }
          throw createError(...formatError(errors.discountNotApplied));
        }
        throw createError(...formatError(errors.artworkDownloadedByOwner));
      }
      throw createError(...formatError(errors.artworkVersionObsolete));
    }
    throw createError(...formatError(errors.artworkNotFound));
  }
  throw createError(...formatError(errors.userNotFound));
};

export const redirectToDashboard = () => {
  return { redirect: "/dashboard" };
};

export const redirectToStripe = async ({
  accountId,
  userOnboarded,
  connection,
}) => {
  if (!userOnboarded)
    throw createError(...formatError(errors.stripeOnboardingIncomplete));
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
    client_id: stripeConfig.clientId,
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
    url: `${stripeConfig.authorizeUri}?${querystring.stringify(parameters)}`,
  };
};

// $TODO cannot send headers (treba dobro testat)
export const assignStripeId = async ({
  sessionData,
  queryData,
  connection,
}) => {
  if (sessionData.state != queryData.state)
    throw createError(...formatError(errors.onboardingProcessInvalid));

  const formData = new FormData();
  formData.append("grant_type", "authorization_code");
  formData.append("client_id", stripeConfig.clientId);
  formData.append("client_secret", stripeConfig.secretKey);
  formData.append("code", queryData.code);

  const expressAuthorized = await axios.post(stripeConfig.tokenUri, formData, {
    headers: formData.getHeaders(),
  });

  if (expressAuthorized.error)
    throw createError(statusCodes.internalError, expressAuthorized.error, {
      expose: true,
    });

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
  throw createError(...formatError(errors.intentNotFound));
};

export const createPayout = async ({ userId, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (!isObjectEmpty(foundUser) && foundUser.stripeId) {
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
    return formatResponse(responses.payoutCreated);
  }
  throw createError(...formatError(errors.userNotFound));
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
    const {
      licenseAssignee,
      licenseAssignor,
      licenseCompany,
      licenseType,
      licensePrice,
    } = orderData.licenseData;
    await licenseValidation
      .concat(licenseActors)
      .concat(priceValidation)
      .validate(orderData.licenseData);
    console.log("LICENSE VALIDATED");
    const { licenseId, orderId, notificationId } = generateUuids({
      licenseId: null,
      orderId: null,
      notificationId: null,
    });
    const savedLicense = await addNewLicense({
      licenseId,
      artworkId,
      licenseData: orderData.licenseData,
      userId: buyerId,
      sellerId,
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
    return formatResponse(responses.paymentProcessed);
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
    throw createError(...formatError(errors.orderNotProcessed));
  }
};
