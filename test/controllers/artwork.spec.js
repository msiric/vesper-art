import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors } from "../../common/validation";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { errors as logicErrors } from "../../utils/statuses";
import { request, token } from "../utils/request";

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

    it("should throw a 403 error if user is not authenticated", async () => {
      const res = await request(app).post("/api/artwork").send({
        artworkTitle: "test",
        artworkAvailability: "available",
        artworkType: "available",
        artworkLicense: "personal",
        artworkPersonal: 10,
        artworkUse: "included",
        artworkCommercial: 0,
        artworkVisibility: "visible",
        artworkDescription: "test",
      });
      expect(res.statusCode).toEqual(statusCodes.forbidden);
      expect(res.body.message).toEqual(logicErrors.forbiddenAccess.message);
    });

    it("should throw a validation error if title is missing", async () => {
      const res = await request(app, token).post("/api/artwork").send({
        artworkTitle: "test",
        artworkAvailability: "available",
        artworkType: "available",
        artworkLicense: "personal",
        artworkPersonal: 10,
        artworkUse: "included",
        artworkCommercial: 0,
        artworkVisibility: "visible",
        artworkDescription: "test",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(validationErrors.artworkTitleRequired);
    });
  });
});
