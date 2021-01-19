import { Notification } from "../../entities/Notification";

export const fetchNotificationById = async ({
  userId,
  notificationId,
  connection,
}) => {
  const foundNotification = await connection
    .getRepository(Notification)
    .createQueryBuilder("notification")
    .where(
      "notification.id = :notificationId AND notification.receiver = :userId",
      {
        notificationId,
        userId,
      }
    )
    .getOne();
  console.log(foundNotification);
  return foundNotification;
};

// $Needs testing (mongo -> postgres)
export const addNewNotification = async ({
  notificationId,
  notificationLink,
  notificationRef,
  notificationType,
  notificationReceiver,
  connection,
}) => {
  // const newNotification = new Notification();
  // newNotification.receiver = notificationReceiver;
  // newNotification.link = notificationLink;
  // newNotification.ref = notificationRef;
  // newNotification.type = notificationType;
  // newNotification.read = false;
  // return await Notification.save(newNotification);

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
    .execute();
  console.log(savedNotification);
  return savedNotification;
};

// $Needs testing (mongo -> postgres)
export const fetchExistingNotifications = async ({ userId, connection }) => {
  // return await Notification.find({
  //   where: [{ receiver: userId }],
  //   order: {
  //     created: "DESC",
  //   },
  // });

  const foundNotifications = await connection
    .getRepository(Notification)
    .createQueryBuilder("notification")
    .where("notification.receiverId = :userId", {
      userId,
    })
    .addOrderBy("notification.created", "DESC")
    .getMany();
  console.log(foundNotifications);
  return foundNotifications;
};

// $Needs testing (mongo -> postgres)
export const editReadNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  /*   const foundNotification = await Notification.findOne({
    where: [{ id: notificationId, receiver: userId }],
  });
  foundNotification.read = true;
  return await Notification.save(foundNotification); */

  const updatedNotification = await connection
    .createQueryBuilder()
    .update(Notification)
    .set({ read: true })
    .where('id = :notificationId AND "receiverId" = :userId', {
      notificationId,
      userId,
    })
    .execute();
  console.log(updatedNotification);
  return updatedNotification;
};

// $Needs testing (mongo -> postgres)
export const editUnreadNotification = async ({
  userId,
  notificationId,
  connection,
}) => {
  /*   const foundNotification = await Notification.findOne({
    where: [{ id: notificationId, receiver: userId }],
  });
  foundNotification.read = false;
  return await Notification.save(foundNotification); */

  const updatedNotification = await connection
    .createQueryBuilder()
    .update(Notification)
    .set({ read: false })
    .where('id = :notificationId AND "receiverId" = :userId', {
      notificationId,
      userId,
    })
    .execute();
  console.log(updatedNotification);
  return updatedNotification;
};
