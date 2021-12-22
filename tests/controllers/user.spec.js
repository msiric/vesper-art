import app from "../../app";
import { statusCodes } from "../../common/constants";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors } from "../../utils/statuses";
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
  impartial,
  impartialCookie,
  impartialToken;

describe.only("User tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, impartial] = await Promise.all([
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
      fetchUserByUsername({
        userUsername: validUsers.impartial.username,
        selection: [
          ...USER_SELECTION["ESSENTIAL_INFO"](),
          ...USER_SELECTION["STRIPE_INFO"](),
          ...USER_SELECTION["VERIFICATION_INFO"](),
          ...USER_SELECTION["AUTH_INFO"](),
          ...USER_SELECTION["LICENSE_INFO"](),
        ],
        connection,
      }),
    ]);
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    ({ cookie: impartialCookie, token: impartialToken } = logUserIn(impartial));
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe.only("/api/users/:userUsername", () => {
    it("should find user with provided username", async () => {
      const res = await request(app).get(`/api/users/${buyer.name}`);
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.user).toBeTruthy();
    });

    it("should throw an error if user doesn't exist", async () => {
      const res = await request(app).get(`/api/users/unknownUser`);
      expect(res.statusCode).toEqual(errors.userNotFound.status);
      expect(res.body.message).toEqual(errors.userNotFound.message);
    });
  });
});
