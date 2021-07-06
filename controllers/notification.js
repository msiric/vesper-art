import {
  editReadNotification,
  editUnreadNotification,
  fetchExistingNotifications,
  removeAllNotifications,
} from "../services/postgres/notification.js";

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
  return { message: "Notification read", expose: false };
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
  return { message: "Notification read", expose: false };
};

export const deleteUserNotifications = async ({ userId, connection }) => {
  await removeAllNotifications({
    userId,
    connection,
  });
  return { message: "Notifications deleted successfully", expose: false };
};
