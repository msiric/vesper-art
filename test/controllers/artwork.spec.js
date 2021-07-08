import path from "path";
import app from "../../app";
import { pricing, statusCodes } from "../../common/constants";
import { errors as validationErrors } from "../../common/validation";
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
      const res = await request(app, token)
        .post("/api/artwork")
        .field("artworkTitle", "test")
        .field("artworkAvailability", "available")
        .field("artworkType", "free")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(logicErrors.artworkMediaMissing.message);
    });

    it("should throw a validation error if title is missing", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkAvailability", "available")
        .field("artworkType", "free")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkTitleRequired.message
      );
    });

    it("should throw a validation error if availability is missing", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkType", "free")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkAvailabilityRequired.message
      );
    });

    it("should throw a validation error if availability is invalid", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "invalid")
        .field("artworkType", "free")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkAvailabilityInvalid.message
      );
    });

    it("should throw a validation error if type is missing", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "available")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkTypeRequired.message
      );
    });

    it("should throw a validation error if type is invalid", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "available")
        .field("artworkType", "invalid")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkTypeInvalid.message
      );
    });

    it("should pass if type is invalid but artwork is 'preview only'", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "unavailable")
        .field("artworkType", "invalid")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.message).toEqual(responses.artworkCreated.message);
    });

    it("should throw a validation error if license is missing", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "available")
        .field("artworkType", "free")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkLicenseRequired.message
      );
    });

    it("should throw a validation error if license is invalid", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "available")
        .field("artworkType", "free")
        .field("artworkLicense", "invalid")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkLicenseInvalid.message
      );
    });

    it("should pass if license is invalid but artwork is 'preview only'", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "test")
        .field("artworkAvailability", "unavailable")
        .field("artworkType", "free")
        .field("artworkLicense", "invalid")
        .field("artworkPersonal", 10)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.message).toEqual(responses.artworkCreated.message);
    });

    it("should throw a validation error if personal is not an integer", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "actualtest")
        .field("artworkAvailability", "available")
        .field("artworkType", "commercial")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", "invalid")
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(validationErrors.invalidNumber.message);
    });

    it("should throw a validation error if personal is below the minimum price", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "actualtest")
        .field("artworkAvailability", "available")
        .field("artworkType", "commercial")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", pricing.minimumPrice - 1)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkPersonalMin.message
      );
    });

    it("should throw a validation error if personal is above the maximum price", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "actualtest")
        .field("artworkAvailability", "available")
        .field("artworkType", "commercial")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", pricing.maximumPrice + 1)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkPersonalMax.message
      );
    });

    it("should pass if personal is zero and artwork is not available/commercial/separate/personal", async () => {
      const res = await request(app, token)
        .post("/api/artwork")
        .attach(
          "artworkMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
        )
        .field("artworkTitle", "actualtest")
        .field("artworkAvailability", "available")
        .field("artworkType", "free")
        .field("artworkLicense", "personal")
        .field("artworkPersonal", 0)
        .field("artworkUse", "included")
        .field("artworkCommercial", 0)
        .field("artworkVisibility", "visible")
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.message).toEqual(responses.artworkCreated.message);
    });

    it("should throw a validation error if visibility is missing", async () => {
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
        .field("artworkDescription", "test");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkVisibilityRequired.message
      );
    });

    it("should throw a validation error if description is missing", async () => {
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
        .field("artworkVisibility", "visible");

      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.artworkDescriptionRequired.message
      );
    });
  });
});
