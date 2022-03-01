import app from "../../app";
import { statusCodes } from "../../common/constants";
import { licenseErrors } from "../../common/helpers";
import { errors as validationErrors, ranges } from "../../common/validation";
import { ArtworkVisibility } from "../../entities/Artwork";
import { LicenseType, LicenseUsage } from "../../entities/License";
import { fetchAllArtworks } from "../../services/artwork";
import { fetchUserByUsername, fetchUserPurchases } from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import { errors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn, unusedUuid } from "../utils/helpers";
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
  visibleAndActiveArtworkByBuyer,
  orders,
  ordersWithMultipleVersions;

describe("Checkout tests", () => {
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
      orders,
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
      fetchUserPurchases({ userId: validUsers.buyer.id, connection }),
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
    ordersWithMultipleVersions = orders.find((item) =>
      item.version.title.includes("V1")
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
      expect(res.body.version).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/checkout/${visibleAndActiveArtworkBySeller[0].current.id}`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is purchasing artwork with obsolete version", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${ordersWithMultipleVersions.version.id}`
      );
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
    });

    it("should throw an error if user is purchasing own artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${visibleAndActiveArtworkByBuyer[0].current.id}`
      );
      expect(res.body.message).toEqual(errors.artworkCheckoutByOwner.message);
      expect(res.statusCode).toEqual(errors.artworkCheckoutByOwner.status);
    });

    it("should throw an error if user is purchasing invisible artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${invisibleArtworkBySeller[0].current.id}`
      );
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
    });

    it("should throw an error if user is purchasing inactive artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/checkout/${inactiveArtworkBySeller[0].current.id}`
      );
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
    });
  });

  describe("/api/download/:versionId", () => {
    let freeUnorderedPersonalArtwork,
      freeUnorderedCommercialArtwork,
      freeOrderedPersonalArtwork,
      freeOrderedCommercialArtwork;
    beforeAll(() => {
      freeUnorderedPersonalArtwork = visibleAndActiveArtworkBySeller.find(
        (item) => item.current.title === "Free but personal"
      );
      freeUnorderedCommercialArtwork = visibleAndActiveArtworkBySeller.find(
        (item) => item.current.title === "Free but commercial (included)"
      );
      freeOrderedPersonalArtwork = visibleAndActiveArtworkBySeller.find(
        (item) => item.current.title === "Free but personal (ordered)"
      );
      freeOrderedCommercialArtwork = visibleAndActiveArtworkBySeller.find(
        (item) =>
          item.current.title === "Free but commercial (included) (ordered)"
      );
    });
    it("should create a new order for a free artwork with individual personal license", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should throw an error if a free (non-commercial) artwork with individual commercial license is ordered", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.commercial,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(errors.artworkLicenseInvalid.message);
      expect(res.statusCode).toEqual(errors.artworkLicenseInvalid.status);
    });

    it("should throw an error if a free (commercial) artwork with individual personal license is ordered", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedCommercialArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(errors.artworkLicenseInvalid.message);
      expect(res.statusCode).toEqual(errors.artworkLicenseInvalid.status);
    });

    it("should create a new order for a free (commercial) artwork with individual commercial license", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedCommercialArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.commercial,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should create a new order for a free (non-commercial) artwork with business personal license", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.personal,
          licenseCompany: "Test",
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should throw an error if a free (non-commercial) artwork with business commercial license is ordered", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.commercial,
          licenseCompany: "Test",
        });
      expect(res.body.message).toEqual(errors.artworkLicenseInvalid.message);
      expect(res.statusCode).toEqual(errors.artworkLicenseInvalid.status);
    });

    it("should throw an error if free (commercial) artwork with business personal license is ordered", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedCommercialArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.personal,
          licenseCompany: "Test",
        });
      expect(res.body.message).toEqual(errors.artworkLicenseInvalid.message);
      expect(res.statusCode).toEqual(errors.artworkLicenseInvalid.status);
    });

    it("should create a new order for a free (commercial) artwork with business commercial license", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedCommercialArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.commercial,
          licenseCompany: "Test",
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should throw an error if a free artwork with individual personal license already exists", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeOrderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(
        errors[licenseErrors.identicalError.identifier].message
      );
      expect(res.statusCode).toEqual(
        errors[licenseErrors.identicalError.identifier].status
      );
    });

    it("should create a new order for a free (commercial) artwork with business commercial license with different company name", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeOrderedCommercialArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.commercial,
          licenseCompany: "Test 2",
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should throw an error if a free (commercial) artwork with business commercial license with same company name is ordered", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeOrderedCommercialArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.commercial,
          licenseCompany: "Test",
        });
      expect(res.body.message).toEqual(
        errors[licenseErrors.companyError.identifier].message
      );
      expect(res.statusCode).toEqual(
        errors[licenseErrors.companyError.identifier].status
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is the owner", async () => {
      const res = await request(app, sellerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(errors.artworkDownloadedByOwner.message);
      expect(res.statusCode).toEqual(errors.artworkDownloadedByOwner.status);
    });

    it("should throw an error if user is purchasing artwork with obsolete version", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${ordersWithMultipleVersions.version.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
    });

    it("should throw a validation error if usage is missing", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseType: LicenseType.personal,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseUsageRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseUsageRequired.status
      );
    });

    it("should throw a validation error if type is missing", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseCompany: "",
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseTypeRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseTypeRequired.status
      );
    });

    it("should throw a validation error if company is missing when usage is 'business'", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.personal,
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseCompanyRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseCompanyRequired.status
      );
    });

    it("should not throw a validation error if company is missing when usage is 'personal'", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
        });
      expect(res.body.message).toEqual(responses.orderCreated.message);
      expect(res.statusCode).toEqual(responses.orderCreated.status);
    });

    it("should throw a validation error if usage is invalid", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: "invalid",
          licenseType: LicenseType.personal,
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseUsageInvalid.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseUsageInvalid.status
      );
    });

    it("should throw a validation error if type is invalid", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: "invalid",
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseTypeInvalid.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseTypeInvalid.status
      );
    });

    it("should throw a validation error if company is too long", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.business,
          licenseType: LicenseType.personal,
          licenseCompany: new Array(ranges.company.max + 2).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseCompanyMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.licenseCompanyMax.status);
    });

    it("should throw an error if version doesn't exist", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${unusedUuid}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.personal,
        });
      expect(res.body.message).toEqual(errors.artworkNotFound.message);
      expect(res.statusCode).toEqual(errors.artworkNotFound.status);
    });

    it("should throw an error if license type is not supported", async () => {
      const res = await request(app, buyerToken)
        .post(`/api/download/${freeUnorderedPersonalArtwork.current.id}`)
        .send({
          licenseUsage: LicenseUsage.individual,
          licenseType: LicenseType.commercial,
        });
      expect(res.body.message).toEqual(errors.artworkLicenseInvalid.message);
      expect(res.statusCode).toEqual(errors.artworkLicenseInvalid.status);
    });
  });
});
