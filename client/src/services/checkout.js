import { ax } from "../containers/Interceptor/Interceptor.js";

export const getCheckout = {
  request: async ({ versionId }) => await ax.get(`/api/checkout/${versionId}`),
  success: { message: "Checkout successfully fetched", variant: "success" },
  error: { message: "Failed to fetch checkout", variant: "error" },
};
export const postDiscount = {
  request: async ({ data }) => await ax.post("/api/discount", data),
  success: { message: "Discount successfully applied", variant: "success" },
  error: { message: "Failed to apply discount", variant: "error" },
};
// $TODO Not used?
export const deleteDiscount = {
  request: async ({ discountId }) =>
    await ax.delete(`/api/discount/${discountId}`),
  success: { message: "Discount successfully removed", variant: "success" },
  error: { message: "Failed to remove discount", variant: "error" },
};
export const postDownload = {
  request: async ({ versionId, data }) =>
    await ax.post(`/api/download/${versionId}`, data),
  success: { message: "Artwork successfully downloaded", variant: "success" },
  error: { message: "Failed to download artwork", variant: "error" },
};
