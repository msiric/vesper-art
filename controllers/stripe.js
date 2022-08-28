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
import { addNewOrder, fetchArtworkOrders } from "../services/order";
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
    console.log("$TEST CHECKOUT event error", err.message);
    throw createError(...formatError(dynamicError(err.message)));
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("$TEST CHECKOUT Payment success", event.type);
      // FEATURE FLAG - payment
      if (featureFlags.payment) {
        const intent = event.data.object;
        return await processTransaction({ intent, connection });
      }
      break;
    case "payment_intent.payment_failed":
      console.log("$TEST CHECKOUT Failed payment", event.type);
      throw createError(...formatError(errors.paymentNotProcessed));
    default:
      console.log("$TEST CHECKOUT Unknown event", event.type);
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
  if (!isObjectEmpty(foundUser)) {
    const foundVersion = await fetchVersionDetails({
      versionId,
      selection: [
        ...USER_SELECTION["LICENSE_INFO"]("owner"),
        ...USER_SELECTION["STRIPE_INFO"]("owner"),
      ],
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
                })
              : {};
            const shouldReinitialize =
              isObjectEmpty(verifiedIntent) || !isIntentPending(verifiedIntent);
            if (!(shouldReinitialize && !isObjectEmpty(foundDiscount))) {
              const licenseData = formatLicenseValues({
                ...(shouldReinitialize && {
                  licenseAssignee: foundUser.fullName,
                }),
                ...(shouldReinitialize && {
                  licenseAssignor: foundVersion.artwork.owner.fullName,
                }),
                licenseUsage,
                licenseCompany,
                licenseType,
              });
              const validationSchema = shouldReinitialize
                ? licenseValidation.concat(actorsValidation)
                : licenseValidation;
              await validationSchema.validate({
                ...licenseData,
              });
              const availableLicenses = renderCommercialLicenses({
                version: foundVersion,
              });
              if (
                availableLicenses.some((item) => item.value === licenseType)
              ) {
                const foundOrders = await fetchArtworkOrders({
                  userId,
                  artworkId: foundVersion.artwork.id,
                  connection,
                });
                const licenseStatus = isLicenseValid({
                  data: licenseData,
                  orders: foundOrders,
                });
                console.log("license status", licenseStatus);
                if (licenseStatus.valid) {
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
                      })
                    : await updateStripeIntent({
                        intentAmount: buyerTotal,
                        intentFee: platformTotal,
                        intentData: verifiedIntent,
                        orderData,
                      });
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
                throw createError(
                  ...formatError(errors[licenseStatus.state.identifier])
                );
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
      // add condition for
      // "capabilities": {
      //  "card_payments": "active",
      //  "transfers": "active"
      // }
      if (foundAccount.details_submitted) {
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

// $TODO not good
// $TODO validacija svih ID-ova
// $TODO validacija license i pricea
// vjerojatno najbolje fetchat svaki od ID-ova i verifyat data-u
const processTransaction = async ({ intent, connection }) => {
  try {
    console.log("PROCESS TRANSACTION STARTED");
    const orderData = JSON.parse(intent.metadata.orderData);
    const buyerId = orderData.buyerId;
    const sellerId = orderData.sellerId;
    const artworkId = orderData.artworkId;
    const versionId = orderData.versionId;
    const discountId = orderData.discountId;
    const intentId = intent.id;
    console.log("IDS DECODED");
    console.log("ORDER DATA", orderData);
    const {
      licenseAssignee,
      licenseAssignor,
      licenseUsage,
      licenseCompany,
      licenseType,
      licensePrice,
    } = orderData.licenseData;
    await licenseValidation
      .concat(actorsValidation)
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
    await orderValidation.concat(intentValidation).validate({
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
    console.log("ORDER PROCESSED (END)");
    return formatResponse(responses.paymentProcessed);
  } catch (err) {
    console.log("TRANSACTION FAILED", err);
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
