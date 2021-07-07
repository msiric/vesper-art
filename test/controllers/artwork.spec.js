import path from "path";
import app from "../../app";
import { statusCodes } from "../../common/constants";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { errors as logicErrors, responses } from "../../utils/statuses";
import { request, token } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../test/media");

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

    it("should throw a 400 error if media is missing", async () => {
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
      console.log("RESSSSSSS", res.body, res.error);
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(logicErrors.artworkMediaMissing.message);
    });

    it("should create a new artwork", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "available")
        .field("artworkType", "free")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.message).toEqual(responses.artworkCreated.message);
    });
  });
});
