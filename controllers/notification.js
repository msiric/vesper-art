import createError from "http-errors";
import {
  editReadNotification,
  editUnreadNotification,
  fetchExistingNotifications,
  removeAllNotifications,
} from "../services/postgres/notification";
import { formatError, formatResponse } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

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
  const readNotification = await editReadNotification({
    userId,
    notificationId,
    connection,
  });
  if (readNotification.affected !== 0) {
    return formatResponse(responses.notificationRead);
  }
  throw createError(...formatError(errors.notificationNotFound));
  /*   await decrementUserNotification({ userId, connection }); */
};

export const unreadNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  const unreadNotification = await editUnreadNotification({
    userId,
    notificationId,
    connection,
  });
  if (unreadNotification.affected !== 0) {
    return formatResponse(responses.notificationUnread);
  }
  throw createError(...formatError(errors.notificationNotFound));
  /*   await incrementUserNotification({ userId, connection }); */
};

export const deleteUserNotifications = async ({ userId, connection }) => {
  await removeAllNotifications({
    userId,
    connection,
  });
  return formatResponse(responses.notificationsDeleted);
};
