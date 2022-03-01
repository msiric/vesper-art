import app from "../../app";
import { errors as validationErrors } from "../../common/validation";
import {
  fetchUserByUsername,
  fetchUserPurchases,
  fetchUserSales,
} from "../../services/user";
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
  buyerOrders,
  sellerOrders,
  buyerOrdersWithReview,
  buyerOrdersWithoutReview,
  sellerOrdersWithReview,
  sellerOrdersWithoutReview;

describe("Review tests", () => {
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
    buyerOrdersWithReview = buyerOrders.filter((item) => !!item.review);
    buyerOrdersWithoutReview = buyerOrders.filter((item) => !item.review);
    sellerOrdersWithReview = sellerOrders.filter((item) => !!item.review);
    sellerOrdersWithoutReview = sellerOrders.filter((item) => !item.review);
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/orders/:orderId/reviews", () => {
    it("should post review", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${buyerOrdersWithoutReview[0].id}/reviews`)
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(responses.reviewCreated.message);
      expect(res.statusCode).toEqual(responses.reviewCreated.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).post(
        `/api/orders/${buyerOrdersWithoutReview[0].id}/reviews`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw a validation error if rating is missing", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${buyerOrdersWithoutReview[0].id}/reviews`)
        .send();
      expect(res.body.message).toEqual(
        validationErrors.reviewRatingRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.reviewRatingRequired.status
      );
    });

    it("should throw a validation error if rating is invalid", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${buyerOrdersWithoutReview[0].id}/reviews`)
        .send({ reviewRating: "invalidRating" });
      expect(res.body.message).toEqual(validationErrors.invalidNumber.message);
      expect(res.statusCode).toEqual(validationErrors.invalidNumber.status);
    });

    it("should throw a validation error if rating is below 1", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${buyerOrdersWithoutReview[0].id}/reviews`)
        .send({ reviewRating: 0 });
      expect(res.body.message).toEqual(
        validationErrors.reviewRatingMin.message
      );
      expect(res.statusCode).toEqual(validationErrors.reviewRatingMin.status);
    });

    it("should throw a validation error if rating is above 5", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${buyerOrdersWithoutReview[0].id}/reviews`)
        .send({ reviewRating: 6 });
      expect(res.body.message).toEqual(
        validationErrors.reviewRatingMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.reviewRatingMax.status);
    });

    it("should throw an error if order is not found", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${unusedUuid}/reviews`)
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(errors.orderNotFound.message);
      expect(res.statusCode).toEqual(errors.orderNotFound.status);
    });

    it("should throw an error if review already exists", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/orders/${buyerOrdersWithReview[0].id}/reviews`)
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(errors.reviewAlreadyExists.message);
      expect(res.statusCode).toEqual(errors.reviewAlreadyExists.status);
    });
  });
});
