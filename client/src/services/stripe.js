import { ax } from '../containers/Interceptor/Interceptor.js';

export const getUser = async ({ stripeId }) =>
  await ax.get(`/stripe/account/${stripeId}`);
export const postIntent = async ({ artworkId, userLicenses, intentId }) =>
  await ax.post(`/stripe/intent/${artworkId}`, {
    userLicenses,
    intentId,
  });
export const postAuthorize = async ({ userOrigin, userEmail }) =>
  await ax.post('/stripe/authorize', {
    userOrigin,
    userEmail,
  });
