import app from "../../app";
import { statusCodes } from "../../common/constants";
import {
  fetchUserByUsername,
  fetchUserPurchases,
  fetchUserSales,
} from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { validUsers } from "../fixtures/entities";
import { logUserIn } from "../utils/helpers";
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

describe.skip("Verifier tests", () => {
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

  describe("/api/verifier", () => {
    it("should return essential license data", async () => {
      const res = await request(app, buyerToken).post("/api/verifier").send({});
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.license).toEqual("");
    });
  });
});
