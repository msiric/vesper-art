import app from "../../app";
import { statusCodes } from "../../common/constants";
import { ArtworkVisibility } from "../../entities/Artwork";
import { LicenseType, LicenseUsage } from "../../entities/License";
import { fetchAllArtworks } from "../../services/postgres/artwork";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, responses } from "../../utils/statuses";
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
  validResetUser,
  validResetUserCookie,
  validResetUserToken,
  expiredResetUser,
  expiredResetUserCookie,
  expiredResetUserToken,
  validVerificationUser,
  validVerificationUserCookie,
  validVerificationUserToken,
  expiredVerificationUser,
  expiredVerificationUserCookie,
  expiredVerificationUserToken,
  artwork,
  artworkBySeller,
  artworkByBuyer,
  invisibleArtworkBySeller,
  inactiveArtworkBySeller,
  visibleArtworkBySeller,
  visibleArtworkByBuyer,
  activeArtworkBySeller,
  activeArtworkByBuyer,
  invisibleAndInactiveArtworkBySeller,
  visibleAndActiveArtworkBySeller,
  visibleAndActiveArtworkByBuyer;

describe.only("Checkout tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [
      buyer,
      seller,
      validResetUser,
      expiredResetUser,
      validVerificationUser,
      expiredVerificationUser,
      artwork,
    ] = await Promise.all([
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
        userUsername: "validResetToken",
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
        userUsername: "expiredResetToken",
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
        userUsername: "validVerificationToken",
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
        userUsername: "expiredVerificationToken",
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
    ({ cookie: validResetUserCookie, token: validResetUserToken } =
      logUserIn(validResetUser));
    ({ cookie: expiredResetUserCookie, token: expiredResetUserToken } =
      logUserIn(expiredResetUser));
    ({
      cookie: validVerificationUserCookie,
      token: validVerificationUserToken,
    } = logUserIn(validVerificationUser));
    ({
      cookie: expiredVerificationUserCookie,
      token: expiredVerificationUserToken,
    } = logUserIn(expiredVerificationUser));

    artworkBySeller = artwork.filter((item) => item.owner.id === seller.id);
    artworkByBuyer = artwork.filter((item) => item.owner.id === buyer.id);
    invisibleArtworkBySeller = artworkBySeller.filter(
      (item) => item.visibility === ArtworkVisibility.invisible
    );
    inactiveArtworkBySeller = artworkBySeller.filter(
      (item) => item.active === false
    );
    visibleArtworkBySeller = artworkBySeller.filter(
      (item) => item.visibility === ArtworkVisibility.visible
    );
    visibleArtworkByBuyer = artworkByBuyer.filter(
      (item) => item.visibility === ArtworkVisibility.visible
    );
    activeArtworkBySeller = artworkBySeller.filter(
      (item) => item.active === true
    );
    activeArtworkByBuyer = artworkByBuyer.filter(
      (item) => item.active === true
    );
    invisibleAndInactiveArtworkBySeller = artworkBySeller.filter(
      (item) =>
        item.visibility === ArtworkVisibility.invisible && item.active === false
    );
    visibleAndActiveArtworkBySeller = artworkBySeller.filter(
      (item) =>
        item.visibility === ArtworkVisibility.visible && item.active === true
    );
    visibleAndActiveArtworkByBuyer = artworkByBuyer.filter(
      (item) =>
        item.visibility === ArtworkVisibility.visible && item.active === true
    );
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/checkout/:versionId", () => {
    it("should fetch an artwork for checkout", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${visibleAndActiveArtworkBySeller[0].current.id}`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.version).toBeTruthy();
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/checkout/${visibleAndActiveArtworkBySeller[0].current.id}`
      );
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is purchasing own artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${visibleAndActiveArtworkByBuyer[0].current.id}`
      );
      expect(res.statusCode).toEqual(errors.artworkCheckoutByOwner.status);
      expect(res.body.message).toEqual(errors.artworkCheckoutByOwner.message);
    });

    it("should throw an error if user is purchasing invisible artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${invisibleArtworkBySeller[0].current.id}`
      );
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
    });

    it("should throw an error if user is purchasing inactive artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${inactiveArtworkBySeller[0].current.id}`
      );
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
    });
  });

  describe.only("/api/download/:versionId", () => {
    it("should create a new order for a free artwork with personal license", async () => {
      const freePersonalArtwork = visibleAndActiveArtworkBySeller.find(
        (item) => item.current.title === "Free but personal"
      );
      const res = await request(app, buyerToken)
        .post(`/api/download/${freePersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const freePersonalArtwork = visibleAndActiveArtworkBySeller.find(
        (item) => item.current.title === "Free but personal"
      );
      const res = await request(app)
        .post(`/api/download/${freePersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });
  });
});
