import app from "../../app";
import { statusCodes } from "../../common/constants";
import { fetchExistingNotifications } from "../../services/postgres/notification";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn, unusedUuid } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection,
  buyer,
  buyerCookie,
  buyerToken,
  seller,
  sellerCookie,
  sellerToken,
  buyerNotifications,
  sellerNotifications,
  readNotificationsBySeller,
  unreadNotificationsBySeller;

describe("Notification tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, buyerNotifications, sellerNotifications] =
      await Promise.all([
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
        fetchExistingNotifications({ userId: validUsers.buyer.id, connection }),
        fetchExistingNotifications({
          userId: validUsers.seller.id,
          connection,
        }),
      ]);
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    readNotificationsBySeller = sellerNotifications.filter((item) => item.read);
    unreadNotificationsBySeller = sellerNotifications.filter(
      (item) => !item.read
    );
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/notifications", () => {
    it("should fetch buyer notifications", async () => {
      const res = await request(app, sellerToken).get("/api/notifications");
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.notifications).toHaveLength(sellerNotifications.length);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get("/api/notifications");
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });
  });

  describe("/api/notifications/:notificationId", () => {
    describe("readNotification", () => {
      it("should read a notification", async () => {
        const res = await request(app, sellerToken).post(
          `/api/notifications/${unreadNotificationsBySeller[0].id}`
        );
        expect(res.statusCode).toEqual(responses.notificationRead.status);
        expect(res.body.message).toEqual(responses.notificationRead.message);
      });

      it("should throw an error if notification is not found", async () => {
        const res = await request(app, sellerToken).post(
          `/api/notifications/${unusedUuid}`
        );
        expect(res.statusCode).toEqual(errors.notificationNotFound.status);
        expect(res.body.message).toEqual(errors.notificationNotFound.message);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).post(
          `/api/notifications/${unreadNotificationsBySeller[0].id}`
        );
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      });
    });

    describe("unreadNotification", () => {
      it("should unread a notification", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/notifications/${readNotificationsBySeller[0].id}`
        );
        expect(res.statusCode).toEqual(responses.notificationUnread.status);
        expect(res.body.message).toEqual(responses.notificationUnread.message);
      });

      it("should throw an error if notification is not found", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/notifications/${unusedUuid}`
        );
        expect(res.statusCode).toEqual(errors.notificationNotFound.status);
        expect(res.body.message).toEqual(errors.notificationNotFound.message);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(
          `/api/notifications/${readNotificationsBySeller[0].id}`
        );
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      });
    });
  });
});
