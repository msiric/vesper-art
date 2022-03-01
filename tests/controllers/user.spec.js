import { addDays, format, isAfter, isBefore, isEqual } from "date-fns";
import path from "path";
import app from "../../app";
import { countries, statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { ArtworkVisibility } from "../../entities/Artwork";
import * as s3Utils from "../../lib/s3";
import * as artworkServices from "../../services/artwork";
import { fetchAllArtworks } from "../../services/artwork";
import * as authServices from "../../services/auth";
import * as userServices from "../../services/user";
import {
  fetchUserByUsername,
  fetchUserPurchases,
  fetchUserSales
} from "../../services/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import * as emailUtils from "../../utils/email";
import { resolveDateRange } from "../../utils/helpers";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, responses } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import {
  fileTooLargeError,
  findMultiOrderedArtwork,
  findSingleOrderedArtwork,
  findUniqueOrders,
  findUnorderedArtwork,
  logUserIn
} from "../utils/helpers";
import { request } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../tests/media");
const DATE_FORMAT = "MM/dd/yyyy";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

const sendEmailMock = jest.spyOn(emailUtils, "sendEmail").mockImplementation();

const s3Mock = jest.spyOn(s3Utils, "deleteS3Object");

const logUserOutMock = jest.spyOn(authServices, "logUserOut");
const addAvatarMock = jest.spyOn(userServices, "addUserAvatar");
const editAvatarMock = jest.spyOn(userServices, "editUserAvatar");
const removeAvatarMock = jest.spyOn(userServices, "removeUserAvatar");

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
  buyer,
  buyerCookie,
  buyerToken,
  seller,
  sellerCookie,
  sellerToken,
  impartial,
  impartialCookie,
  impartialToken,
  avatar,
  avatarCookie,
  avatarToken,
  artwork,
  artworkBySeller,
  invisibleArtworkBySeller,
  inactiveArtworkBySeller,
  visibleArtworkBySeller,
  activeArtworkBySeller,
  invisibleAndInactiveArtworkBySeller,
  visibleAndActiveArtworkBySeller,
  buyerPurchases,
  sellerSales,
  unorderedArtwork,
  onceOrderedArtworkWithNewVersion,
  multiOrderedArtworkWithNoNewVersions,
  uniqueOrders,
  firstOrderDate,
  lastOrderDate,
  startDate,
  endDate;

describe("User tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, impartial, avatar, artwork, buyerPurchases, sellerSales] =
      await Promise.all([
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
        fetchUserByUsername({
          userUsername: validUsers.avatar.username,
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
        fetchUserSales({ userId: validUsers.seller.id, connection }),
      ]);
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    ({ cookie: impartialCookie, token: impartialToken } = logUserIn(impartial));
    ({ cookie: avatarCookie, token: avatarToken } = logUserIn(avatar));

    artworkBySeller = artwork.filter((item) => item.owner.id === seller.id);
    invisibleArtworkBySeller = artworkBySeller.filter(
      (item) => item.visibility === ArtworkVisibility.invisible
    );
    inactiveArtworkBySeller = artworkBySeller.filter(
      (item) => item.active === false
    );
    visibleArtworkBySeller = artworkBySeller.filter(
      (item) => item.visibility === ArtworkVisibility.visible
    );
    activeArtworkBySeller = artworkBySeller.filter(
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
    unorderedArtwork = findUnorderedArtwork(
      activeArtworkBySeller,
      entities.Order
    );
    onceOrderedArtworkWithNewVersion = findSingleOrderedArtwork(entities.Order);
    multiOrderedArtworkWithNoNewVersions = findUniqueOrders(
      findMultiOrderedArtwork(entities.Order)
    );
    uniqueOrders = findUniqueOrders(entities.Order);
    firstOrderDate = format(new Date(sellerSales[0].created), DATE_FORMAT);
    lastOrderDate = format(
      new Date(sellerSales[sellerSales.length - 1].created),
      DATE_FORMAT
    );
    ({ startDate, endDate } = resolveDateRange({
      start: sellerSales[0].created,
      end: sellerSales[sellerSales.length - 1].created,
    }));
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/users/:userUsername", () => {
    it("should find user with provided username", async () => {
      const res = await request(app).get(`/api/users/${buyer.name}`);
      expect(res.body.user).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user doesn't exist", async () => {
      const res = await request(app).get(`/api/users/unknownUser`);
      expect(res.body.message).toEqual(errors.userNotFound.message);
      expect(res.statusCode).toEqual(errors.userNotFound.status);
    });
  });

  describe("/api/users/:userId", () => {
    describe("updateUserProfile", () => {
      it("should update user with new avatar, description and country", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          )
          .field("userDescription", "test")
          .field("userCountry", countries[0].value);
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with new avatar and description", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          )
          .field("userDescription", "test");
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with new avatar and country", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          )
          .field("userCountry", countries[0].value);
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with new description and country", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({ userDescription: "test", userCountry: countries[0].value });
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with new avatar and delete the old one", async () => {
        const res = await request(app, avatarToken)
          .patch(`/api/users/${avatar.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          );
        expect(s3Mock).toHaveBeenCalled();
        expect(addAvatarMock).not.toHaveBeenCalled();
        expect(editAvatarMock).toHaveBeenCalled();
        expect(removeAvatarMock).not.toHaveBeenCalled();
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with new avatar and not delete the old one", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          );
        expect(s3Mock).not.toHaveBeenCalled();
        expect(addAvatarMock).toHaveBeenCalled();
        expect(editAvatarMock).not.toHaveBeenCalled();
        expect(removeAvatarMock).not.toHaveBeenCalled();
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with no avatar and delete the old one", async () => {
        const res = await request(app, avatarToken).patch(
          `/api/users/${avatar.id}`
        );
        expect(s3Mock).toHaveBeenCalled();
        expect(addAvatarMock).not.toHaveBeenCalled();
        expect(editAvatarMock).not.toHaveBeenCalled();
        expect(removeAvatarMock).toHaveBeenCalled();
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should update user with no avatar and not delete the old one", async () => {
        const res = await request(app, buyerToken).patch(
          `/api/users/${buyer.id}`
        );
        expect(s3Mock).not.toHaveBeenCalled();
        expect(addAvatarMock).not.toHaveBeenCalled();
        expect(editAvatarMock).not.toHaveBeenCalled();
        expect(removeAvatarMock).not.toHaveBeenCalled();
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
      });

      it("should throw an error if avatar has invalid dimensions", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(
              __dirname,
              `${MEDIA_LOCATION}/invalid_dimensions_avatar.jpg`
            )
          )
          .field("userDescription", "test")
          .field("userCountry", countries[0].value);
        expect(res.body.message).toEqual(errors.fileDimensionsInvalid.message);
        expect(res.statusCode).toEqual(errors.fileDimensionsInvalid.status);
      });

      it("should throw an error if avatar has an invalid extension", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/invalid_extension.txt`)
          )
          .field("userDescription", "test")
          .field("userCountry", countries[0].value);
        expect(res.body.message).toEqual(
          validationErrors.userMediaType.message
        );
        expect(res.statusCode).toEqual(validationErrors.userMediaType.status);
      });

      it("should throw an error if avatar has an invalid ratio", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(
              __dirname,
              `${MEDIA_LOCATION}/invalid_ratio_avatar.png`
            )
          )
          .field("userDescription", "test")
          .field("userCountry", countries[0].value);
        expect(res.body.message).toEqual(errors.aspectRatioInvalid.message);
        expect(res.statusCode).toEqual(errors.aspectRatioInvalid.status);
      });

      it("should throw an error if avatar has an invalid size", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/invalid_size_avatar.jpg`)
          )
          .field("userDescription", "test")
          .field("userCountry", countries[0].value);
        expect(res.body.message).toEqual(fileTooLargeError);
        expect(res.statusCode).toEqual(statusCodes.badRequest);
      });

      it("should throw a validation error if description is too long", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({
            userDescription: new Array(ranges.profileDescription.max + 2).join(
              "a"
            ),
          });
        expect(res.body.message).toEqual(
          validationErrors.userDescriptionMax.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.userDescriptionMax.status
        );
      });

      it("should throw a validation error if country is too long", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({
            userCountry: "invalidCountry",
          });
        expect(res.body.message).toEqual(
          validationErrors.userCountryMax.message
        );
        expect(res.statusCode).toEqual(validationErrors.userCountryMax.status);
      });

      it("should throw a validation error if country is invalid", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({
            userCountry: "ZZ",
          });
        expect(res.body.message).toEqual(
          validationErrors.invalidUserCountry.message
        );
        expect(res.statusCode).toEqual(
          validationErrors.invalidUserCountry.status
        );
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app)
          .patch(`/api/users/${buyer.id}`)
          .send({ userDescription: "test" });
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${seller.id}`)
          .send({ userDescription: "test" });
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
    });

    // $TODO add - should have been called
    describe("deactivateUser", () => {
      it("should deactivate buyer", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${buyer.id}`
        );
        expect(res.body.message).toEqual(responses.userDeactivated.message);
        expect(res.statusCode).toEqual(responses.userDeactivated.status);
      });

      it("should deactivate seller", async () => {
        const res = await request(app, sellerToken).delete(
          `/api/users/${seller.id}`
        );
        expect(deactivateVersionMock).toHaveBeenCalledTimes(
          unorderedArtwork.length + onceOrderedArtworkWithNewVersion.length
        );
        expect(s3Mock).toHaveBeenCalledTimes(unorderedArtwork.length * 2);
        expect(deactivateArtworkMock).toHaveBeenCalledTimes(
          multiOrderedArtworkWithNoNewVersions.length
        );
        expect(removeVersionMock).toHaveBeenCalledTimes(
          unorderedArtwork.length + onceOrderedArtworkWithNewVersion.length
        );
        expect(res.body.message).toEqual(responses.userDeactivated.message);
        expect(res.statusCode).toEqual(responses.userDeactivated.status);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(`/api/users/${buyer.id}`);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${seller.id}`
        );
        expect(res.body.message).toEqual(errors.notAuthorized.message);
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
      });
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
      const res = await request(app).get(`/api/users/nonExistentUser/artwork`);
      expect(res.body.message).toEqual(errors.userNotFound.message);
      expect(res.statusCode).toEqual(errors.userNotFound.status);
    });
  });

  describe("/api/users/:userUsername/favorites", () => {
    let userFavorites;
    beforeAll(() => {
      userFavorites = entities.Favorite.filter(
        (item) => item.ownerId === seller.id
      );
    });
    it("should fetch user favorites", async () => {
      const res = await request(app).get(`/api/users/${seller.name}/favorites`);
      expect(res.body.favorites).toHaveLength(userFavorites.length);
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
      const cursor = userFavorites[0].id;
      const limit = 1;
      const res = await request(app).get(
        `/api/users/${seller.name}/favorites?cursor=${cursor}&limit=${limit}`
      );
      expect(res.body.favorites[0].id).toEqual(userFavorites[1].id);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not found", async () => {
      const res = await request(app).get(
        `/api/users/nonExistentUser/favorites`
      );
      expect(res.body.message).toEqual(errors.userNotFound.message);
      expect(res.statusCode).toEqual(errors.userNotFound.status);
    });

    it("should throw an error if user has disabled displaying favorites", async () => {
      const res = await request(app).get(`/api/users/${buyer.name}/favorites`);
      expect(res.body.message).toEqual(errors.userFavoritesNotAllowed.message);
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
      const res = await request(app).get(`/api/users/${seller.id}/my_artwork`);
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
      expect(res.body.artwork).toHaveLength(
        visibleAndActiveArtworkBySeller.length
      );
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

  describe("/api/users/:userId/statistics/sales", () => {
    it("should fetch user selling statistics", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.body.sales).toHaveLength(
        entities.Order.filter((item) => item.sellerId === seller.id).length
      );
      expect(res.body.reviews).toHaveLength(
        entities.Review.filter((item) => item.revieweeId === seller.id).length
      );
      expect(res.body.amount).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/statistics/purchases", () => {
    it("should fetch user buying statistics", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.body.purchases).toHaveLength(
        entities.Order.filter((item) => item.buyerId === buyer.id).length
      );
      expect(res.body.favorites).toHaveLength(
        entities.Favorite.filter((item) => item.ownerId === buyer.id).length
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/purchases", () => {
    it("should fetch buyer purchases for set dates", async () => {
      const start = firstOrderDate;
      const end = lastOrderDate;
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.statistics).toHaveLength(
        buyerPurchases.filter(
          (item) =>
            (isEqual(new Date(item.created), startDate) ||
              isAfter(new Date(item.created), startDate)) &&
            (isBefore(new Date(item.created), endDate) ||
              isEqual(new Date(item.created), endDate))
        ).length
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if dates are not set", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is invalid", async () => {
      const start = "invalid";
      const end = lastOrderDate;
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is invalid", async () => {
      const start = firstOrderDate;
      const end = "invalid";
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is in the future", async () => {
      const start = format(addDays(new Date(), 1), DATE_FORMAT);
      const end = lastOrderDate;
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is in the future", async () => {
      const start = firstOrderDate;
      const end = format(addDays(new Date(), 1), DATE_FORMAT);
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/purchases?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/purchases`);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/purchases`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/sales", () => {
    it("should fetch seller sales for set dates", async () => {
      const start = firstOrderDate;
      const end = lastOrderDate;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.statistics).toHaveLength(
        sellerSales.filter(
          (item) =>
            (isEqual(new Date(item.created), startDate) ||
              isAfter(new Date(item.created), startDate)) &&
            (isBefore(new Date(item.created), endDate) ||
              isEqual(new Date(item.created), endDate))
        ).length
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if dates are not set", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is invalid", async () => {
      const start = "invalid";
      const end = lastOrderDate;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is invalid", async () => {
      const start = firstOrderDate;
      const end = "invalid";
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if start param is in the future", async () => {
      const start = format(addDays(new Date(), 1), DATE_FORMAT);
      const end = lastOrderDate;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if end param is in the future", async () => {
      const start = firstOrderDate;
      const end = format(addDays(new Date(), 1), DATE_FORMAT);
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/sales?start=${start}&end=${end}`
      );
      expect(res.body.message).toEqual(errors.routeQueryInvalid.message);
      expect(res.statusCode).toEqual(errors.routeQueryInvalid.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/sales`);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/sales`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/settings", () => {
    it("should fetch buyer settings", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/settings`
      );
      expect(res.body.user).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/settings`);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/settings`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/notifications/previous", () => {
    let userNotifications;
    beforeAll(() => {
      userNotifications = entities.Notification.filter(
        (item) => item.receiverId === seller.id
      );
    });
    it("should fetch previous seller notifications", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications/previous`
      );
      expect(res.body.notifications).toHaveLength(userNotifications.length);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should limit user notifications to 1", async () => {
      const limit = 1;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications/previous?cursor=&limit=${limit}`
      );
      expect(res.body.notifications).toHaveLength(limit);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should limit user notifications to 1 and skip the first one", async () => {
      const cursor = userNotifications[userNotifications.length - 1].id;
      const limit = 1;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications/previous?cursor=${cursor}&limit=${limit}`
      );
      expect(res.body.notifications[0].id).toEqual(
        userNotifications[userNotifications.length - 2].id
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/notifications/previous`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/notifications/previous`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/notifications/latest", () => {
    let userNotifications;
    beforeAll(() => {
      userNotifications = entities.Notification.filter(
        (item) => item.receiverId === seller.id
      );
    });
    it("should fetch latest seller notifications", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications/latest`
      );
      expect(res.body.notifications).toHaveLength(userNotifications.length);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should limit user notifications to 1", async () => {
      const limit = 1;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications/latest?cursor=&limit=${limit}`
      );
      expect(res.body.notifications).toHaveLength(limit);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should limit user notifications to 1 and skip the first one", async () => {
      const cursor = userNotifications[0].id;
      const limit = 1;
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/notifications/latest?cursor=${cursor}&limit=${limit}`
      );
      expect(res.body.notifications[0].id).toEqual(
        userNotifications[userNotifications.length - 1].id
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/notifications/latest`
      );
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/notifications/latest`
      );
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/origin", () => {
    it("should patch user origin", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: countries.find((item) => item.supported).value,
        });
      expect(res.body.message).toEqual(
        responses.businessAddressUpdated.message
      );
      expect(res.statusCode).toEqual(responses.businessAddressUpdated.status);
    });

    it("should throw a validation error if business address is missing", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({});
      expect(res.body.message).toEqual(
        validationErrors.originCountryRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.originCountryRequired.status
      );
    });

    it("should throw a validation error if business address is too long", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: "invalidCountry",
        });
      expect(res.body.message).toEqual(
        validationErrors.originCountryMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.originCountryMax.status);
    });

    it("should throw a validation error if business address is invalid", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: "ZZ",
        });
      expect(res.body.message).toEqual(
        validationErrors.invalidStripeCountry.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.invalidStripeCountry.status
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: countries.find((item) => item.supported).value,
        });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: countries.find((item) => item.supported).value,
        });
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/preferences", () => {
    it("should patch user preferences (enable favorites)", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: true,
        });
      expect(res.body.message).toEqual(responses.preferencesUpdated.message);
      expect(res.statusCode).toEqual(responses.preferencesUpdated.status);
    });

    it("should patch user preferences (disable favorites)", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: false,
        });
      expect(res.body.message).toEqual(responses.preferencesUpdated.message);
      expect(res.statusCode).toEqual(responses.preferencesUpdated.status);
    });

    it("should throw a validation error if user favorites is missing", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({});
      expect(res.body.message).toEqual(
        validationErrors.favoritesPreferenceRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.favoritesPreferenceRequired.status
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: true,
        });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: true,
        });
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/password", () => {
    it("should patch user password", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(responses.passwordUpdated.message);
      expect(res.statusCode).toEqual(responses.passwordUpdated.status);
    });

    it("should throw an error if password is incorrect", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: "incorrectPassword",
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(errors.currentPasswordIncorrect.message);
      expect(res.statusCode).toEqual(errors.currentPasswordIncorrect.status);
    });

    it("should throw an error if password is identical to the old one", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: validUsers.buyer.password,
          userConfirm: validUsers.buyer.password,
        });
      expect(res.body.message).toEqual(errors.newPasswordIdentical.message);
      expect(res.statusCode).toEqual(errors.newPasswordIdentical.status);
    });

    it("should throw a validation error if passwords don't match", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: "User1Password",
          userConfirm: "User2Password",
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMismatch.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.userPasswordMismatch.status
      );
    });

    it("should throw a validation error if password is too short", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: new Array(ranges.password.min).join("a"),
          userConfirm: new Array(ranges.password.min).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMin.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMin.status);
    });

    it("should throw a validation error if password is too long", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: new Array(ranges.password.max + 2).join("a"),
          userConfirm: new Array(ranges.password.max + 2).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMax.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken)
        .patch(`/api/users/${buyer.id}/password`)
        .send({
          userCurrent: validUsers.buyer.password,
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });

  describe("/api/users/:userId/email", () => {
    it("should patch user email", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/email`)
        .send({
          userEmail: "test@test.com",
        });
      expect(sendEmailMock).toHaveBeenCalled();
      expect(logUserOutMock).toHaveBeenCalled();
      expect(res.body.message).toEqual(responses.emailAddressUpdated.message);
      expect(res.statusCode).toEqual(responses.emailAddressUpdated.status);
    });

    it("should throw an error if email is taken", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/email`)
        .send({
          userEmail: validUsers.seller.email,
        });
      expect(sendEmailMock).not.toHaveBeenCalled();
      expect(logUserOutMock).not.toHaveBeenCalled();
      expect(res.body.message).toEqual(errors.emailAlreadyExists.message);
      expect(res.statusCode).toEqual(errors.emailAlreadyExists.status);
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/email`)
        .send({
          userEmail: "invalidEmail",
        });
      expect(res.body.message).toEqual(
        validationErrors.userEmailInvalid.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailInvalid.status);
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/email`)
        .send({});
      expect(res.body.message).toEqual(
        validationErrors.userEmailRequired.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailRequired.status);
    });

    it("should throw a validation error if email is too long", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/email`)
        .send({
          userEmail: `${new Array(ranges.email.max).join("a")}@test.com`,
        });
      expect(res.body.message).toEqual(validationErrors.userEmailMax.message);
      expect(res.statusCode).toEqual(validationErrors.userEmailMax.status);
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .patch(`/api/users/${buyer.id}/email`)
        .send({
          userEmail: "test@test.com",
        });
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken)
        .patch(`/api/users/${buyer.id}/email`)
        .send({
          userEmail: "test@test.com",
        });
      expect(res.body.message).toEqual(errors.notAuthorized.message);
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
    });
  });
});
