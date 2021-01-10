import axios from "axios";
import FormData from "form-data";
import createError from "http-errors";
import querystring from "querystring";
import * as Yup from "yup";
import { isObjectEmpty } from "../common/helpers";
import { licenseValidation, orderValidation } from "../common/validation";
import { server, stripe as processor } from "../config/secret.js";
import { fetchVersionDetails } from "../services/postgres/artwork.js";
import { fetchDiscountByCode } from "../services/postgres/discount.js";
import { addNewLicense } from "../services/postgres/license";
import { addNewOrder } from "../services/postgres/order.js";
import {
  constructStripeEvent,
  constructStripeIntent,
  constructStripeLink,
  constructStripePayout,
  fetchStripeAccount,
  fetchStripeBalance,
  retrieveStripeIntent,
  updateStripeIntent,
} from "../services/postgres/stripe.js";
import {
  addNewIntent,
  editExistingIntent,
  editUserStripe,
  fetchIntentByParents,
  fetchUserById,
} from "../services/postgres/user.js";
import { generateUuids, sanitizeData } from "../utils/helpers.js";
import { calculateTotalCharge } from "../utils/payment";

export const receiveWebhookEvent = async ({
  stripeSignature,
  stripeBody,
  connection,
}) => {
  const stripeSecret = process.env.STRIPE_WEBHOOK;
  let stripeEvent;

  try {
    stripeEvent = await constructStripeEvent({
      stripeBody,
      stripeSecret,
      stripeSignature,
    });
  } catch (err) {
    console.log("event error");
  }

  console.log("stripe event", stripeEvent.type);

  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      console.log("Payment success");
      const paymentIntent = stripeEvent.data.object;
      await processTransaction({ stripeIntent: paymentIntent, connection });
      break;
    case "payment_intent.failed":
      console.log("Failed payment");
      break;
    default:
      console.log("Invalid event");
  }

  console.log("done");
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
                status: "pending",
                connection,
              });
              if (!isObjectEmpty(foundIntent)) {
                const {
                  buyerTotal,
                  sellerTotal,
                  platformTotal,
                  licensePrice,
                } = calculateTotalCharge({
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
                  intent: {
                    id: paymentIntent.id,
                    secret: paymentIntent.client_secret,
                    discount: foundDiscount,
                  },
                };
              }
              throw createError(400, "Could not apply discount");
            }
            throw createError(400, "You are the owner of this artwork");
          }
          throw createError(400, "Artwork version is obsolete");
        }
        throw createError(400, "Artwork is no longer active");
      }
      throw createError(400, "Artwork not found");
    }
    throw createError(400, "Discount not found");
  }
  throw createError(400, "User not found");
};

// $TODO validacija licenci
export const managePaymentIntent = async ({
  userId,
  versionId,
  /*   discountId, */
  artworkLicense,
  connection,
}) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    /*     const foundDiscount = discountId
      ? await fetchDiscountById({ discountId, connection })
      : null; */
    const foundDiscount = null;
    const foundVersion = await fetchVersionDetails({ versionId, connection });
    const licenseData = {
      licenseAssignee: artworkLicense.assignee,
      licenseCompany: artworkLicense.company,
      licenseType: artworkLicense.type,
    };
    // $TODO Bolje sredit validaciju licence
    // $TODO Sredit validnu licencu (npr, ako je "use": "included", ne moze bit odabran personal license)
    // e.g. isArtworkFree(), isArtworkForSale(), isValidPersonalLicense(), isValidCommercialLicense()
    await licenseValidation.validate(
      sanitizeData({
        ...licenseData,
      })
    );
    if (foundVersion) {
      if (foundVersion.artwork.active) {
        if (foundVersion.id === foundVersion.artwork.currentId) {
          if (foundVersion.artwork.owner.id !== foundUser.id) {
            const foundIntent = await fetchIntentByParents({
              userId: foundUser.id,
              versionId: foundVersion.id,
              status: "pending",
              connection,
            });
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
              ...(isObjectEmpty(foundIntent) && { buyerId: foundUser.id }),
              ...(isObjectEmpty(foundIntent) && {
                sellerId: foundVersion.artwork.owner.id,
              }),
              ...(isObjectEmpty(foundIntent) && {
                artworkId: foundVersion.artwork.id,
              }),
              ...(isObjectEmpty(foundIntent) && { versionId: foundVersion.id }),
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
            const paymentIntent = isObjectEmpty(foundIntent)
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
                  intentId: foundIntent.id,
                  orderData,
                  connection,
                });
            const savedIntent =
              isObjectEmpty(foundIntent) &&
              (await addNewIntent({
                intentId: paymentIntent.id,
                userId: foundUser.id,
                versionId: foundVersion.id,
                status: "pending",
                connection,
              }));
            return {
              intent: {
                id: paymentIntent.id,
                secret: paymentIntent.client_secret,
              },
            };
            throw createError(400, "License type is not valid");
          }
          throw createError(400, "You are the owner of this artwork");
        }
        throw createError(400, "Artwork version is obsolete");
      }
      throw createError(400, "Artwork is no longer active");
    }
    throw createError(400, "Artwork not found");
  }
  throw createError(400, "User not found");
};

export const redirectToStripe = async ({
  accountId,
  userOnboarded,
  connection,
}) => {
  if (!userOnboarded)
    throw createError(
      400,
      "You need to complete the onboarding process before accessing your Stripe dashboard"
    );
  const loginLink = await constructStripeLink({
    accountId,
    serverDomain: server.serverDomain,
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
    redirect_uri: `${server.serverDomain}/stripe/token`,
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

  /* return res.json({
      url: `${processor.authorizeUri}?${querystring.stringify(parameters)}`,
    }); */

  return {
    url: `${processor.authorizeUri}?${querystring.stringify(parameters)}`,
  };
};

// $TODO cannot send headers (treba dobro testat)
export const assignStripeId = async ({
  responseObject,
  sessionData,
  queryData,
  connection,
}) => {
  if (sessionData.state != queryData.state)
    throw createError(500, "There was an error in the onboarding process");

  const formData = new FormData();
  formData.append("grant_type", "authorization_code");
  formData.append("client_id", processor.clientId);
  formData.append("client_secret", processor.secretKey);
  formData.append("code", queryData.code);

  const expressAuthorized = await axios.post(processor.tokenUri, formData, {
    headers: formData.getHeaders(),
  });

  if (expressAuthorized.error) throw createError(500, expressAuthorized.error);

  await editUserStripe({
    userId: sessionData.id,
    stripeId: expressAuthorized.data.stripe_user_id,
    connection,
  });

  const username = sessionData.name;

  sessionData.state = null;
  sessionData.id = null;
  sessionData.name = null;

  return responseObject.redirect(`http://localhost:3000/users/${username}`);
};

export const fetchIntentById = async ({ userId, intentId, connection }) => {
  const foundIntent = await retrieveStripeIntent({ intentId, connection });
  if (!isObjectEmpty(foundIntent)) {
    return {
      intent: foundIntent,
    };
  }
  throw createError(400, "Could not fetch intent");
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
      payoutDescriptor: server.appName,
      stripeId: foundUser.stripeId,
      connection,
    });
    return {
      message: "Payout successfully created",
    };
  }
  throw createError(400, "Cannot create payout for this user");
};

// $TODO not good
// $TODO validacija svih ID-ova
// $TODO validacija license i pricea
// vjerojatno najbolje fetchat svaki od ID-ova i verifyat data-u
const processTransaction = async ({ stripeIntent, connection }) => {
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
    licenseCompany,
    licenseType,
    licensePrice,
  } = orderData.licenseData;
  await licenseValidation.validate(
    sanitizeData({
      licenseAssignee,
      licenseCompany,
      licenseType,
    })
  );
  console.log("LICENSE VALIDATED");
  const { licenseId, orderId, notificationId } = generateUuids({
    licenseId: null,
    orderId: null,
    notificationId: null,
  });
  const savedLicense = await addNewLicense({
    licenseId,
    artworkId,
    licenseData: { licenseAssignee, licenseCompany, licenseType, licensePrice },
    userId: buyerId,
    connection,
  });
  console.log("LICENSE SAVED");
  await orderValidation.validate(
    sanitizeData({
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
    })
  );
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
  await editExistingIntent({
    intentId,
    status: "succeeded",
    connection,
  });
  console.log("INTENT UPDATED");
  // new start
  // await addNewNotification({
  //   notificationId,
  //   notificationLink: orderId,
  //   notificationRef: "",
  //   notificationType: "order",
  //   notificationReceiver: sellerId,
  //   connection,
  // });
  // socketApi.sendNotification(sellerId, orderId);
  // new end
  return { message: "Order processed successfully" };
};
