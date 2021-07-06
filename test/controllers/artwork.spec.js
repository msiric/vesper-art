import app from "../../app";
import { statusCodes } from "../../common/constants";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { request } from "../utils/request";

jest.useFakeTimers();

let connection;

describe("Artwork tests", () => {
  beforeAll(async () => {
    connection = await connectToDatabase();
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/artwork", () => {
    // needs a valid user in db to finish properly
    it("should fetch active artwork", async () => {
      const res = await request(app).get("/api/artwork").query({});
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.artwork).toEqual([]);
    });
  });
});
