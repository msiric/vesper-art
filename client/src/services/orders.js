import { ax } from "../containers/Interceptor/Interceptor.js";

export const postReview = async ({ artworkId, reviewRating }) =>
  await ax.post(`/api/rate_artwork/${artworkId}`, {
    reviewRating,
  });
export const getOrder = async ({ orderId }) =>
  await ax.get(`/api/orders/${orderId}`);
export const getOrders = async ({ display }) =>
  await ax.get(`/api/orders/${display}`);
export const getDownload = async ({ orderId }) =>
  await ax.get(`/api/orders/${orderId}/download`);
