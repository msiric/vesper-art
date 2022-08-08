import { resolveDateRange } from "@utils/helpers";
import { addDays, format, isAfter, isBefore, isEqual } from "date-fns";
import app from "../../app";
import { statusCodes } from "../../common/constants";
import { fetchUserPurchases, fetchUserSales } from "../../services/order";
import { fetchUserByUsername } from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import { errors } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import { logUserIn, unusedUuid } from "../utils/helpers";
import { request } from "../utils/request";

const DATE_FORMAT = "MM/dd/yyyy";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection,
  buyer,
  buyerToken,
  seller,
  sellerToken,
  buyerOrders,
  sellerOrders,
  firstOrderDate,
  lastOrderDate,
  startDate,
  endDate;

describe("Order tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, buyerOrders, sellerOrders] = await Promise.all([
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
      fetchUserPurchases({ userId: validUsers.buyer.id, connection }),
      fetchUserSales({
        userId: validUsers.seller.id,
        connection,
      }),
    ]);
    ({ token: buyerToken } = logUserIn(buyer));
    ({ token: sellerToken } = logUserIn(seller));
    firstOrderDate = format(new Date(sellerOrders[0].created), DATE_FORMAT);
    lastOrderDate = format(
      new Date(sellerOrders[sellerOrders.length - 1].created),
      DATE_FORMAT
    );
    ({ startDate, endDate } = resolveDateRange({
      start: sellerOrders[0].created,
      end: sellerOrders[sellerOrders.length - 1].created,
    }));
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/users/:userId/orders/sales", () => {
    it("should fetch user sales", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/orders/sales`
      );
      expect(res.body.sales).toHaveLength(sellerOrders.length);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw a 403 error if orders are fetched by non owner", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/orders/sales`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/orders/sales`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });

  describe("/api/user/:userId/orders/purchases", () => {
    it("should fetch user purchases", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/orders/purchases`
      );
      expect(res.body.purchases).toHaveLength(buyerOrders.length);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw a 403 error if orders are fetched by non owner", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/orders/purchases`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/orders/purchases`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });

  describe("/api/users/:userId/orders/purchases/:artworkId", () => {
    it("should fetch artwork's orders", async () => {
      const artworkOrders = buyerOrders.filter(
        (item) => item.artwork.id === buyerOrders[0].artwork.id
      );
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/orders/purchases/${buyerOrders[0].artwork.id}`
      );
      expect(res.body.purchases).toHaveLength(artworkOrders.length);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw a 403 error if orders are fetched by non owner", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/orders/purchases/${buyerOrders[0].artwork.id}`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/orders/purchases/${buyerOrders[0].artwork.id}`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });

  describe("/api/users/:userId/orders/:orderId", () => {
    it("should fetch order details", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/orders/${buyerOrders[0].id}`
      );
      expect(res.body.order).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if order doesn't exist", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/orders/${unusedUuid}`
      );
      expect(res.body.message).toEqual(errors.orderNotFound.message);
      expect(res.statusCode).toEqual(errors.orderNotFound.status);
    });

    it("should throw a 403 error if order is fetched by non owner", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/orders/${buyerOrders[0].id}`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/orders/${buyerOrders[0].id}`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });

  describe("/api/users/:userId/orders/:orderId/download", () => {
    it("should fetch order media", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/orders/${buyerOrders[0].id}/download`
      );
      expect(res.body.file).toBeTruthy();
      expect(res.body.url).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if order doesn't exist", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/orders/${unusedUuid}/download`
      );
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
    });

    it("should throw a 403 error if order media is fetched by non owner", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/orders/${buyerOrders[0].id}/download`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/orders/${buyerOrders[0].id}/download`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });

  describe("/api/users/:userId/statistics/sales", () => {
    it("should fetch user selling statistics", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.body.sales).toHaveLength(
        entities.Order.filter((item) => item.sellerId === seller.id).length
      );
      expect(res.body.reviews).toHaveLength(
        entities.Review.filter((item) => item.revieweeId === seller.id).length
      );
      expect(res.body.amount).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/statistics/purchases", () => {
    it("should fetch user buying statistics", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.body.purchases).toHaveLength(
        entities.Order.filter((item) => item.buyerId === buyer.id).length
      );
      expect(res.body.favorites).toHaveLength(
        entities.Favorite.filter((item) => item.ownerId === buyer.id).length
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/purchases", () => {
    it("should fetch buyer purchases for set dates", async () => {
      const start = firstOrderDate;
      const end = lastOrderDate;
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.statistics).toHaveLength(
        buyerOrders.filter(
          (item) =>
            (isEqual(new Date(item.created), startDate) ||
              isAfter(new Date(item.created), startDate)) &&
            (isBefore(new Date(item.created), endDate) ||
              isEqual(new Date(item.created), endDate))
        ).length
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if dates are not set", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is invalid", async () => {
      const start = "invalid";
      const end = lastOrderDate;
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is invalid", async () => {
      const start = firstOrderDate;
      const end = "invalid";
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is in the future", async () => {
      const start = format(addDays(new Date(), 1), DATE_FORMAT);
      const end = lastOrderDate;
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is in the future", async () => {
      const start = firstOrderDate;
      const end = format(addDays(new Date(), 1), DATE_FORMAT);
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/purchases`);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/purchases`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/sales", () => {
    it("should fetch seller sales for set dates", async () => {
      const start = firstOrderDate;
      const end = lastOrderDate;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.statistics).toHaveLength(
        sellerOrders.filter(
          (item) =>
            (isEqual(new Date(item.created), startDate) ||
              isAfter(new Date(item.created), startDate)) &&
            (isBefore(new Date(item.created), endDate) ||
              isEqual(new Date(item.created), endDate))
        ).length
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if dates are not set", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is invalid", async () => {
      const start = "invalid";
      const end = lastOrderDate;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is invalid", async () => {
      const start = firstOrderDate;
      const end = "invalid";
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is in the future", async () => {
      const start = format(addDays(new Date(), 1), DATE_FORMAT);
      const end = lastOrderDate;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is in the future", async () => {
      const start = firstOrderDate;
      const end = format(addDays(new Date(), 1), DATE_FORMAT);
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/sales`);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/sales`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });
});
