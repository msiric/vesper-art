import { ax } from "../containers/Interceptor/Interceptor.js";

export const getUser = {
  request: async ({ stripeId }) => await ax.get(`/stripe/account/${stripeId}`),
  success: { message: "Account successfully fetched", variant: "success" },
  error: { message: "Failed to fetch account", variant: "error" },
};
export const patchIntent = {
  request: async ({ versionId, discountCode, licenseType }) =>
    await ax.patch(`/stripe/intent/${versionId}`, {
      discountCode,
      licenseType,
    }),
  success: { message: "Intent successfully saved", variant: "success" },
  error: { message: "Failed to save intent", variant: "error" },
};
export const postIntent = {
  request: async ({ versionId, artworkLicense, intentId, discountId }) =>
    await ax.post(`/stripe/intent/${versionId}`, {
      artworkLicense,
      intentId,
      discountId,
    }),
  success: { message: "Intent successfully saved", variant: "success" },
  error: { message: "Failed to save intent", variant: "error" },
};
export const postAuthorize = {
  request: async ({ userBusinessAddress, userEmail }) =>
    await ax.post("/stripe/authorize", {
      userBusinessAddress,
      userEmail,
    }),
  success: { message: "User successfully authorized", variant: "success" },
  error: { message: "Failed to authorize user", variant: "error" },
};
export const getDashboard = {
  request: async ({ stripeId }) =>
    await ax.get(`/stripe/dashboard/${stripeId}`),
  success: { message: "Dashboard successfully fetched", variant: "success" },
  error: { message: "Failed to fetch dashboard", variant: "error" },
};
