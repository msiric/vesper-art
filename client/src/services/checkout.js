import { ax } from "../containers/Interceptor/Interceptor.js";

export const getCheckout = {
  request: async ({ versionId }) => await ax.get(`/api/checkout/${versionId}`),
  success: { message: "Checkout successfully fetched", variant: "success" },
  error: { message: "Failed to fetch checkout", variant: "error" },
};
export const postDiscount = {
  request: async ({ data }) => await ax.post("/api/discounts", data),
  success: { message: "Discount successfully applied", variant: "success" },
  error: { message: "Failed to apply discount", variant: "error" },
};
// $Checked Not used? (Can be removed safely)
export const deleteDiscount = {
  request: async ({ discountId }) =>
    await ax.delete(`/api/discounts/${discountId}`),
  success: { message: "Discount successfully removed", variant: "success" },
  error: { message: "Failed to remove discount", variant: "error" },
};
export const postDownload = {
  request: async ({ versionId, data }) =>
    await ax.post(`/api/download/${versionId}`, data),
  success: { message: "Artwork successfully downloaded", variant: "success" },
  error: { message: "Failed to download artwork", variant: "error" },
};
