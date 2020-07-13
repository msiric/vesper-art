import { ax } from '../containers/Interceptor/Interceptor.js';

export const postReview = async ({ artworkId, reviewRating, reviewContent }) =>
  await ax.post(`/api/rate_artwork/${artworkId}`, {
    reviewRating,
    reviewContent,
  });
export const getOrder = async ({ orderId }) =>
  await ax.get(`/api/orders/${orderId}`);
export const getOrders = async ({ display }) =>
  await ax.get(`/api/orders/${display}`);
