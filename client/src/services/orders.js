import { ax } from "../containers/Interceptor/Interceptor";

export const postReview = {
  request: async ({ orderId, reviewRating }) =>
    await ax.post(`/api/orders/${orderId}/reviews`, {
      reviewRating,
    }),
  success: { message: "Review successfully published", variant: "success" },
  error: { message: "Failed to publish review", variant: "error" },
};
export const getOrder = {
  request: async ({ orderId }) => await ax.get(`/api/orders/${orderId}`),
  success: { message: "Order successfully fetched", variant: "success" },
  error: { message: "Failed to fetch order", variant: "error" },
};
export const getOrders = {
  // datatable (cursor, limit not needed)
  request: async ({ display }) => await ax.get(`/api/orders/${display}`),
  success: { message: "Orders successfully fetched", variant: "success" },
  error: { message: "Failed to fetch orders", variant: "error" },
};
export const getPurchases = {
  // datatable (cursor, limit not needed)
  request: async ({ artworkId }) =>
    await ax.get(`/api/orders/purchases/${artworkId}`),
  success: { message: "Orders successfully fetched", variant: "success" },
  error: { message: "Failed to fetch orders", variant: "error" },
};
export const getDownload = {
  request: async ({ orderId }) =>
    await ax.get(`/api/orders/${orderId}/download`),
  success: { message: "Artwork successfully downloaded", variant: "success" },
  error: { message: "Failed to download artwork", variant: "error" },
};
