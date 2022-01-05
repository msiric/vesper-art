import { Notification } from "../../entities/Notification";
import { NOTIFICATION_SELECTION } from "../../utils/selectors";

export const fetchExistingNotifications = async ({ userId, connection }) => {
  const foundNotifications = await connection
    .getRepository(Notification)
    .createQueryBuilder("notification")
    .select([...NOTIFICATION_SELECTION["ESSENTIAL_INFO"]()])
    .where("notification.receiverId = :userId", {
      userId,
    })
    .addOrderBy("notification.created", "DESC")
    .getMany();
  return foundNotifications;
};

export const addNewNotification = async ({
  notificationId,
  notificationLink,
  notificationRef,
  notificationType,
  notificationReceiver,
  connection,
}) => {
  const savedNotification = await connection
    .createQueryBuilder()
    .insert()
    .into(Notification)
    .values([
      {
        id: notificationId,
        receiverId: notificationReceiver,
        link: notificationLink,
        ref: notificationRef,
        type: notificationType,
        read: false,
      },
    ])
    .returning("*")
    .execute();
  return savedNotification;
};

export const editReadNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  const updatedNotification = await connection
    .createQueryBuilder()
    .update(Notification)
    .set({ read: true })
    .where('id = :notificationId AND "receiverId" = :userId', {
      notificationId,
      userId,
    })
    .execute();
  return updatedNotification;
};

export const editUnreadNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  const updatedNotification = await connection
    .createQueryBuilder()
    .update(Notification)
    .set({ read: false })
    .where('id = :notificationId AND "receiverId" = :userId', {
      notificationId,
      userId,
    })
    .execute();
  return updatedNotification;
};

export const removeAllNotifications = async ({ userId, connection }) => {
  const deletedNotifications = await connection
    .createQueryBuilder()
    .delete()
    .from(Notification)
    .where('"receiverId" = :userId', {
      userId,
    })
    .execute();
  return deletedNotifications;
};
