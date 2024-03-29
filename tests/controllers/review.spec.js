import app from "../../app";
import { errors as validationErrors } from "../../common/validation";
import { fetchUserPurchases } from "../../services/order";
import { fetchUserByUsername } from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import { errors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn, unusedUuid } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection,
  buyer,
  buyerToken,
  seller,
  sellerToken,
  buyerOrders,
  buyerOrdersWithReview,
  buyerOrdersWithoutReview;

describe("Review tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, buyerOrders] = await Promise.all([
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
    ]);
    ({ token: buyerToken } = logUserIn(buyer));
    ({ token: sellerToken } = logUserIn(seller));
    buyerOrdersWithReview = buyerOrders.filter((item) => !!item.review);
    buyerOrdersWithoutReview = buyerOrders.filter((item) => !item.review);
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/users/:userId/orders/:orderId/reviews", () => {
    it("should post review", async () => {
      const res = await request(app, buyerToken)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(responses.reviewCreated.message);
      expect(res.statusCode).toEqual(responses.reviewCreated.status);
    });

    it("should throw a 403 error if review is posted by non owner", async () => {
      const res = await request(app, sellerToken)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw a validation error if rating is missing", async () => {
      const res = await request(app, buyerToken)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
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
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
        .send({ reviewRating: "invalidRating" });
      expect(res.body.message).toEqual(validationErrors.invalidNumber.message);
      expect(res.statusCode).toEqual(validationErrors.invalidNumber.status);
    });

    it("should throw a validation error if rating is below 1", async () => {
      const res = await request(app, buyerToken)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
        .send({ reviewRating: 0 });
      expect(res.body.message).toEqual(
        validationErrors.reviewRatingMin.message
      );
      expect(res.statusCode).toEqual(validationErrors.reviewRatingMin.status);
    });

    it("should throw a validation error if rating is above 5", async () => {
      const res = await request(app, buyerToken)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithoutReview[0].id}/reviews`
        )
        .send({ reviewRating: 6 });
      expect(res.body.message).toEqual(
        validationErrors.reviewRatingMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.reviewRatingMax.status);
    });

    it("should throw an error if order is not found", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/users/${buyer.id}/orders/${unusedUuid}/reviews`)
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(errors.orderNotFound.message);
      expect(res.statusCode).toEqual(errors.orderNotFound.status);
    });

    it("should throw an error if review already exists", async () => {
      const res = await request(app, buyerToken)
        .post(
          `/api/users/${buyer.id}/orders/${buyerOrdersWithReview[0].id}/reviews`
        )
        .send({ reviewRating: 5 });
      expect(res.body.message).toEqual(errors.reviewAlreadyExists.message);
      expect(res.statusCode).toEqual(errors.reviewAlreadyExists.status);
    });
  });
});
