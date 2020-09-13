import { ax } from '../containers/Interceptor/Interceptor.js';

export const getUser = async ({ stripeId }) =>
  await ax.get(`/stripe/account/${stripeId}`);
export const postIntent = async ({
  versionId,
  artworkLicense,
  intentId,
  discountId,
}) =>
  await ax.post(`/stripe/intent/${versionId}`, {
    artworkLicense,
    intentId,
    discountId,
  });
export const postAuthorize = async ({ userOrigin, userEmail }) =>
  await ax.post('/stripe/authorize', {
    userOrigin,
    userEmail,
  });
