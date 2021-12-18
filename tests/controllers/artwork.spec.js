import path from "path";
import app from "../../app";
import { pricing, statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { ArtworkVisibility } from "../../entities/Artwork";
import socketApi from "../../lib/socket";
import { fetchAllArtworks } from "../../services/postgres/artwork";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, errors as logicErrors, responses } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import { logUserIn, unusedToken } from "../utils/helpers";
import { request } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../tests/media");

jest.useFakeTimers();

const socketApiMock = jest
  .spyOn(socketApi, "sendNotification")
  .mockImplementation();

let connection,
  seller,
  buyer,
  impartial,
  artwork,
  sellerCookie,
  sellerToken,
  buyerCookie,
  buyerToken,
  impartialCookie,
  impartialToken,
  visibleAndActiveArtwork,
  invisibleArtwork,
  inactiveArtwork,
  activeArtworkBySeller,
  activeArtworkByBuyer,
  activeAndInvisibleArtworkBySeller,
  inactiveArtworkBySeller,
  artworkWithComments,
  visibleArtworkWithComments,
  invisibleArtworkWithComments,
  filteredComments,
  artworkFavoritedByBuyer,
  artworkFavoritedBySeller,
  visibleArtworkWithFavorites,
  filteredFavorites;

// $TODO add isAuthenticated to each test
describe.skip("Artwork tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [seller, buyer, impartial, artwork] = await Promise.all([
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
      fetchAllArtworks({ connection }),
    ]);
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: impartialCookie, token: impartialToken } = logUserIn(impartial));

    visibleAndActiveArtwork = artwork.filter(
      (item) =>
        item.visibility === ArtworkVisibility.visible && item.active === true
    );
    invisibleArtwork = artwork.filter(
      (item) => item.visibility === ArtworkVisibility.invisible
    );
    inactiveArtwork = artwork.filter((item) => item.active === false);
    activeArtworkBySeller = artwork.filter(
      (item) => item.active === true && item.owner.id === seller.id
    );
    activeArtworkByBuyer = artwork.filter(
      (item) => item.active === true && item.owner.id === buyer.id
    );
    activeAndInvisibleArtworkBySeller = artwork.filter(
      (item) =>
        item.visibility === ArtworkVisibility.invisible &&
        item.active === true &&
        item.owner.id === seller.id
    );
    inactiveArtworkBySeller = artwork.filter(
      (item) => item.active === false && item.owner.id === seller.id
    );
    artworkWithComments = artwork.filter(
      (item) =>
        item.current.title === "Has comments" ||
        item.current.title === "Invisible"
    );
    visibleArtworkWithComments = artworkWithComments.filter(
      (artwork) => artwork.visibility === ArtworkVisibility.visible
    );
    invisibleArtworkWithComments = artworkWithComments.filter(
      (artwork) => artwork.visibility === ArtworkVisibility.invisible
    );
    filteredComments = entities.Comment.filter(
      (comment) => comment.artworkId === visibleArtworkWithComments[0].id
    );
    artworkFavoritedByBuyer = artwork.filter(
      (item) => item.current.title === "Has favorites (buyer)"
    );
    artworkFavoritedBySeller = artwork.filter(
      (item) => item.current.title === "Has favorites (seller)"
    );
    visibleArtworkWithFavorites = artworkFavoritedByBuyer.filter(
      (artwork) => artwork.visibility === ArtworkVisibility.visible
    );
    filteredFavorites = entities.Favorite.filter(
      (favorite) => favorite.artworkId === visibleArtworkWithFavorites[0].id
    );
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/artwork", () => {
    describe("getArtwork", () => {
      it("should fetch active artwork", async () => {
        const res = await request(app).get("/api/artwork").query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.artwork.length).toEqual(visibleAndActiveArtwork.length);
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
      /*       it("should throw a 422 if commercial is invalid but included and user is not onboarded", async () => {
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
      }); */

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
        const res = await request(app)
          .get(`/api/artwork/${visibleAndActiveArtwork[0].id}`)
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
        const res = await request(app)
          .get(`/api/artwork/${invisibleArtwork[0].id}`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });

      it("should throw a 404 error if artwork is not active", async () => {
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
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${activeArtworkBySeller[0].id}/edit`)
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
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${activeArtworkByBuyer[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });

      it("should fetch an active artwork even if it is invisible", async () => {
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${activeAndInvisibleArtworkBySeller[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.artwork).toBeTruthy();
      });

      it("should throw a 404 error if artwork is not active", async () => {
        const res = await request(app, sellerToken)
          .get(`/api/artwork/${inactiveArtworkBySeller[0].id}/edit`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });
    });
  });

  describe("/api/artwork/:artworkId/comments", () => {
    describe("getArtworkComments", () => {
      // test cursor, limit, fetching comments on invisible artwork,
      // fetching comments on inactive artwork,
      // fetching comments on invalid artwork id
      it("should not fetch comments for inactive artwork", async () => {
        const res = await request(app)
          .get(`/api/artwork/${inactiveArtwork[0].id}/comments`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comments.length).toEqual(0);
      });

      it("should not fetch comments for invisible artwork", async () => {
        const res = await request(app)
          .get(`/api/artwork/${invisibleArtworkWithComments[0].id}/comments`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comments.length).toEqual(0);
      });

      it("should fetch artwork comments", async () => {
        const res = await request(app)
          .get(`/api/artwork/${visibleArtworkWithComments[0].id}/comments`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comments.length).toEqual(
          entities.Comment.filter(
            (comment) => comment.artworkId === visibleArtworkWithComments[0].id
          ).length
        );
      });

      it("should limit comments to 1", async () => {
        const cursor = "";
        const limit = 1;
        const res = await request(app)
          .get(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments?cursor=${cursor}&limit=${limit}`
          )
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comments[0].id).toEqual(
          filteredComments[filteredComments.length - 1].id
        );
      });

      it("should limit comments to 1 and skip the first one", async () => {
        const cursor = filteredComments[filteredComments.length - 1].id;
        const limit = 1;
        const res = await request(app)
          .get(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments?cursor=${cursor}&limit=${limit}`
          )
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comments[0].id).toEqual(filteredComments[0].id);
      });
    });
    describe("postComment", () => {
      it("should post a new comment and not send notification if poster owns the artwork", async () => {
        const res = await request(app, sellerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(socketApiMock).not.toHaveBeenCalled();
      });

      it("should post a new comment and send notification", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(socketApiMock).toHaveBeenCalled();
      });

      it("should throw a validation error if the comment content is empty", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "" });
        expect(res.statusCode).toEqual(
          validationErrors.commentContentRequired.status
        );
        expect(res.body.message).toEqual(
          validationErrors.commentContentRequired.message
        );
      });

      it("should throw a validation error if the comment content is too large", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({
            commentContent: new Array(ranges.comment.max + 2).join("a"),
          });
        expect(res.statusCode).toEqual(
          validationErrors.commentContentMax.status
        );
        expect(res.body.message).toEqual(
          validationErrors.commentContentMax.message
        );
      });

      it("should throw a 404 error if the artwork is not found", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${inactiveArtwork[0].id}/comments`)
          .send({
            commentContent: "test",
          });
        expect(res.statusCode).toEqual(statusCodes.notFound);
      });
    });
  });

  describe("/api/artwork/:artworkId/comments/:commentId", () => {
    describe("getComment", () => {
      it("should fetch comment", async () => {
        const res = await request(app)
          .get(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
          )
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comment).toBeTruthy();
      });

      it("should return undefined if artwork does not exist", async () => {
        const res = await request(app)
          .get(`/api/artwork/${unusedToken}/comments/${filteredComments[0].id}`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comment).toBe(undefined);
      });

      it("should return undefined if comment does not exist", async () => {
        const res = await request(app)
          .get(
            `/api/artwork/${unusedToken}/comments/${artworkWithComments[0].id}`
          )
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.comment).toBe(undefined);
      });
    });
    describe("patchComment", () => {
      it("should patch comment", async () => {
        const res = await request(app, buyerToken)
          .patch(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
          )
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if the comment content is too large", async () => {
        const res = await request(app, buyerToken)
          .patch(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
          )
          .send({
            commentContent: new Array(ranges.comment.max + 2).join("a"),
          });
        expect(res.statusCode).toEqual(
          validationErrors.commentContentMax.status
        );
        expect(res.body.message).toEqual(
          validationErrors.commentContentMax.message
        );
      });

      it("should throw a 404 error if comment is patched by non owner", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
          )
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.commentNotFound.message);
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken)
          .patch(
            `/api/artwork/${unusedToken}/comments/${filteredComments[0].id}`
          )
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
      });

      it("should throw a 404 error if comment doesn't exist", async () => {
        const res = await request(app, buyerToken)
          .patch(
            `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${unusedToken}`
          )
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.commentNotFound.message);
      });
    });
    describe("deleteComment", () => {
      it("should delete comment", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a 404 error if comment is deleted by non owner", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
        );
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.commentNotFound.message);
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/artwork/${unusedToken}/comments/${filteredComments[0].id}`
        );
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
      });

      it("should throw a 404 error if comment doesn't exist", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${unusedToken}`
        );
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.commentNotFound.message);
      });
    });
  });

  describe("/api/artwork/:artworkId/favorites", () => {
    describe("getArtworkFavorites", () => {
      it("should fetch artwork favorites", async () => {
        const res = await request(app, buyerToken)
          .get(`/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.favorites).toEqual(filteredFavorites.length);
      });

      it("should return 0 if artwork does not exist", async () => {
        const res = await request(app, buyerToken)
          .get(`/api/artwork/${unusedToken}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.favorites).toBe(0);
      });
    });
    describe("favoriteArtwork", () => {
      it("should favorite artwork", async () => {
        const res = await request(app, impartialToken)
          .post(`/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.message).toEqual(responses.artworkFavorited.message);
      });

      it("should throw a 400 error if artwork favorited by non-owner", async () => {
        const res = await request(app, sellerToken)
          .post(`/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(errors.artworkFavoritedByOwner.status);
        expect(res.body.message).toEqual(
          errors.artworkFavoritedByOwner.message
        );
      });

      it("should throw a 400 error if already favorited artwork is favorited", async () => {
        const res = await request(app, sellerToken)
          .post(`/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(errors.artworkAlreadyFavorited.status);
        expect(res.body.message).toEqual(
          errors.artworkAlreadyFavorited.message
        );
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken).post(
          `/api/artwork/${unusedToken}/favorites`
        );
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
      });
    });
    describe("unfavoriteArtwork", () => {
      it("should unfavorite artwork", async () => {
        const res = await request(app, buyerToken)
          .delete(`/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(statusCodes.ok);
        expect(res.body.message).toEqual(responses.artworkUnfavorited.message);
      });

      it("should throw a 400 error if artwork unfavorited by non-owner", async () => {
        const res = await request(app, sellerToken)
          .delete(`/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(errors.artworkFavoritedByOwner.status);
        expect(res.body.message).toEqual(
          errors.artworkUnfavoritedByOwner.message
        );
      });

      it("should throw a 400 error if unfavorited artwork is unfavorited", async () => {
        const res = await request(app, impartialToken)
          .delete(`/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`)
          .query({});
        expect(res.statusCode).toEqual(errors.artworkAlreadyUnfavorited.status);
        expect(res.body.message).toEqual(
          errors.artworkAlreadyUnfavorited.message
        );
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/artwork/${unusedToken}/favorites`
        );
        expect(res.statusCode).toEqual(statusCodes.notFound);
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
      });
    });
  });
  // $TODO test patch artwork (same as post without the media)
  // $TODO test delete artwork
});
