import { ax } from "../containers/Interceptor/Interceptor.js";

// $TODO wat??? artworkId instead of orderId?
export const postReview = {
  request: async ({ artworkId, reviewRating }) =>
    await ax.post(`/api/orders/${artworkId}/ratings`, {
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
// $Checked Not used? (Can be safely removed)
export const getOrders = {
  request: async ({ display }) => await ax.get(`/api/orders/${display}`),
  success: { message: "Orders successfully fetched", variant: "success" },
  error: { message: "Failed to fetch orders", variant: "error" },
};
export const getDownload = {
  request: async ({ orderId }) =>
    await ax.get(`/api/orders/${orderId}/download`),
  success: { message: "Artwork successfully downloaded", variant: "success" },
  error: { message: "Failed to download artwork", variant: "error" },
};
