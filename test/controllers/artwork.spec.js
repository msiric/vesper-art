import path from "path";
import app from "../../app";
import { pricing, statusCodes } from "../../common/constants";
import { errors as validationErrors } from "../../common/validation";
import { ArtworkVisibility } from "../../entities/Artwork";
import { fetchAllArtworks } from "../../services/postgres/artwork";
import { fetchUserByUsername } from "../../services/postgres/user";
import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { formatTokenData } from "../../utils/helpers";
import { USER_SELECTION } from "../../utils/selectors";
import { errors as logicErrors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { request } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../test/media");

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection;
let seller;
let buyer;
let artwork;
let sellerCookie;
let sellerToken;
let buyerCookie;
let buyerToken;

describe("Artwork tests", () => {
  beforeAll(async (done) => {
    connection = await connectToDatabase();
    [seller, buyer, artwork] = await Promise.all([
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
      fetchAllArtworks({ connection }),
    ]);
    const { tokenPayload: sellerPayload } = formatTokenData({ user: seller });
    sellerCookie = createRefreshToken({ userData: sellerPayload });
    sellerToken = createAccessToken({ userData: sellerPayload });
    const { tokenPayload: buyerPayload } = formatTokenData({ user: buyer });
    buyerCookie = createRefreshToken({ userData: buyerPayload });
    buyerToken = createAccessToken({ userData: buyerPayload });
    done();
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/artwork", () => {
    describe("getArtwork", () => {
      it("should fetch active artwork", async () => {
        const res = await request(app).get("/api/artwork").query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.artwork.length).toEqual(
          artwork.filter(
            (item) =>
              item.visibility === ArtworkVisibility.visible &&
              item.active === true
          ).length
        );
      });

      it("should throw a 400 error if cursor is of invalid type", async () => {
        const res = await request(app).get("/api/artwork").query({ cursor: 0 });
        expect(res.body.message).toEqual(logicErrors.routeQueryInvalid.message);
        expect(res.statusCode).toEqual(logicErrors.routeQueryInvalid.status);
      });

      it("should throw a 400 error if cursor is of invalid UUID version", async () => {
        const res = await request(app)
          .get("/api/artwork")
          .query({ cursor: "5831028a-3af3-11ec-8d3d-0242ac130003" });
        expect(res.body.message).toEqual(logicErrors.routeQueryInvalid.message);
        expect(res.statusCode).toEqual(logicErrors.routeQueryInvalid.status);
      });
    });

    describe("postNewArtwork", () => {
      it("should create a new artwork", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(responses.artworkCreated.message);
        expect(res.statusCode).toEqual(statusCodes.ok);
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
        expect(res.body.message).toEqual(logicErrors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(statusCodes.forbidden);
      });

      it("should throw a 400 error if media is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          logicErrors.artworkMediaMissing.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if media has invalid dimensions", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(
              __dirname,
              `${MEDIA_LOCATION}/invalid_dimensions_art.jpg`
            )
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          logicErrors.fileDimensionsInvalid.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if media has an invalid extension", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/invalid_extension.txt`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          validationErrors.artworkMediaType.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if media has an invalid ratio", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/invalid_ratio.jpg`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          logicErrors.aspectRatioInvalid.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if title is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkTitleRequired.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if availability is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkAvailabilityRequired.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if availability is invalid", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "invalid")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkAvailabilityInvalid.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if type is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkTypeRequired.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if type is invalid", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "invalid")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkTypeInvalid.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should pass if type is invalid but artwork is 'preview only'", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "unavailable")
          .field("artworkType", "invalid")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(responses.artworkCreated.message);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if license is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkLicenseRequired.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if license is invalid", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "invalid")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkLicenseInvalid.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should pass if license is invalid but artwork is 'preview only'", async () => {
        const res = await request(app, sellerToken)
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
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(responses.artworkCreated.message);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if personal is not an integer", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", "invalid")
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.invalidNumber.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if personal is below the minimum price", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice - 1)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkPersonalMin.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if personal is above the maximum price", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.maximumPrice + 1)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkPersonalMax.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should pass if personal is zero and artwork is not available/commercial/separate/personal", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", 0)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(responses.artworkCreated.message);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if use is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", 0)
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkUseRequired.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if use is invalid", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", 0)
          .field("artworkUse", "invalid")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkUseInvalid.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should pass if use is invalid but artwork is available/personal", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", 0)
          .field("artworkUse", "invalid")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(responses.artworkCreated.message);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if commercial is invalid", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", 20)
          .field("artworkUse", "separate")
          .field("artworkCommercial", 20)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMin.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      // $TODO create a user that is not onboarded
      it.skip("should throw a 422 if commercial is invalid but included and user is not onboarded", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", 20)
          .field("artworkUse", "included")
          .field("artworkCommercial", "")
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          logicErrors.stripeOnboardingIncomplete.message
        );
        expect(res.statusCode).toEqual(statusCodes.unprocessable);
      });

      it("should throw a validation error if commercial is not an integer", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", 0)
          .field("artworkUse", "separate")
          .field("artworkCommercial", "invalid")
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");
        expect(res.body.message).toEqual(
          validationErrors.invalidNumber.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if commercial is below the minimum price", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", pricing.minimumPrice)
          .field("artworkUse", "separate")
          .field("artworkCommercial", pricing.minimumPrice - 1)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMin.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if commercial is above the maximum price", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", pricing.minimumPrice)
          .field("artworkUse", "separate")
          .field("artworkCommercial", pricing.maximumPrice + 1)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMax.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if commercial is below the personal license price", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "commercial")
          .field("artworkLicense", "commercial")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "separate")
          .field("artworkCommercial", pricing.minimumPrice + 5)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMin.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should pass if commercial is zero and artwork is not available/commercial/separate/personal", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", 0)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(responses.artworkCreated.message);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if visibility is missing", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_art.png`)
          )
          .field("artworkTitle", "test")
          .field("artworkAvailability", "available")
          .field("artworkType", "free")
          .field("artworkLicense", "personal")
          .field("artworkPersonal", pricing.minimumPrice + 10)
          .field("artworkUse", "included")
          .field("artworkCommercial", 0)
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          validationErrors.artworkVisibilityRequired.message
        );
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });
    });
  });

  describe("/api/artwork/:artworkId", () => {
    describe("getArtworkDetails", () => {
      it("should fetch a visible and active artwork", async () => {
        const visibleArtwork = artwork.filter(
          (item) =>
            item.visibility === ArtworkVisibility.visible &&
            item.active === true
        );
        const res = await request(app)
          .get(`/api/artwork/${visibleArtwork[0].id}`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.artwork).toBeTruthy();
      });

      it("should throw a validation error if artwork id is invalid", async () => {
        const res = await request(app).get("/api/artwork/invalidId").query({});
        expect(res.body.message).toEqual(
          logicErrors.routeParameterInvalid.message
        );
        expect(res.statusCode).toEqual(
          logicErrors.routeParameterInvalid.status
        );
      });

      it("should throw a 404 error if artwork is not visible", async () => {
        const invisibleArtwork = artwork.filter(
          (item) => item.visibility === ArtworkVisibility.invisible
        );
        const res = await request(app)
          .get(`/api/artwork/${invisibleArtwork[0].id}`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });

      it("should throw a 404 error if artwork is not active", async () => {
        const inactiveArtwork = artwork.filter((item) => item.active === false);
        const res = await request(app)
          .get(`/api/artwork/${inactiveArtwork[0].id}`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });
    });
  });

  describe("/api/artwork/:artworkId/edit", () => {
    describe("getArtworkEdit", () => {
      it("should fetch an active artwork if user is owner", async () => {
        const visibleArtwork = artwork.filter(
          (item) => item.active === true && item.owner.id === seller.id
        );
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${visibleArtwork[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.artwork).toBeTruthy();
      });

      it("should throw a validation error if artwork id is invalid", async () => {
        const res = await request(app, sellerToken)
          .get("/api/artwork/invalidId/edit")
          .query({});
        expect(res.body.message).toEqual(
          logicErrors.routeParameterInvalid.message
        );
        expect(res.statusCode).toEqual(
          logicErrors.routeParameterInvalid.status
        );
      });

      it("should throw a 404 error if user is not owner", async () => {
        const visibleArtwork = artwork.filter(
          (item) => item.active === true && item.owner.id === buyer.id
        );
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${visibleArtwork[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });

      it("should fetch an active artwork even if it is invisible", async () => {
        const activeArtwork = artwork.filter(
          (item) =>
            item.visibility === ArtworkVisibility.invisible &&
            item.active === true &&
            item.owner.id === seller.id
        );
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${activeArtwork[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.artwork).toBeTruthy();
      });

      it("should throw a 404 error if artwork is not active", async () => {
        const inactiveArtwork = artwork.filter(
          (item) => item.active === false && item.owner.id === seller.id
        );
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${inactiveArtwork[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });
    });
  });
  // $TODO test patch artwork (same as post without the media)
  // $TODO test delete artwork
});
