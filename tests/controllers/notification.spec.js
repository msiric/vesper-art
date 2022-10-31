import app from "../../app";
import { statusCodes } from "../../common/constants";
import { fetchExistingNotifications } from "../../services/notification";
import { fetchUserByUsername } from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import { errors, responses } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import { logUserIn, unusedUuid } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection,
  buyer,
  buyerToken,
  seller,
  sellerToken,
  sellerNotifications,
  readNotificationsBySeller,
  unreadNotificationsBySeller;

describe("Notification tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, sellerNotifications] = await Promise.all([
      fetchUserByUsername({
        userUsername: validUsers.buyer.username,
        selection: [
          ...USER_SELECTION["ESSENTIAL_INFO"](),
          ...USER_SELECTION["STRIPE_INFO"](),
          ...USER_SELECTION["VERIFICATION_INFO"](),
          ...USER_SELECTION["AUTH_INFO"](),
          ...USER_SELECTION["LICENSE_INFO"](),
        ],
        connection,
      }),
      fetchUserByUsername({
        userUsername: validUsers.seller.username,
        selection: [
          ...USER_SELECTION["ESSENTIAL_INFO"](),
          ...USER_SELECTION["STRIPE_INFO"](),
          ...USER_SELECTION["VERIFICATION_INFO"](),
          ...USER_SELECTION["AUTH_INFO"](),
          ...USER_SELECTION["LICENSE_INFO"](),
        ],
        connection,
      }),
      fetchExistingNotifications({
        userId: validUsers.seller.id,
        connection,
      }),
    ]);
    ({ token: buyerToken } = logUserIn(buyer));
    ({ token: sellerToken } = logUserIn(seller));
    readNotificationsBySeller = sellerNotifications.filter((item) => item.read);
    unreadNotificationsBySeller = sellerNotifications.filter(
      (item) => !item.read
    );
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/users/:userId/notifications", () => {
    it("should fetch buyer notifications", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications`
      );
      expect(res.body.notifications).toHaveLength(sellerNotifications.length);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw a 403 error if notifications are fetched by non owner", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/notifications`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/notifications`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });

  describe("/api/users/:userId/notifications/:notificationId", () => {
    describe("readNotification", () => {
      it("should read a notification", async () => {
        const res = await request(app, sellerToken).post(
          `/api/users/${seller.id}/notifications/${unreadNotificationsBySeller[0].id}`
        );
        expect(res.body.message).toEqual(responses.notificationRead.message);
        expect(res.statusCode).toEqual(responses.notificationRead.status);
      });

      it("should throw an error if notification is not found", async () => {
        const res = await request(app, sellerToken).post(
          `/api/users/${seller.id}/notifications/${unusedUuid}`
        );
        expect(res.body.message).toEqual(errors.notificationNotFound.message);
        expect(res.statusCode).toEqual(errors.notificationNotFound.status);
      });

      it("should throw a 403 error if notification is read by non owner", async () => {
        const res = await request(app, buyerToken).post(
          `/api/users/${seller.id}/notifications/${unreadNotificationsBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).post(
          `/api/users/${seller.id}/notifications/${unreadNotificationsBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });

    describe("unreadNotification", () => {
      it("should unread a notification", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/notifications/${readNotificationsBySeller[0].id}`
        );
        expect(res.body.message).toEqual(responses.notificationUnread.message);
        expect(res.statusCode).toEqual(responses.notificationUnread.status);
      });

      it("should throw an error if notification is not found", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/notifications/${unusedUuid}`
        );
        expect(res.body.message).toEqual(errors.notificationNotFound.message);
        expect(res.statusCode).toEqual(errors.notificationNotFound.status);
      });

      it("should throw a 403 error if notification is unread by non owner", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${seller.id}/notifications/${readNotificationsBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(
          `/api/users/${seller.id}/notifications/${readNotificationsBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });

    describe("/api/users/:userId/notifications/previous", () => {
      let userNotifications;
      beforeAll(() => {
        userNotifications = entities.Notification.filter(
          (item) => item.receiverId === seller.id
        );
      });
      it("should fetch previous seller notifications", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/notifications/previous`
        );
        expect(res.body.notifications).toHaveLength(userNotifications.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user notifications to 1", async () => {
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/notifications/previous?cursor=&limit=${limit}`
        );
        expect(res.body.notifications).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user notifications to 1 and skip the first one", async () => {
        const cursor = userNotifications[userNotifications.length - 1].id;
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/notifications/previous?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.notifications[0].id).toEqual(
          userNotifications[userNotifications.length - 2].id
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).get(
          `/api/users/${seller.id}/notifications/previous`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${seller.id}/notifications/previous`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
    });

    describe("/api/users/:userId/notifications/latest", () => {
      let userNotifications;
      beforeAll(() => {
        userNotifications = entities.Notification.filter(
          (item) => item.receiverId === seller.id
        );
      });
      it("should fetch latest seller notifications", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/notifications/latest`
        );
        expect(res.body.notifications).toHaveLength(userNotifications.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user notifications to 1", async () => {
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/notifications/latest?cursor=&limit=${limit}`
        );
        expect(res.body.notifications).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user notifications to 1 and skip the first one", async () => {
        const cursor = userNotifications[0].id;
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/notifications/latest?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.notifications[0].id).toEqual(
          userNotifications[userNotifications.length - 1].id
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).get(
          `/api/users/${seller.id}/notifications/latest`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${seller.id}/notifications/latest`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
    });
  });
});
