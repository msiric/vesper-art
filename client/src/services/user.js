import { ax } from "../containers/Interceptor";

export const getUser = {
  request: async ({ userUsername }) =>
    await ax.get(`/api/users/${userUsername}`),
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
  request: async ({ userId, displayType, start, end }) =>
    await ax.get(
      `/api/users/${userId}/${displayType}?start=${start}&end=${end}`
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
export const postMedia = {
  request: async ({ data }) => await ax.post("/api/profile_image_upload", data),
  success: { message: "Avatar successfully uploaded", variant: "success" },
  error: { message: "Failed to upload avatar", variant: "error" },
};
export const getArtwork = {
  request: async ({ userUsername, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userUsername}/artwork?cursor=${cursor}&limit=${limit}`
    ),
  success: { message: "User artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch user artwork", variant: "error" },
};
export const getUploads = {
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userId}/uploads?cursor=${cursor}&limit=${limit}`
    ),
  success: { message: "User artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch user artwork", variant: "error" },
};
export const getMyArtwork = {
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userId}/my_artwork?cursor=${cursor}&limit=${limit}`
    ),
  success: { message: "User artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch user artwork", variant: "error" },
};
export const getCollection = {
  // datatable (cursor, limit not needed)
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(`/api/users/${userId}/collection`),
  success: { message: "User artwork successfully fetched", variant: "success" },
  error: { message: "Failed to fetch user artwork", variant: "error" },
};
export const getOwnership = {
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userId}/ownership?cursor=${cursor}&limit=${limit}`
    ),
  success: {
    message: "User purchases successfully fetched",
    variant: "success",
  },
  error: { message: "Failed to fetch user purchases", variant: "error" },
};
export const getFavorites = {
  request: async ({ userUsername, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userUsername}/favorites?cursor=${cursor}&limit=${limit}`
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
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userId}/notifications/previous?cursor=${cursor}&limit=${limit}`
    ),
  success: {
    message: "Notifications successfully fetched",
    variant: "success",
  },
  error: { message: "Failed to fetch notifications", variant: "error" },
};
export const restoreNotifications = {
  request: async ({ userId, cursor = "", limit = "" }) =>
    await ax.get(
      `/api/users/${userId}/notifications/latest?cursor=${cursor}&limit=${limit}`
    ),
  success: {
    message: "Notifications successfully fetched",
    variant: "success",
  },
  error: { message: "Failed to fetch notifications", variant: "error" },
};
export const postLogout = {
  request: async () =>
    await ax.post("/auth/logout", {
      headers: {
        credentials: "include",
      },
    }),
  success: { message: "User successfully logged out", variant: "success" },
  error: { message: "Failed to log out user", variant: "error" },
};
export const patchRead = {
  request: async ({ userId, notificationId }) =>
    await ax.post(`/api/users/${userId}/notifications/${notificationId}`),
  success: { message: "Notification successfully read", variant: "success" },
  error: { message: "Failed to read notification", variant: "error" },
};
export const patchUnread = {
  request: async ({ userId, notificationId }) =>
    await ax.delete(`/api/users/${userId}/notifications/${notificationId}`),
  success: { message: "Notification successfully unread", variant: "success" },
  error: { message: "Failed to unread notification", variant: "error" },
};
export const postCheckout = {
  request: async ({ userId, data }) =>
    await ax.post(`/api/users/${userId}/intents`, data),
  success: { message: "Intent successfully stored", variant: "success" },
  error: { message: "Failed to store intent", variant: "error" },
};
