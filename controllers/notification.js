import {
  decrementUserNotification,
  editReadNotification,
  editUnreadNotification,
  fetchExistingNotifications,
  incrementUserNotification,
} from "../services/mongo/notification.js";

export const getNotifications = async ({ userId }) => {
  const foundNotifications = await fetchExistingNotifications({
    userId,
  });
  return { notification: foundNotifications };
};

export const readNotification = async ({ userId, notificationId, session }) => {
  await editReadNotification({
    userId,
    notificationId,
    session,
  });
  await decrementUserNotification({ userId, session });
  return { message: "Notification read" };
};

export const unreadNotification = async ({
  userId,
  notificationId,
  session,
}) => {
  await editUnreadNotification({
    userId,
    notificationId,
    session,
  });
  await incrementUserNotification({ userId, session });
  return { message: "Notification read" };
};
