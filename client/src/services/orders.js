import { ax } from "../containers/Interceptor/Interceptor.js";

export const postReview = {
  request: async ({ artworkId, reviewRating }) =>
    await ax.post(`/api/rate_artwork/${artworkId}`, {
      reviewRating,
    }),
  success: { message: "Review successfully published", variant: "success" },
  error: { message: "Failed to publish review", variant: "error" },
};
export const getOrder = {
  request: async (_, { orderId }) => await ax.get(`/api/orders/${orderId}`),
  success: { message: "Order successfully fetched", variant: "success" },
  error: { message: "Failed to fetch order", variant: "error" },
};
// $TODO Not used?
export const getOrders = {
  request: async (_, { display }) => await ax.get(`/api/orders/${display}`),
  success: { message: "Orders successfully fetched", variant: "success" },
  error: { message: "Failed to fetch orders", variant: "error" },
};
export const getDownload = {
  request: async (_, { orderId }) =>
    await ax.get(`/api/orders/${orderId}/download`),
  success: { message: "Artwork successfully downloaded", variant: "success" },
  error: { message: "Failed to download artwork", variant: "error" },
};
