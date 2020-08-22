import { ax } from '../containers/Interceptor/Interceptor.js';

export const getUser = async ({ stripeId }) =>
  await ax.get(`/stripe/account/${stripeId}`);
export const postIntent = async ({ artworkId, artworkLicense, intentId }) =>
  await ax.post(`/stripe/intent/${artworkId}`, {
    artworkLicense,
    intentId,
  });
export const postAuthorize = async ({ userOrigin, userEmail }) =>
  await ax.post('/stripe/authorize', {
    userOrigin,
    userEmail,
  });
