import {
  editReadNotification,
  editUnreadNotification,
  fetchExistingNotifications,
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
  return { message: "Notification read" };
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
  return { message: "Notification read" };
};
