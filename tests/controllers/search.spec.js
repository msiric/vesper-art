import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { fetchAllArtworks } from "../../services/postgres/artwork";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { validUsers } from "../fixtures/entities";
import { logUserIn } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

const query = { artwork: "Free but", users: "validuser" };
const type = { artwork: "artwork", users: "users" };

let connection,
  buyer,
  buyerCookie,
  buyerToken,
  seller,
  sellerCookie,
  sellerToken,
  artwork,
  filteredArtwork,
  filteredUsers;

describe.only("Search tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, artwork] = await Promise.all([
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
      fetchAllArtworks({ connection }),
    ]);
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    filteredArtwork = artwork.filter((item) =>
      item.current.title.includes(query.artwork)
    );
    filteredUsers = Object.values(validUsers).filter((item) =>
      item.username.includes(query.users)
    );
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/search", () => {
    it("should find artwork with query 'Free but'", async () => {
      const res = await request(app).get(
        `/api/search?q=${query.artwork}&t=${type.artwork}`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.searchData).toHaveLength(filteredArtwork.length);
      expect(res.body.searchDisplay).toEqual(type.artwork);
    });

    /*     it("should find users with query 'validuser'", async () => {
      const res = await request(app).get(
        `/api/search?q=${query.users}&t=${type.users}`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.searchData).toHaveLength(filteredUsers.length);
      expect(res.body.searchDisplay).toEqual(type.users);
    }); */

    it("should throw an error if query is missing", async () => {
      const res = await request(app).get(`/api/search?q=&t=${type.artwork}`);
      expect(res.statusCode).toEqual(
        validationErrors.searchQueryRequired.status
      );
      expect(res.body.message).toEqual(
        validationErrors.searchQueryRequired.message
      );
    });

    it("should throw an error if query is too long", async () => {
      const res = await request(app).get(
        `/api/search?q=${new Array(ranges.searchQuery.max + 2).join("a")}&t=${
          type.artwork
        }`
      );
      expect(res.statusCode).toEqual(validationErrors.searchQueryMax.status);
      expect(res.body.message).toEqual(validationErrors.searchQueryMax.message);
    });

    it("should throw an error if type is missing", async () => {
      const res = await request(app).get(`/api/search?q=${query.artwork}&t=`);
      expect(res.statusCode).toEqual(
        validationErrors.searchTypeRequired.status
      );
      expect(res.body.message).toEqual(
        validationErrors.searchTypeRequired.message
      );
    });

    it("should throw an error if type is invalid", async () => {
      const res = await request(app).get(
        `/api/search?q=${query.artwork}&t=test`
      );
      expect(res.statusCode).toEqual(validationErrors.searchTypeInvalid.status);
      expect(res.body.message).toEqual(
        validationErrors.searchTypeInvalid.message
      );
    });
  });
});
