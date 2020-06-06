import { ax } from '../../shared/Interceptor/Interceptor.js';

export const getStatistics = async ({ userId }) =>
  await ax.get(`/api/user/${userId}/statistics`);
export const getSelection = async ({ userId, display, from, to }) =>
  await ax.get(`/api/user/${userId}/${[display]}?from=${from}&to=${to}`);
export const patchUser = async ({ userId, data }) =>
  await ax.patch(`/api/user/${userId}`, data);
export const postMedia = async ({ data }) =>
  await ax.post('/api/profile_image_upload', data);
export const getArtwork = async ({ userId, cursor, ceiling }) =>
  await ax.get(
    `/api/user/${userId}/artwork?cursor=${cursor}&ceiling=${ceiling}`
  );
export const getSaves = async ({ userId, cursor, ceiling }) =>
  await ax.get(`/api/user/${userId}/saves?cursor=${cursor}&ceiling=${ceiling}`);
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
export const getNotifications = async ({ userId, cursor, ceiling }) =>
  await ax.get(
    `/api/user/${userId}/notifications?cursor=${cursor}&ceiling=${ceiling}`
  );
export const postLogout = async () =>
  await ax.post('/api/auth/logout', {
    headers: {
      credentials: 'include',
    },
  });
export const patchRead = async ({ notificationId }) =>
  await ax.patch(`/api/read_notification/${notificationId}`);
export const patchUnread = async ({ notificationId }) =>
  await ax.patch(`/api/unread_notification/${notificationId}`);
