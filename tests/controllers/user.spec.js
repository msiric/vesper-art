import path from "path";
import app from "../../app";
import { countries, statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { ArtworkVisibility } from "../../entities/Artwork";
import { fetchAllArtworks } from "../../services/postgres/artwork";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, responses } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import { fileTooLargeError, logUserIn } from "../utils/helpers";
import { request } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../tests/media");

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

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
  artwork,
  artworkBySeller,
  invisibleArtworkBySeller,
  inactiveArtworkBySeller,
  visibleArtworkBySeller,
  activeArtworkBySeller,
  invisibleAndInactiveArtworkBySeller,
  visibleAndActiveArtworkBySeller;

describe.only("User tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, impartial, artwork] = await Promise.all([
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
      fetchAllArtworks({ connection }),
    ]);
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    ({ cookie: impartialCookie, token: impartialToken } = logUserIn(impartial));

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
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/users/:userUsername", () => {
    it("should find user with provided username", async () => {
      const res = await request(app).get(`/api/users/${buyer.name}`);
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.user).toBeTruthy();
    });

    it("should throw an error if user doesn't exist", async () => {
      const res = await request(app).get(`/api/users/unknownUser`);
      expect(res.statusCode).toEqual(errors.userNotFound.status);
      expect(res.body.message).toEqual(errors.userNotFound.message);
    });
  });

  // $TODO add - should have been called
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
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
      });

      it("should update user with new avatar and description", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          )
          .field("userDescription", "test");
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
      });

      it("should update user with new avatar and country", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .attach(
            "userMedia",
            path.resolve(__dirname, `${MEDIA_LOCATION}/valid_file_avatar.png`)
          )
          .field("userCountry", countries[0].value);
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
      });

      it("should update user with new description and country", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({ userDescription: "test", userCountry: countries[0].value });
        expect(res.statusCode).toEqual(responses.userDetailsUpdated.status);
        expect(res.body.message).toEqual(responses.userDetailsUpdated.message);
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
        expect(res.statusCode).toEqual(errors.fileDimensionsInvalid.status);
        expect(res.body.message).toEqual(errors.fileDimensionsInvalid.message);
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
        expect(res.statusCode).toEqual(validationErrors.userMediaType.status);
        expect(res.body.message).toEqual(
          validationErrors.userMediaType.message
        );
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
        expect(res.statusCode).toEqual(errors.aspectRatioInvalid.status);
        expect(res.body.message).toEqual(errors.aspectRatioInvalid.message);
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
        expect(res.statusCode).toEqual(statusCodes.badRequest);
        expect(res.body.message).toEqual(fileTooLargeError);
      });

      it("should throw a validation error if description is too long", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({
            userDescription: new Array(ranges.profileDescription.max + 2).join(
              "a"
            ),
          });
        expect(res.statusCode).toEqual(
          validationErrors.userDescriptionMax.status
        );
        expect(res.body.message).toEqual(
          validationErrors.userDescriptionMax.message
        );
      });

      it("should throw a validation error if country is too long", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({
            userCountry: "invalidCountry",
          });
        expect(res.statusCode).toEqual(validationErrors.userCountryMax.status);
        expect(res.body.message).toEqual(
          validationErrors.userCountryMax.message
        );
      });

      it("should throw a validation error if country is invalid", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${buyer.id}`)
          .send({
            userCountry: "ZZ",
          });
        expect(res.statusCode).toEqual(
          validationErrors.invalidUserCountry.status
        );
        expect(res.body.message).toEqual(
          validationErrors.invalidUserCountry.message
        );
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app)
          .patch(`/api/users/${buyer.id}`)
          .send({ userDescription: "test" });
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken)
          .patch(`/api/users/${seller.id}`)
          .send({ userDescription: "test" });
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
        expect(res.body.message).toEqual(errors.notAuthorized.message);
      });
    });

    // $TODO add - should have been called
    describe("deactivateUser", () => {
      it("should deactivate user", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${buyer.id}`
        );
        expect(res.statusCode).toEqual(responses.userDeactivated.status);
        expect(res.body.message).toEqual(responses.userDeactivated.message);
      });

      it("should throw an error if user is not authenticated", async () => {
        const res = await request(app).delete(`/api/users/${buyer.id}`);
        expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
        expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      });

      it("should throw an error if user is not authorized", async () => {
        const res = await request(app, buyerToken).delete(
          `/api/users/${seller.id}`
        );
        expect(res.statusCode).toEqual(errors.notAuthorized.status);
        expect(res.body.message).toEqual(errors.notAuthorized.message);
      });
    });
  });

  describe("/api/users/:userUsername/artwork", () => {
    it("should fetch user artwork", async () => {
      const res = await request(app).get(`/api/users/${buyer.name}/artwork`);
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.artwork).toHaveLength(
        entities.Artwork.filter((item) => item.ownerId === buyer.id).length
      );
    });

    it("should throw an error if user is not found", async () => {
      const res = await request(app).get(`/api/users/nonExistentUser/artwork`);
      expect(res.statusCode).toEqual(errors.userNotFound.status);
      expect(res.body.message).toEqual(errors.userNotFound.message);
    });
  });

  describe("/api/users/:userUsername/favorites", () => {
    it("should fetch user favorites", async () => {
      const res = await request(app).get(`/api/users/${seller.name}/favorites`);
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.favorites).toHaveLength(
        entities.Favorite.filter((item) => item.ownerId === seller.id).length
      );
    });

    it("should throw an error if user is not found", async () => {
      const res = await request(app).get(
        `/api/users/nonExistentUser/favorites`
      );
      expect(res.statusCode).toEqual(errors.userNotFound.status);
      expect(res.body.message).toEqual(errors.userNotFound.message);
    });

    it("should throw an error if user has disabled displaying favorites", async () => {
      const res = await request(app).get(`/api/users/${buyer.name}/favorites`);
      expect(res.statusCode).toEqual(errors.userFavoritesNotAllowed.status);
      expect(res.body.message).toEqual(errors.userFavoritesNotAllowed.message);
    });
  });

  // $TODO refactor getUserUploads to fit both cases

  describe("/api/users/:userId/ownership", () => {
    it("should fetch user artwork", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/ownership`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.purchases).toHaveLength(
        entities.Order.filter(
          (item, index, self) =>
            self.findIndex((value) => value.artworkId === item.artworkId) ===
            index
        ).length
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/ownership`);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/ownership`
      );
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });

  describe("/api/users/:userId/statistics/sales", () => {
    it("should fetch user selling statistics", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.sales).toHaveLength(
        entities.Order.filter((item) => item.sellerId === seller.id).length
      );
      expect(res.body.reviews).toHaveLength(
        entities.Review.filter((item) => item.revieweeId === seller.id).length
      );
      expect(res.body.amount).toBeTruthy();
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${seller.id}/statistics/sales`
      );
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });

  describe("/api/users/:userId/statistics/purchases", () => {
    it("should fetch user buying statistics", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.purchases).toHaveLength(
        entities.Order.filter((item) => item.buyerId === buyer.id).length
      );
      expect(res.body.favorites).toHaveLength(
        entities.Favorite.filter((item) => item.ownerId === buyer.id).length
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/statistics/purchases`
      );
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });

  describe("/api/users/:userId/settings", () => {
    it("should fetch buyer settings", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/settings`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.user).toBeTruthy();
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(`/api/users/${buyer.id}/settings`);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/settings`
      );
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });

  describe("/api/users/:userId/notifications", () => {
    it("should fetch buyer notifications", async () => {
      const res = await request(app, buyerToken).get(
        `/api/users/${buyer.id}/notifications`
      );
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.notifications).toHaveLength(
        entities.Notification.filter((item) => item.receiverId === buyer.id)
          .length
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app).get(
        `/api/users/${buyer.id}/notifications`
      );
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken).get(
        `/api/users/${buyer.id}/notifications`
      );
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });

  describe("/api/users/:userId/origin", () => {
    it("should patch user origin", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: countries.find((item) => item.supported).value,
        });
      expect(res.statusCode).toEqual(responses.businessAddressUpdated.status);
      expect(res.body.message).toEqual(
        responses.businessAddressUpdated.message
      );
    });

    it("should throw a validation error if business address is missing", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({});
      expect(res.statusCode).toEqual(
        validationErrors.originCountryRequired.status
      );
      expect(res.body.message).toEqual(
        validationErrors.originCountryRequired.message
      );
    });

    it("should throw a validation error if business address is too long", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: "invalidCountry",
        });
      expect(res.statusCode).toEqual(validationErrors.originCountryMax.status);
      expect(res.body.message).toEqual(
        validationErrors.originCountryMax.message
      );
    });

    it("should throw a validation error if business address is invalid", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: "ZZ",
        });
      expect(res.statusCode).toEqual(
        validationErrors.invalidStripeCountry.status
      );
      expect(res.body.message).toEqual(
        validationErrors.invalidStripeCountry.message
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: countries.find((item) => item.supported).value,
        });
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken)
        .patch(`/api/users/${buyer.id}/origin`)
        .send({
          userBusinessAddress: countries.find((item) => item.supported).value,
        });
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });

  describe("/api/users/:userId/preferences", () => {
    it("should patch user preferences (enable favorites)", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: true,
        });
      expect(res.statusCode).toEqual(responses.preferencesUpdated.status);
      expect(res.body.message).toEqual(responses.preferencesUpdated.message);
    });

    it("should patch user preferences (disable favorites)", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: false,
        });
      expect(res.statusCode).toEqual(responses.preferencesUpdated.status);
      expect(res.body.message).toEqual(responses.preferencesUpdated.message);
    });

    it("should throw a validation error if user favorites is missing", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({});
      expect(res.statusCode).toEqual(
        validationErrors.favoritesPreferenceRequired.status
      );
      expect(res.body.message).toEqual(
        validationErrors.favoritesPreferenceRequired.message
      );
    });

    it("should throw an error if user is not authenticated", async () => {
      const res = await request(app)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: true,
        });
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should throw an error if user is not authorized", async () => {
      const res = await request(app, sellerToken)
        .patch(`/api/users/${buyer.id}/preferences`)
        .send({
          userFavorites: true,
        });
      expect(res.statusCode).toEqual(errors.notAuthorized.status);
      expect(res.body.message).toEqual(errors.notAuthorized.message);
    });
  });
});
