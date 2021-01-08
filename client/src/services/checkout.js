import { ax } from "../containers/Interceptor/Interceptor.js";

export const getCheckout = {
  request: async ({ versionId }) => await ax.get(`/api/checkout/${versionId}`),
  success: { message: "Checkout successfully fetched", variant: "success" },
  error: { message: "Failed to fetch checkout", variant: "error" },
};
export const getDiscount = {
  request: async ({ discountCode }) =>
    await ax.get(`/api/discounts/${discountCode}`),
  success: { message: "Discount successfully applied", variant: "success" },
  error: { message: "Failed to apply discount", variant: "error" },
};
export const postDownload = {
  request: async ({ versionId, data }) =>
    await ax.post(`/api/download/${versionId}`, data),
  success: { message: "Artwork successfully downloaded", variant: "success" },
  error: { message: "Failed to download artwork", variant: "error" },
};
