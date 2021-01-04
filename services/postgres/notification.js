import { Notification } from "../../entities/Notification";

export const fetchNotificationById = async ({ userId, notificationId }) => {
  const foundNotification = await getConnection()
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
  notificationLink,
  notificationRef,
  notificationType,
  notificationReceiver,
}) => {
  const newNotification = new Notification();
  newNotification.receiver = notificationReceiver;
  newNotification.link = notificationLink;
  newNotification.ref = notificationRef;
  newNotification.type = notificationType;
  newNotification.read = false;
  return await Notification.save(newNotification);
};

// $Needs testing (mongo -> postgres)
export const fetchExistingNotifications = async ({ userId }) => {
  // return await Notification.find({
  //   where: [{ receiver: userId }],
  //   order: {
  //     created: "DESC",
  //   },
  // });

  const foundNotifications = await getConnection()
    .getRepository(Notification)
    .createQueryBuilder("notification")
    .where("notification.receiverId = :id", {
      id: userId,
    })
    .addOrderBy("notification.created", "DESC")
    .getMany();
  console.log(foundNotifications);
  return foundNotifications;
};

// $Needs testing (mongo -> postgres)
export const editReadNotification = async ({ userId, notificationId }) => {
  /*   const foundNotification = await Notification.findOne({
    where: [{ id: notificationId, receiver: userId }],
  });
  foundNotification.read = true;
  return await Notification.save(foundNotification); */

  const updatedNotification = await getConnection()
    .createQueryBuilder()
    .update(Notification)
    .set({ read: true })
    .where("id = :notificationId AND receiver = :userId", {
      notificationId,
      userId,
    })
    .execute();
  console.log(updatedNotification);
  return updatedNotification;
};

// $Needs testing (mongo -> postgres)
export const editUnreadNotification = async ({ userId, notificationId }) => {
  /*   const foundNotification = await Notification.findOne({
    where: [{ id: notificationId, receiver: userId }],
  });
  foundNotification.read = false;
  return await Notification.save(foundNotification); */

  const updatedNotification = await getConnection()
    .createQueryBuilder()
    .update(Notification)
    .set({ read: false })
    .where("id = :notificationId AND receiver = :userId", {
      notificationId,
      userId,
    })
    .execute();
  console.log(updatedNotification);
  return updatedNotification;
};
