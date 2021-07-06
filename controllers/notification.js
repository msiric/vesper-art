import {
  editReadNotification,
  editUnreadNotification,
  fetchExistingNotifications,
  removeAllNotifications,
} from "../services/postgres/notification.js";
import { formatResponse } from "../utils/helpers.js";
import { responses } from "../utils/statuses.js";

export const getNotifications = async ({ userId, connection }) => {
  const foundNotifications = await fetchExistingNotifications({
    userId,
    connection,
  });
  return { notifications: foundNotifications };
};

export const readNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  await editReadNotification({
    userId,
    notificationId,
    connection,
  });
  /*   await decrementUserNotification({ userId, connection }); */
  return formatResponse(responses.notificationRead);
};

export const unreadNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  await editUnreadNotification({
    userId,
    notificationId,
    connection,
  });
  /*   await incrementUserNotification({ userId, connection }); */
  return formatResponse(responses.notificationUnread);
};

export const deleteUserNotifications = async ({ userId, connection }) => {
  await removeAllNotifications({
    userId,
    connection,
  });
  return formatResponse(responses.notificationsDeleted);
};
