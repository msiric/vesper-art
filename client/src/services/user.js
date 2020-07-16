import { ax } from "../containers/Interceptor/Interceptor.js";

export const getUser = async ({ username, dataCursor, dataCeiling }) =>
  await ax.get(
    `/api/user/${username}?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
  );
export const getStatistics = async ({ userId }) =>
  await ax.get(`/api/user/${userId}/statistics`);
export const getSelection = async ({
  userId,
  displayType,
  rangeFrom,
  rangeTo,
}) =>
  await ax.get(
    `/api/user/${userId}/${displayType}?rangeFrom=${rangeFrom}&rangeTo=${rangeTo}`
  );
export const patchUser = async ({ userId, data }) =>
  await ax.patch(`/api/user/${userId}`, data);
export const postMedia = async ({ data }) =>
  await ax.post("/api/profile_image_upload", data);
export const getArtwork = async ({ userId, dataCursor, dataCeiling }) =>
  await ax.get(
    `/api/user/${userId}/artwork?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
  );
export const getSaves = async ({ userId, dataCursor, dataCeiling }) =>
  await ax.get(
    `/api/user/${userId}/saves?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
  );
export const getSettings = async ({ userId }) =>
  await ax.get(`/api/user/${userId}/settings`);
export const deleteUser = async ({ userId }) =>
  await ax.delete(`/api/user/${userId}`);
export const patchEmail = async ({ userId, data }) =>
  await ax.patch(`/api/user/${userId}/update_email`, data);
export const patchPassword = async ({ userId, data }) =>
  await ax.patch(`/api/user/${userId}/update_password`, data);
export const patchPreferences = async ({ userId, data }) =>
  await ax.patch(`/api/user/${userId}/preferences`, data);
export const patchBilling = async ({ userId, data }) =>
  await ax.patch(`/api/user/${userId}/billing`, data);
export const getNotifications = async ({ userId, dataCursor, dataCeiling }) =>
  await ax.get(
    `/api/user/${userId}/notifications?dataCursor=${dataCursor}&dataCeiling=${dataCeiling}`
  );
export const postLogout = async () =>
  await ax.post("/api/auth/logout", {
    headers: {
      credentials: "include",
    },
  });
export const patchRead = async ({ notificationId }) =>
  await ax.patch(`/api/read_notification/${notificationId}`);
export const patchUnread = async ({ notificationId }) =>
  await ax.patch(`/api/unread_notification/${notificationId}`);
