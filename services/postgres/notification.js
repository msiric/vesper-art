import { Notification } from "../../entities/notification";
import { User } from "../../entities/User";

// $Needs testing (mongo -> postgres)
export const addNewNotification = async ({
  notificationLink,
  notificationRef,
  notificationType,
  notificationReceiver,
}) => {
  const newNotification = new Notification();
  newNotification.link = notificationLink;
  newNotification.ref = notificationRef;
  newNotification.type = notificationType;
  newNotification.receiver = notificationReceiver;
  newNotification.read = false;
  return await Notification.save({ newNotification });
};

// $Needs testing (mongo -> postgres)
export const fetchExistingNotifications = async ({ userId }) => {
  return await Notification.find({
    where: [{ receiver: userId }],
    order: {
      created: "DESC",
    },
  });
};

// $Needs testing (mongo -> postgres)
export const editReadNotification = async ({ userId, notificationId }) => {
  const foundNotification = await Notification.findOne({
    where: [{ id: notificationId, receiver: userId }],
  });
  foundNotification.read = true;
  return await Notification.save({ foundNotification });
};

// $Needs testing (mongo -> postgres)
export const editUnreadNotification = async ({ userId, notificationId }) => {
  const foundNotification = await Notification.findOne({
    where: [{ id: notificationId, receiver: userId }],
  });
  foundNotification.read = false;
  return await Notification.save({ foundNotification });
};

// $Needs testing (mongo -> postgres)
export const decrementUserNotification = async ({ userId }) => {
  return await User.increment(
    { where: [{ id: userId, active: true }] },
    "notifications",
    -1
  );
};

// $Needs testing (mongo -> postgres)
export const incrementUserNotification = async ({ userId }) => {
  return await User.increment(
    { where: [{ id: userId, active: true }] },
    "notifications",
    1
  );
};
