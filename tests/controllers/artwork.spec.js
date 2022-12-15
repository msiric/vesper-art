import path from "path";
import app from "../../app";
import { featureFlags, pricing, statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { ArtworkVisibility } from "../../entities/Artwork";
import * as s3Utils from "../../lib/s3";
import socketApi from "../../lib/socket";
import * as artworkServices from "../../services/artwork";
import { fetchAllArtworks } from "../../services/artwork";
import { fetchUserByUsername } from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import { errors, responses } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import {
  findMultiOrderedArtwork,
  findSingleOrderedArtwork,
  findUniqueOrders,
  findUnorderedArtwork,
  logUserIn,
  unusedUuid,
} from "../utils/helpers";
import { request } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../tests/media");

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

const s3Mock = jest.spyOn(s3Utils, "deleteS3Object");

const socketApiMock = jest
  .spyOn(socketApi, "sendNotification")
  .mockImplementation();

const deactivateVersionMock = jest.spyOn(
  artworkServices,
  "deactivateArtworkVersion"
);
const deactivateArtworkMock = jest.spyOn(
  artworkServices,
  "deactivateExistingArtwork"
);
const removeVersionMock = jest.spyOn(artworkServices, "removeArtworkVersion");

let connection,
  seller,
  buyer,
  impartial,
  artwork,
  artworkBySeller,
  sellerToken,
  buyerToken,
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
  buyerComments,
  sellerComments,
  commentsLikedBySeller,
  artworkFavoritedByBuyer,
  artworkFavoritedBySeller,
  visibleArtworkWithFavorites,
  filteredFavorites,
  visibleAndActiveArtworkBySeller,
  unorderedArtwork,
  onceOrderedArtworkWithNewVersion,
  multiOrderedArtworkWithNoNewVersions,
  uniqueOrders;

describe("Artwork tests", () => {
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
    ({ token: sellerToken } = logUserIn(seller));
    ({ token: buyerToken } = logUserIn(buyer));
    ({ token: impartialToken } = logUserIn(impartial));
    artworkBySeller = artwork.filter((item) => item.owner.id === seller.id);
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
    buyerComments = filteredComments.filter(
      (comment) => comment.ownerId === buyer.id
    );
    sellerComments = filteredComments.filter(
      (comment) => comment.ownerId === seller.id
    );
    commentsLikedBySeller = entities.Like.filter(
      (item) => item.ownerId === seller.id
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
    visibleAndActiveArtworkBySeller = artworkBySeller.filter(
      (item) =>
        item.visibility === ArtworkVisibility.visible && item.active === true
    );
    unorderedArtwork = findUnorderedArtwork(
      activeArtworkBySeller,
      entities.Order
    );
    onceOrderedArtworkWithNewVersion = findSingleOrderedArtwork(entities.Order);
    multiOrderedArtworkWithNoNewVersions = findUniqueOrders(
      findMultiOrderedArtwork(entities.Order)
    );
    uniqueOrders = findUniqueOrders(entities.Order);
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/artwork", () => {
    describe("getArtwork", () => {
      it("should fetch active artwork", async () => {
        const res = await request(app).get("/api/artwork");
        expect(res.body.artwork.length).toEqual(visibleAndActiveArtwork.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a 400 error if cursor is of invalid type", async () => {
        const cursor = 0;
        const res = await request(app).get(`/api/artwork?cursor=${cursor}`);
        expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
        expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
      });

      it("should throw a 400 error if cursor is of invalid UUID version", async () => {
        const cursor = "5831028a-3af3-11ec-8d3d-0242ac130003";
        const res = await request(app).get(`/api/artwork?cursor=${cursor}`);
        expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
        expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
      });

      it("should limit artwork to 1", async () => {
        const limit = 1;
        const res = await request(app).get(
          `/api/artwork?cursor=&limit=${limit}`
        );
        expect(res.body.artwork).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit artwork to 1 and skip the first one", async () => {
        const cursor = visibleAndActiveArtwork[0].id;
        const limit = 1;
        const res = await request(app).get(
          `/api/artwork?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.artwork[0].id).toEqual(visibleAndActiveArtwork[1].id);
        expect(res.statusCode).toEqual(statusCodes.ok);
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
        expect(res.statusCode).toEqual(responses.artworkCreated.status);
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
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
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
        expect(res.body.message).toEqual(errors.artworkMediaMissing.message);
        expect(res.statusCode).toEqual(errors.artworkMediaMissing.status);
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
        expect(res.body.message).toEqual(errors.fileDimensionsInvalid.message);
        expect(res.statusCode).toEqual(errors.fileDimensionsInvalid.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkMediaType.status
        );
      });

      it("should throw a validation error if media has an invalid ratio", async () => {
        const res = await request(app, sellerToken)
          .post("/api/artwork")
          .attach(
            "artworkMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/invalid_ratio_art.jpg`)
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
        expect(res.body.message).toEqual(errors.aspectRatioInvalid.message);
        expect(res.statusCode).toEqual(errors.aspectRatioInvalid.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkTitleRequired.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkAvailabilityRequired.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkAvailabilityInvalid.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkTypeRequired.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkTypeInvalid.status
        );
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
        expect(res.statusCode).toEqual(responses.artworkCreated.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkLicenseRequired.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkLicenseInvalid.status
        );
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
        expect(res.statusCode).toEqual(responses.artworkCreated.status);
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
        expect(res.statusCode).toEqual(validationErrors.invalidNumber.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkPersonalMin.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkPersonalMax.status
        );
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
        expect(res.statusCode).toEqual(responses.artworkCreated.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkUseRequired.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkUseInvalid.status
        );
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
        expect(res.statusCode).toEqual(responses.artworkCreated.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMin.status
        );
      });

      it("should throw an error if commercial artwork is valid but user hasn't completed the onboarding process", async () => {
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
          .field("artworkCommercial", 30)
          .field("artworkVisibility", "visible")
          .field("artworkDescription", "");

        expect(res.body.message).toEqual(
          errors[
            featureFlags.stripe
              ? "stripeOnboardingIncomplete"
              : "commercialArtworkUnavailable"
          ].message
        );
        expect(res.statusCode).toEqual(
          errors[
            featureFlags.stripe
              ? "stripeOnboardingIncomplete"
              : "commercialArtworkUnavailable"
          ].status
        );
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
        expect(res.statusCode).toEqual(validationErrors.invalidNumber.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMin.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMax.status
        );
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMin.status
        );
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
        expect(res.statusCode).toEqual(responses.artworkCreated.status);
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
        expect(res.statusCode).toEqual(
          validationErrors.artworkVisibilityRequired.status
        );
      });
    });
  });

  describe("/api/artwork/:artworkId", () => {
    describe("getArtworkDetails", () => {
      it("should fetch a visible and active artwork", async () => {
        const res = await request(app).get(
          `/api/artwork/${visibleAndActiveArtwork[0].id}`
        );
        expect(res.body.artwork).toBeTruthy();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if artwork id is invalid", async () => {
        const res = await request(app).get("/api/artwork/invalidId");
        expect(res.body.message).toEqual(errors.routeParameterInvalid.message);
        expect(res.statusCode).toEqual(errors.routeParameterInvalid.status);
      });

      it("should throw a 404 error if artwork is not visible", async () => {
        const res = await request(app).get(
          `/api/artwork/${invisibleArtwork[0].id}`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw a 404 error if artwork is not active", async () => {
        const res = await request(app).get(
          `/api/artwork/${inactiveArtwork[0].id}`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });
    });
  });

  describe("/api/users/:userId/artwork/:artworkId", () => {
    describe("getArtworkEdit", () => {
      it("should fetch an active artwork if user is owner", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
        );

        expect(res.body.artwork).toBeTruthy();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if artwork id is invalid", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/artwork/invalidId`
        );

        expect(res.body.message).toEqual(errors.routeParameterInvalid.message);
        expect(res.statusCode).toEqual(errors.routeParameterInvalid.status);
      });

      it("should throw a 404 error if artwork is not found", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/artwork/${unusedUuid}`
        );

        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw a 404 error if user is not owner", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/artwork/${activeArtworkByBuyer[0].id}`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should fetch an active artwork even if it is invisible", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/artwork/${activeAndInvisibleArtworkBySeller[0].id}`
        );

        expect(res.body.artwork).toBeTruthy();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a 404 error if artwork is not active", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/artwork/${inactiveArtworkBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw a 403 error if artwork is fetched by non owner", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${buyer.id}/artwork/${activeArtworkBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).get(
          `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });

    describe("updateArtwork", () => {
      it("should update existing artwork that was never ordered", async () => {
        const res = await request(app, sellerToken)
          .patch(`/api/users/${seller.id}/artwork/${unorderedArtwork[0].id}`)
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });
        expect(removeVersionMock).toHaveBeenCalledTimes(1);
        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should update existing artwork that was ordered once previously and has new unordered version", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${onceOrderedArtworkWithNewVersion[0].artworkId}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });
        expect(removeVersionMock).toHaveBeenCalledTimes(1);
        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should update existing artwork that was ordered once previously and has new ordered version", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${multiOrderedArtworkWithNoNewVersions[0].artworkId}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });
        expect(removeVersionMock).toHaveBeenCalledTimes(0);
        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should throw a 404 error if user is not owner", async () => {
        const res = await request(app, buyerToken)
          .patch(
            `/api/users/${buyer.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "test",
          });
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw a 403 error if artwork is fetched by non owner", async () => {
        const res = await request(app, buyerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
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
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw a 403 error if user is not authenticated", async () => {
        const res = await request(app)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
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
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if artwork is identical to the previous version", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: activeArtworkBySeller[0].current.title,
            artworkAvailability: activeArtworkBySeller[0].current.availability,
            artworkType: activeArtworkBySeller[0].current.type,
            artworkLicense: activeArtworkBySeller[0].current.license,
            artworkPersonal: activeArtworkBySeller[0].current.personal,
            artworkUse: activeArtworkBySeller[0].current.use,
            artworkCommercial: activeArtworkBySeller[0].current.commercial,
            artworkDescription: activeArtworkBySeller[0].current.description,
            artworkVisibility: activeArtworkBySeller[0].visibility,
          });
        expect(res.body.message).toEqual(
          errors.artworkDetailsIdentical.message
        );
        expect(res.statusCode).toEqual(errors.artworkDetailsIdentical.status);
      });

      it("should throw a validation error if title is missing", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkTitleRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkTitleRequired.status
        );
      });

      it("should throw a validation error if availability is missing", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkAvailabilityRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkAvailabilityRequired.status
        );
      });

      it("should throw a validation error if availability is invalid", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "invalid",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkAvailabilityInvalid.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkAvailabilityInvalid.status
        );
      });

      it("should throw a validation error if type is missing", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkTypeRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkTypeRequired.status
        );
      });

      it("should throw a validation error if type is invalid", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "invalid",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkTypeInvalid.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkTypeInvalid.status
        );
      });

      it("should pass if type is invalid but artwork is 'preview only'", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "unavailable",
            artworkType: "invalid",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should throw a validation error if license is missing", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkLicenseRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkLicenseRequired.status
        );
      });

      it("should throw a validation error if license is invalid", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "invalid",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkLicenseInvalid.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkLicenseInvalid.status
        );
      });

      it("should pass if license is invalid but artwork is 'preview only'", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "unavailable",
            artworkType: "free",
            artworkLicense: "invalid",
            artworkPersonal: 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should throw a validation error if personal is not an integer", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "personal",
            artworkPersonal: "invalid",
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.invalidNumber.message
        );
        expect(res.statusCode).toEqual(validationErrors.invalidNumber.status);
      });

      it("should throw a validation error if personal is below the minimum price", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice - 1,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkPersonalMin.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkPersonalMin.status
        );
      });

      it("should throw a validation error if personal is above the maximum price", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "personal",
            artworkPersonal: pricing.maximumPrice + 1,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkPersonalMax.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkPersonalMax.status
        );
      });

      it("should pass if personal is zero and artwork is not available/commercial/separate/personal", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: 0,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should throw a validation error if use is missing", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "commercial",
            artworkPersonal: 0,
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkUseRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkUseRequired.status
        );
      });

      it("should throw a validation error if use is invalid", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "commercial",
            artworkPersonal: 0,
            artworkUse: "invalid",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkUseInvalid.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkUseInvalid.status
        );
      });

      it("should pass if use is invalid but artwork is available/personal", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: 0,
            artworkUse: "invalid",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should throw a validation error if commercial is invalid", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "commercial",
            artworkPersonal: 20,
            artworkUse: "separate",
            artworkCommercial: 20,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMin.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMin.status
        );
      });

      it("should throw an error if commercial artwork is valid but user hasn't completed the onboarding process", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "commercial",
            artworkPersonal: 20,
            artworkUse: "separate",
            artworkCommercial: 30,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          errors[
            featureFlags.stripe
              ? "stripeOnboardingIncomplete"
              : "commercialArtworkUnavailable"
          ].message
        );
        expect(res.statusCode).toEqual(
          errors[
            featureFlags.stripe
              ? "stripeOnboardingIncomplete"
              : "commercialArtworkUnavailable"
          ].status
        );
      });

      it("should throw a validation error if commercial is not an integer", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "commercial",
            artworkPersonal: 0,
            artworkUse: "separate",
            artworkCommercial: "invalid",
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.invalidNumber.message
        );
        expect(res.statusCode).toEqual(validationErrors.invalidNumber.status);
      });

      it("should throw a validation error if commercial is below the minimum price", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "commercial",
            artworkPersonal: pricing.minimumPrice,
            artworkUse: "separate",
            artworkCommercial: pricing.minimumPrice - 1,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMin.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMin.status
        );
      });

      it("should throw a validation error if commercial is above the maximum price", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "commercial",
            artworkPersonal: pricing.minimumPrice,
            artworkUse: "separate",
            artworkCommercial: pricing.maximumPrice + 1,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMax.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMax.status
        );
      });

      it("should throw a validation error if commercial is below the personal license price", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "commercial",
            artworkLicense: "commercial",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "separate",
            artworkCommercial: pricing.minimumPrice + 5,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkCommercialMin.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkCommercialMin.status
        );
      });

      it("should pass if commercial is zero and artwork is not available/commercial/separate/personal", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: 0,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(responses.artworkUpdated.message);
        expect(res.statusCode).toEqual(responses.artworkUpdated.status);
      });

      it("should throw a validation error if visibility is missing", async () => {
        const res = await request(app, sellerToken)
          .patch(
            `/api/users/${seller.id}/artwork/${activeArtworkBySeller[0].id}`
          )
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkDescription: "",
          });

        expect(res.body.message).toEqual(
          validationErrors.artworkVisibilityRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.artworkVisibilityRequired.status
        );
      });

      it("should throw a validation error if artwork id is invalid", async () => {
        const res = await request(app, sellerToken)
          .patch(`/api/users/${seller.id}/artwork/invalidId`)
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });
        expect(res.body.message).toEqual(errors.routeParameterInvalid.message);
        expect(res.statusCode).toEqual(errors.routeParameterInvalid.status);
      });

      it("should throw an error if artwork is not found", async () => {
        const res = await request(app, sellerToken)
          .patch(`/api/users/${seller.id}/artwork/${unusedUuid}`)
          .send({
            artworkTitle: "test",
            artworkAvailability: "available",
            artworkType: "free",
            artworkLicense: "personal",
            artworkPersonal: pricing.minimumPrice + 10,
            artworkUse: "included",
            artworkCommercial: 0,
            artworkVisibility: "visible",
            artworkDescription: "",
          });
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });
    });

    // $TODO Add delete method
    describe("deleteArtwork", () => {
      it("should delete unordered artwork", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/artwork/${unorderedArtwork[0].id}`
        );
        expect(deactivateVersionMock).toHaveBeenCalledTimes(1);
        expect(s3Mock).toHaveBeenCalledTimes(2);
        expect(removeVersionMock).toHaveBeenCalledTimes(1);
        expect(deactivateArtworkMock).toHaveBeenCalledTimes(0);
        expect(res.body.message).toEqual(responses.artworkDeleted.message);
        expect(res.statusCode).toEqual(responses.artworkDeleted.status);
      });

      it("should delete ordered artwork with new unordered version", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/artwork/${onceOrderedArtworkWithNewVersion[0].artworkId}`
        );
        expect(deactivateVersionMock).toHaveBeenCalledTimes(1);
        expect(s3Mock).toHaveBeenCalledTimes(0);
        expect(removeVersionMock).toHaveBeenCalledTimes(1);
        expect(deactivateArtworkMock).toHaveBeenCalledTimes(0);
        expect(res.body.message).toEqual(responses.artworkDeleted.message);
        expect(res.statusCode).toEqual(responses.artworkDeleted.status);
      });

      it("should delete ordered artwork with no new versions", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/artwork/${multiOrderedArtworkWithNoNewVersions[0].artworkId}`
        );
        expect(deactivateVersionMock).toHaveBeenCalledTimes(0);
        expect(s3Mock).toHaveBeenCalledTimes(0);
        expect(removeVersionMock).toHaveBeenCalledTimes(0);
        expect(deactivateArtworkMock).toHaveBeenCalledTimes(1);
        expect(res.body.message).toEqual(responses.artworkDeleted.message);
        expect(res.statusCode).toEqual(responses.artworkDeleted.status);
      });

      it("should throw a validation error if artwork id is invalid", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/artwork/invalidId`
        );
        expect(res.body.message).toEqual(errors.routeParameterInvalid.message);
        expect(res.statusCode).toEqual(errors.routeParameterInvalid.status);
      });

      it("should throw an error if artwork is not found", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}/artwork/${unusedUuid}`
        );
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
      });

      it("should throw a 404 error if user is not owner", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${buyer.id}/artwork/${multiOrderedArtworkWithNoNewVersions[0].artworkId}`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw a 403 error if artwork is deleted by non owner", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${seller.id}/artwork/${multiOrderedArtworkWithNoNewVersions[0].artworkId}`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(
          `/api/users/${seller.id}/artwork/${multiOrderedArtworkWithNoNewVersions[0].artworkId}`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });
  });

  describe("/api/artwork/:artworkId/comments", () => {
    describe("getArtworkComments", () => {
      // test cursor, limit, fetching comments on invisible artwork,
      // fetching comments on inactive artwork,
      // fetching comments on invalid artwork id
      it("should not fetch comments for inactive artwork", async () => {
        const res = await request(app).get(
          `/api/artwork/${inactiveArtwork[0].id}/comments`
        );
        expect(res.body.comments.length).toEqual(0);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should not fetch comments for invisible artwork", async () => {
        const res = await request(app).get(
          `/api/artwork/${invisibleArtworkWithComments[0].id}/comments`
        );
        expect(res.body.comments.length).toEqual(0);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should fetch artwork comments", async () => {
        const res = await request(app).get(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments`
        );
        expect(res.body.comments.length).toEqual(
          entities.Comment.filter(
            (comment) => comment.artworkId === visibleArtworkWithComments[0].id
          ).length
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit comments to 1", async () => {
        const limit = 1;
        const res = await request(app).get(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments?cursor=&limit=${limit}`
        );
        expect(res.body.comments[0].id).toEqual(
          filteredComments[filteredComments.length - 1].id
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit comments to 1 and skip the first one", async () => {
        const cursor = filteredComments[filteredComments.length - 1].id;
        const limit = 1;
        const res = await request(app).get(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.comments[0].id).toEqual(
          filteredComments[filteredComments.length - 2].id
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });
    });
    describe("postComment", () => {
      it("should post a new comment and not send notification if poster owns the artwork", async () => {
        const res = await request(app, sellerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "test" });
        expect(socketApiMock).not.toHaveBeenCalled();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should post a new comment and send notification", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "test" });
        expect(socketApiMock).toHaveBeenCalled();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if the comment content is empty", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "" });
        expect(res.body.message).toEqual(
          validationErrors.commentContentRequired.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.commentContentRequired.status
        );
      });

      it("should throw a validation error if the comment content is too large", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({
            commentContent: new Array(ranges.commentContent.max + 2).join("a"),
          });
        expect(res.body.message).toEqual(
          validationErrors.commentContentMax.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.commentContentMax.status
        );
      });

      it("should throw a 404 error if the artwork is not found", async () => {
        const res = await request(app, buyerToken)
          .post(`/api/artwork/${inactiveArtwork[0].id}/comments`)
          .send({
            commentContent: "test",
          });
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app)
          .post(`/api/artwork/${activeArtworkBySeller[0].id}/comments`)
          .send({ commentContent: "test" });
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });
  });

  describe("/api/artwork/:artworkId/comments/:commentId", () => {
    describe("getComment", () => {
      it("should fetch comment", async () => {
        const res = await request(app).get(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${filteredComments[0].id}`
        );
        expect(res.body.comment).toBeTruthy();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should return undefined if artwork does not exist", async () => {
        const res = await request(app).get(
          `/api/artwork/${unusedUuid}/comments/${filteredComments[0].id}`
        );
        expect(res.body.comment).toBe(undefined);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should return undefined if comment does not exist", async () => {
        const res = await request(app).get(
          `/api/artwork/${unusedUuid}/comments/${artworkWithComments[0].id}`
        );
        expect(res.body.comment).toBe(undefined);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });
    });
  });

  describe("/api/users/:userId/comments/:commentId", () => {
    describe("patchComment", () => {
      it("should patch comment", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}/comments/${buyerComments[0].id}`)
          .send({ commentContent: "test" });
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a validation error if the comment content is too large", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api//users/${buyer.id}/comments/${buyerComments[0].id}`)
          .send({
            commentContent: new Array(ranges.commentContent.max + 2).join("a"),
          });
        expect(res.body.message).toEqual(
          validationErrors.commentContentMax.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.commentContentMax.status
        );
      });

      it("should throw a 403 error if comment is patched by non owner", async () => {
        const res = await request(app, sellerToken)
          .patch(`/api/users/${buyer.id}/comments/${buyerComments[0].id}`)
          .send({ commentContent: "test" });
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw a 404 error if comment doesn't exist", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}/comments/${unusedUuid}`)
          .send({ commentContent: "test" });
        expect(res.body.message).toEqual(errors.commentNotFound.message);
        expect(res.statusCode).toEqual(errors.commentNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app)
          .patch(`/api/users/${buyer.id}/comments/${filteredComments[0].id}`)
          .send({ commentContent: "test" });
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });

    describe("deleteComment", () => {
      it("should delete comment", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${buyer.id}/comments/${buyerComments[0].id}`
        );
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw a 403 error if comment is deleted by non owner", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${buyer.id}/comments/${buyerComments[0].id}`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });

      it("should throw a 404 error if comment doesn't exist", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${buyer.id}/comments/${unusedUuid}`
        );
        expect(res.body.message).toEqual(errors.commentNotFound.message);
        expect(res.statusCode).toEqual(errors.commentNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(
          `/api/users/${buyer.id}/comments/${filteredComments[0].id}`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });
  });

  describe("/api/artwork/:artworkId/favorites", () => {
    describe("getArtworkFavorites", () => {
      it("should fetch artwork favorites", async () => {
        const res = await request(app, buyerToken).get(
          `/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`
        );
        expect(res.body.favorites).toEqual(filteredFavorites.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should return 0 if artwork does not exist", async () => {
        const res = await request(app, buyerToken).get(
          `/api/artwork/${unusedUuid}/favorites`
        );
        expect(res.body.favorites).toBe(0);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });
    });
    describe("favoriteArtwork", () => {
      it("should favorite artwork", async () => {
        const res = await request(app, impartialToken).post(
          `/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`
        );
        expect(res.body.message).toEqual(responses.artworkFavorited.message);
        expect(res.statusCode).toEqual(responses.artworkFavorited.status);
      });

      it("should throw a 400 error if artwork favorited by owner", async () => {
        const res = await request(app, sellerToken).post(
          `/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`
        );
        expect(res.body.message).toEqual(
          errors.artworkFavoritedByOwner.message
        );
        expect(res.statusCode).toEqual(errors.artworkFavoritedByOwner.status);
      });

      it("should throw a 400 error if already favorited artwork is favorited", async () => {
        const res = await request(app, sellerToken).post(
          `/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`
        );
        expect(res.body.message).toEqual(
          errors.artworkAlreadyFavorited.message
        );
        expect(res.statusCode).toEqual(errors.artworkAlreadyFavorited.status);
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken).post(
          `/api/artwork/${unusedUuid}/favorites`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).post(
          `/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });
    describe("unfavoriteArtwork", () => {
      it("should unfavorite artwork", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`
        );
        expect(res.body.message).toEqual(responses.artworkUnfavorited.message);
        expect(res.statusCode).toEqual(responses.artworkUnfavorited.status);
      });

      it("should throw a 400 error if artwork unfavorited by owner", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`
        );
        expect(res.body.message).toEqual(
          errors.artworkUnfavoritedByOwner.message
        );
        expect(res.statusCode).toEqual(errors.artworkFavoritedByOwner.status);
      });

      it("should throw a 400 error if unfavorited artwork is unfavorited", async () => {
        const res = await request(app, impartialToken).delete(
          `/api/artwork/${artworkFavoritedBySeller[0].id}/favorites`
        );
        expect(res.body.message).toEqual(
          errors.artworkAlreadyUnfavorited.message
        );
        expect(res.statusCode).toEqual(errors.artworkAlreadyUnfavorited.status);
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/artwork/${unusedUuid}/favorites`
        );
        expect(res.body.message).toEqual(errors.artworkNotFound.message);
        expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(
          `/api/artwork/${artworkFavoritedByBuyer[0].id}/favorites`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });

    describe("/api/users/:userUsername/artwork", () => {
      let userArtwork;
      beforeAll(() => {
        userArtwork = entities.Artwork.filter(
          (item) => item.ownerId === buyer.id
        );
      });
      it("should fetch user artwork", async () => {
        const res = await request(app).get(`/api/users/${buyer.name}/artwork`);
        expect(res.body.artwork).toHaveLength(userArtwork.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user artwork to 1", async () => {
        const limit = 1;
        const res = await request(app).get(
          `/api/users/${buyer.name}/artwork?cursor=&limit=${limit}`
        );
        expect(res.body.artwork).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user artwork to 1 and skip the first one", async () => {
        const cursor = userArtwork[0].id;
        const limit = 1;
        const res = await request(app).get(
          `/api/users/${buyer.name}/artwork?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.artwork[0].id).toEqual(userArtwork[1].id);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not found", async () => {
        const res = await request(app).get(
          `/api/users/nonExistentUser/artwork`
        );
        expect(res.body.message).toEqual(errors.userNotFound.message);
        expect(res.statusCode).toEqual(errors.userNotFound.status);
      });
    });

    describe("/api/users/:userUsername/favorites", () => {
      let sellerFavorites;
      let buyerFavorites;
      beforeAll(() => {
        sellerFavorites = entities.Favorite.filter(
          (item) => item.ownerId === seller.id
        );
        buyerFavorites = entities.Favorite.filter(
          (item) => item.ownerId === buyer.id
        );
      });
      it("should fetch user favorites", async () => {
        const res = await request(app).get(
          `/api/users/${seller.name}/favorites`
        );
        expect(res.body.favorites).toHaveLength(sellerFavorites.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should fetch user favorites if user not has disabled displaying favorites and visiting own profile", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${buyer.name}/favorites`
        );
        expect(res.body.favorites).toHaveLength(buyerFavorites.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user favorites to 1", async () => {
        const limit = 1;
        const res = await request(app).get(
          `/api/users/${seller.name}/favorites?cursor=&limit=${limit}`
        );
        expect(res.body.favorites).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user favorites to 1 and skip the first one", async () => {
        const cursor = sellerFavorites[0].id;
        const limit = 1;
        const res = await request(app).get(
          `/api/users/${seller.name}/favorites?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.favorites[0].id).toEqual(sellerFavorites[1].id);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not found", async () => {
        const res = await request(app).get(
          `/api/users/nonExistentUser/favorites`
        );
        expect(res.body.message).toEqual(errors.userNotFound.message);
        expect(res.statusCode).toEqual(errors.userNotFound.status);
      });

      it("should throw an error if user not has disabled displaying favorites and not visiting own profile", async () => {
        const res = await request(app).get(
          `/api/users/${buyer.name}/favorites`
        );
        expect(res.body.message).toEqual(
          errors.userFavoritesNotAllowed.message
        );
        expect(res.statusCode).toEqual(errors.userFavoritesNotAllowed.status);
      });
    });

    describe("/api/users/:userId/my_artwork", () => {
      it("should fetch user artwork", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/my_artwork`
        );
        expect(res.body.artwork).toHaveLength(activeArtworkBySeller.length);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user artwork to 1", async () => {
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/my_artwork?cursor=&limit=${limit}`
        );
        expect(res.body.artwork).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user artwork to 1 and skip the first one", async () => {
        // has to be reversed since it's coming from the endpoint that serves artwork in descending order
        const sellerArtwork = activeArtworkBySeller.reverse();
        const cursor = sellerArtwork[0].id;
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/my_artwork?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.artwork[0].id).toEqual(sellerArtwork[1].id);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).get(
          `/api/users/${seller.id}/my_artwork`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${seller.id}/my_artwork`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
    });

    describe("/api/users/:userId/uploads", () => {
      it("should fetch user uploads", async () => {
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/uploads`
        );
        expect(res.body.artwork).toHaveLength(activeArtworkBySeller.length);
        expect(res.body.artwork[0].current.media.source).toBeTruthy();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user uploads to 1", async () => {
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/uploads?cursor=&limit=${limit}`
        );
        expect(res.body.artwork).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user uploads to 1 and skip the first one", async () => {
        // has to be reversed since it's coming from the endpoint that serves artwork in descending order
        const sellerArtwork = visibleAndActiveArtworkBySeller.reverse();
        const cursor = sellerArtwork[0].id;
        const limit = 1;
        const res = await request(app, sellerToken).get(
          `/api/users/${seller.id}/uploads?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.artwork[0].id).toEqual(sellerArtwork[1].id);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).get(`/api/users/${seller.id}/uploads`);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${seller.id}/uploads`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
    });

    describe("/api/users/:userId/ownership", () => {
      it("should fetch user ownership", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${buyer.id}/ownership`
        );
        expect(res.body.purchases).toHaveLength(uniqueOrders.length);
        expect(res.body.purchases[0].version.media.source).toBeTruthy();
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should limit user ownership to 1", async () => {
        const limit = 1;
        const res = await request(app, buyerToken).get(
          `/api/users/${buyer.id}/ownership?cursor=&limit=${limit}`
        );
        expect(res.body.purchases).toHaveLength(limit);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });
      it("should limit user ownership to 1 and skip the first one", async () => {
        const cursor = uniqueOrders[0].id;
        const limit = 1;
        const res = await request(app, buyerToken).get(
          `/api/users/${buyer.id}/ownership?cursor=${cursor}&limit=${limit}`
        );
        expect(res.body.purchases[0].id).toEqual(uniqueOrders[1].id);
        expect(res.statusCode).toEqual(statusCodes.ok);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).get(`/api/users/${buyer.id}/ownership`);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).get(
          `/api/users/${seller.id}/ownership`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
    });
  });

  describe("/api/artwork/:artworkId/comments/:commentId/likes", () => {
    describe("likeComment", () => {
      it("should like comment", async () => {
        const res = await request(app, impartialToken).post(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${sellerComments[0].id}/likes`
        );
        expect(res.body.message).toEqual(responses.commentLiked.message);
        expect(res.statusCode).toEqual(responses.commentLiked.status);
      });

      it("should throw a 400 error if comment liked by owner", async () => {
        const res = await request(app, sellerToken).post(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${sellerComments[0].id}/likes`
        );
        expect(res.body.message).toEqual(errors.commentLikedByOwner.message);
        expect(res.statusCode).toEqual(errors.commentLikedByOwner.status);
      });

      it("should throw a 400 error if already liked comment is liked", async () => {
        const res = await request(app, sellerToken).post(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${commentsLikedBySeller[0].commentId}/likes`
        );
        expect(res.body.message).toEqual(errors.commentAlreadyLiked.message);
        expect(res.statusCode).toEqual(errors.commentAlreadyLiked.status);
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, buyerToken).post(
          `/api/artwork/${unusedUuid}/comments/${commentsLikedBySeller[0].commentId}/likes`
        );
        expect(res.body.message).toEqual(errors.commentNotFound.message);
        expect(res.statusCode).toEqual(errors.commentNotFound.status);
      });

      it("should throw a 404 error if comment doesn't exist", async () => {
        const res = await request(app, buyerToken).post(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${unusedUuid}/likes`
        );
        expect(res.body.message).toEqual(errors.commentNotFound.message);
        expect(res.statusCode).toEqual(errors.commentNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).post(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${commentsLikedBySeller[0].commentId}/likes`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });
    describe("dislikeComment", () => {
      it("should dislike comment", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${commentsLikedBySeller[0].commentId}/likes`
        );
        expect(res.body.message).toEqual(responses.commentDisliked.message);
        expect(res.statusCode).toEqual(responses.commentDisliked.status);
      });

      it("should throw a 400 error if comment disliked by owner", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${sellerComments[0].id}/likes`
        );
        expect(res.body.message).toEqual(errors.commentDislikedByOwner.message);
        expect(res.statusCode).toEqual(errors.commentDislikedByOwner.status);
      });

      it("should throw a 400 error if already disliked comment is disliked", async () => {
        const res = await request(app, impartialToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${sellerComments[0].id}/likes`
        );
        expect(res.body.message).toEqual(errors.commentAlreadyDisliked.message);
        expect(res.statusCode).toEqual(errors.commentAlreadyDisliked.status);
      });

      it("should throw a 404 error if artwork doesn't exist", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/artwork/${unusedUuid}/comments/${commentsLikedBySeller[0].commentId}/likes`
        );
        expect(res.body.message).toEqual(errors.commentNotFound.message);
        expect(res.statusCode).toEqual(errors.commentNotFound.status);
      });

      it("should throw a 404 error if comment doesn't exist", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${unusedUuid}/likes`
        );
        expect(res.body.message).toEqual(errors.commentNotFound.message);
        expect(res.statusCode).toEqual(errors.commentNotFound.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(
          `/api/artwork/${visibleArtworkWithComments[0].id}/comments/${commentsLikedBySeller[0].commentId}/likes`
        );
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });
    });
  });
});
