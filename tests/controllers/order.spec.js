import app from "../../app";
import { statusCodes } from "../../common/constants";
import {
  fetchUserByUsername,
  fetchUserPurchases,
  fetchUserSales,
} from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn, unusedToken } from "../utils/helpers";
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

  describe("/api/orders/sales", () => {
    it("should fetch user sales", async () => {
      const res = await request(app, sellerToken).get("/api/orders/sales");
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.sales).toHaveLength(sellerOrders.length);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get("/api/orders/sales");
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });
  });

  describe("/api/orders/purchases", () => {
    it("should fetch user purchases", async () => {
      const res = await request(app, buyerToken).get("/api/orders/purchases");
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.purchases).toHaveLength(buyerOrders.length);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get("/api/orders/purchases");
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });
  });

  describe("/api/orders/purchases/:artworkId", () => {
    it("should fetch artwork's orders", async () => {
      const artworkOrders = buyerOrders.filter(
        (item) => item.artwork.id === buyerOrders[0].artwork.id
      );
      const res = await request(app, buyerToken).get(
        `/api/orders/purchases/${buyerOrders[0].artwork.id}`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.purchases).toHaveLength(artworkOrders.length);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/orders/purchases/${buyerOrders[0].artwork.id}`
      );
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });
  });

  describe("/api/orders/:orderId", () => {
    it("should fetch order details", async () => {
      const res = await request(app, buyerToken).get(
        `/api/orders/${buyerOrders[0].id}`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.order).toBeTruthy();
    });

    it("should throw an error if order doesn't exist", async () => {
      const res = await request(app, buyerToken).get(
        `/api/orders/${unusedToken}`
      );
      expect(res.statusCode).toEqual(errors.orderNotFound.status);
      expect(res.body.message).toEqual(errors.orderNotFound.message);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/orders/${buyerOrders[0].id}`);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });
  });

  describe("/api/orders/:orderId/download", () => {
    it("should fetch order media", async () => {
      const res = await request(app, buyerToken).get(
        `/api/orders/${buyerOrders[0].id}/download`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.url).toBeTruthy();
      expect(res.body.file).toBeTruthy();
    });

    it("should throw an error if order doesn't exist", async () => {
      const res = await request(app, buyerToken).get(
        `/api/orders/${unusedToken}/download`
      );
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/orders/${buyerOrders[0].id}/download`
      );
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });
  });
});
