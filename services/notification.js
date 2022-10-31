import { Notification } from "../entities/Notification";
import { NOTIFICATION_SELECTION, resolveSubQuery } from "../utils/database";

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

// $Needs testing (mongo -> postgres)
export const fetchUserNotifications = async ({
  userId,
  cursor,
  limit,
  direction,
  connection,
}) => {
  // return await Notification.find({
  //   where: [{ receiver: userId }],
  //   skip: cursor,
  //   take: limit,
  //   relations: ["user"],
  //   order: {
  //     created: "DESC",
  //   },
  // });
  const queryElements =
    direction === "previous"
      ? { sign: "<", threshold: Number.MAX_VALUE }
      : { sign: ">", threshold: -1 };

  const queryBuilder = await connection
    .getRepository(Notification)
    .createQueryBuilder("notification");
  const foundNotifications = await queryBuilder
    .select([...NOTIFICATION_SELECTION["ESSENTIAL_INFO"]()])
    .where(
      `notification.receiverId = :userId AND notification.serial ${
        queryElements.sign
      } 
      ${resolveSubQuery(
        queryBuilder,
        "notification",
        Notification,
        cursor,
        queryElements.threshold
      )}`,
      {
        userId,
      }
    )
    .orderBy("notification.serial", "DESC")
    .limit(limit)
    .getMany();
  return foundNotifications;
};
