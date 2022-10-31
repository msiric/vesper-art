import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { fetchAllArtworks } from "../../services/artwork";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { validUsers } from "../fixtures/entities";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

const query = { artwork: "Free but", users: "validuser" };
const type = { artwork: "artwork", users: "users" };

let connection, artwork, filteredArtwork, filteredUsers;

describe("Search tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [artwork] = await Promise.all([fetchAllArtworks({ connection })]);
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
      expect(res.body.searchData).toHaveLength(filteredArtwork.length);
      expect(res.body.searchDisplay).toEqual(type.artwork);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should find users with query 'validuser'", async () => {
      const res = await request(app).get(
        `/api/search?q=${query.users}&t=${type.users}`
      );
      expect(res.body.searchData).toHaveLength(filteredUsers.length);
      expect(res.body.searchDisplay).toEqual(type.users);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

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
      expect(res.body.message).toEqual(validationErrors.searchQueryMax.message);
      expect(res.statusCode).toEqual(validationErrors.searchQueryMax.status);
    });

    it("should throw an error if type is missing", async () => {
      const res = await request(app).get(`/api/search?q=${query.artwork}&t=`);
      expect(res.body.message).toEqual(
        validationErrors.searchTypeRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.searchTypeRequired.status
      );
    });

    it("should throw an error if type is invalid", async () => {
      const res = await request(app).get(
        `/api/search?q=${query.artwork}&t=test`
      );
      expect(res.body.message).toEqual(
        validationErrors.searchTypeInvalid.message
      );
      expect(res.statusCode).toEqual(validationErrors.searchTypeInvalid.status);
    });
  });
});
