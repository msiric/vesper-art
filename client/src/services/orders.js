import { ax } from '../../shared/Interceptor/Interceptor.js';

export const postReview = async ({ artworkId }) =>
  await ax.post(`/api/rate_artwork/${artworkId}`, {
    reviewRating: values.rating,
    reviewContent: values.content,
  });
export const getOrder = async ({ orderId }) =>
  await ax.get(`/api/orders/${orderId}`);
export const getOrders = async ({ display }) =>
  await ax.get(`/api/orders/${display}`);
