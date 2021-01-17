import { ax } from "../containers/Interceptor/Interceptor.js";

export const getUser = {
  request: async ({ userUsername, dataCursor, dataCeiling }) =>
    await ax.get(
      `/api/users/${userUsername}?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: { message: "User successfully fetched", variant: "success" },
  error: { message: "Failed to fetch user", variant: "error" },
};
export const getStatistics = {
  request: async ({ userId, display }) =>
    await ax.get(`/api/users/${userId}/statistics/${display}`),
  success: { message: "Statistics successfully fetched", variant: "success" },
  error: { message: "Failed to fetch statistics", variant: "error" },
};
export const getSelection = {
  request: async ({ userId, displayType, rangeFrom, rangeTo }) =>
    await ax.get(
      `/api/users/${userId}/${displayType}?rangeFrom=${rangeFrom}&rangeTo=${rangeTo}`
    ),
  success: { message: "Selection successfully fetched", variant: "success" },
  error: { message: "Failed to fetch selection", variant: "error" },
};
export const patchUser = {
  request: async ({ userId, data }) =>
    await ax.patch(`/api/users/${userId}`, data),
  success: { message: "User successfully updated", variant: "success" },
  error: { message: "Failed to update user", variant: "error" },
};
export const patchOrigin = {
  request: async ({ userId, data }) =>
    await ax.patch(`/api/users/${userId}/origin`, data),
  success: {
    message: "Business address successfully updated",
    variant: "success",
  },
  error: { message: "Failed to update business address", variant: "error" },
};
export const postMedia = {
  request: async ({ data }) => await ax.post("/api/profile_image_upload", data),
  success: { message: "Avatar successfully uploaded", variant: "success" },
  error: { message: "Failed to upload avatar", variant: "error" },
};
export const getArtwork = {
  request: async ({ userId, dataCursor, dataCeiling }) =>
    await ax.get(
      `/api/users/${userId}/artwork?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: { message: "User artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch user artwork", variant: "error" },
};
export const getOwnership = {
  request: async ({ userId, dataCursor, dataCeiling }) =>
    await ax.get(
      `/api/users/${userId}/ownership?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: {
    message: "User purchases successfully fetched",
    variant: "success",
  },
  error: { message: "Failed to fetch user purchases", variant: "error" },
};
export const getFavorites = {
  request: async ({ userId, dataCursor, dataCeiling }) =>
    await ax.get(
      `/api/users/${userId}/favorites?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: { message: "Favorites successfully fetched", variant: "success" },
  error: { message: "Failed to fetch favorites", variant: "error" },
};
export const getSettings = {
  request: async ({ userId }) => await ax.get(`/api/users/${userId}/settings`),
  success: { message: "Settings successfully fetched", variant: "success" },
  error: { message: "Failed to fetch settings", variant: "error" },
};
export const deleteUser = {
  request: async ({ userId }) => await ax.delete(`/api/users/${userId}`),
  success: { message: "User successfully deactivated", variant: "success" },
  error: { message: "Failed to deactivate user", variant: "error" },
};
export const patchEmail = {
  request: async ({ userId, data }) =>
    await ax.patch(`/api/users/${userId}/email`, data),
  success: { message: "Email successfully updated", variant: "success" },
  error: { message: "Failed to update email", variant: "error" },
};
export const patchPassword = {
  request: async ({ userId, data }) =>
    await ax.patch(`/api/users/${userId}/password`, data),
  success: { message: "Password successfully updated", variant: "success" },
  error: { message: "Failed to update password", variant: "error" },
};
export const patchPreferences = {
  request: async ({ userId, data }) =>
    await ax.patch(`/api/users/${userId}/preferences`, data),
  success: { message: "Preferences successfully updated", variant: "success" },
  error: { message: "Failed to update preferences", variant: "error" },
};
export const patchBilling = {
  request: async ({ userId, data }) =>
    await ax.patch(`/api/users/${userId}/billing`, data),
  success: {
    message: "Billing information successfully updated",
    variant: "success",
  },
  error: { message: "Failed to update billing information", variant: "error" },
};
export const getNotifications = {
  request: async ({ userId, dataCursor, dataCeiling }) =>
    await ax.get(
      `/api/users/${userId}/notifications?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
    ),
  success: {
    message: "Notifications successfully fetched",
    variant: "success",
  },
  error: { message: "Failed to fetch notifications", variant: "error" },
};
export const postLogout = {
  request: async () =>
    await ax.post("/api/auth/logout", {
      headers: {
        credentials: "include",
      },
    }),
  success: { message: "User successfully logged out", variant: "success" },
  error: { message: "Failed to log out user", variant: "error" },
};
export const patchRead = {
  request: async ({ notificationId }) =>
    await ax.post(`/api/notifications/${notificationId}`),
  success: { message: "Notification successfully read", variant: "success" },
  error: { message: "Failed to read notification", variant: "error" },
};
export const patchUnread = {
  request: async ({ notificationId }) =>
    await ax.delete(`/api/notifications/${notificationId}`),
  success: { message: "Notification successfully unread", variant: "success" },
  error: { message: "Failed to unread notification", variant: "error" },
};
export const postCheckout = {
  request: async ({ userId, data }) =>
    await ax.post(`/api/users/${userId}/intents`, data),
  success: { message: "Intent successfully stored", variant: "success" },
  error: { message: "Failed to store intent", variant: "error" },
};
export const getMedia = {
  request: async ({ userId, artworkId }) =>
    await ax.get(`/api/users/${userId}/artwork/${artworkId}/download`),
  success: {
    message: "Artwork media successfully fetched",
    variant: "success",
  },
  error: { message: "Failed to fetch artwork media", variant: "error" },
};
