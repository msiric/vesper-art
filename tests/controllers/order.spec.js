import app from "../../app";
import { statusCodes } from "../../common/constants";
import {
  fetchUserByUsername,
  fetchUserPurchases,
  fetchUserSales,
} from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import { errors } from "../../utils/statuses";
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
  buyerOrders,
  sellerOrders;

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
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
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
});
