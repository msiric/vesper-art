import { ax } from '../containers/Interceptor/Interceptor.js';

export const getUser = async ({ stripeId }) =>
  await ax.get(`/stripe/account/${stripeId}`);
export const postIntent = async ({ artworkId, licenses, intentId }) =>
  await ax.post(`/stripe/intent/${artworkId}`, {
    licenses,
    intentId,
  });
export const postAuthorize = async ({ country, email }) =>
  await ax.post('/stripe/authorize', {
    country,
    email,
  });
