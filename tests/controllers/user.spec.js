import path from "path";
import app from "../../app";
import { countries, statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import * as s3Utils from "../../lib/s3";
import * as artworkServices from "../../services/artwork";
import { fetchAllArtworks } from "../../services/artwork";
import * as authServices from "../../services/auth";
import { fetchUserPurchases, fetchUserSales } from "../../services/order";
import * as userServices from "../../services/user";
import { fetchUserByUsername } from "../../services/user";
import {
  closeConnection,
  connectToDatabase,
  USER_SELECTION,
} from "../../utils/database";
import * as emailUtils from "../../utils/email";
import { errors, responses } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import {
  fileTooLargeError,
  findMultiOrderedArtwork,
  findSingleOrderedArtwork,
  findUniqueOrders,
  findUnorderedArtwork,
  logUserIn,
} from "../utils/helpers";
import { request } from "../utils/request";

const MEDIA_LOCATION = path.resolve(__dirname, "../../../tests/media");

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
  buyerToken,
  seller,
  sellerToken,
  avatar,
  avatarToken,
  artwork,
  artworkBySeller,
  activeArtworkBySeller,
  unorderedArtwork,
  onceOrderedArtworkWithNewVersion,
  multiOrderedArtworkWithNoNewVersions;

describe("User tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, avatar, artwork] = await Promise.all([
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
    ({ token: buyerToken } = logUserIn(buyer));
    ({ token: sellerToken } = logUserIn(seller));
    ({ token: avatarToken } = logUserIn(avatar));

    artworkBySeller = artwork.filter((item) => item.owner.id === seller.id);
    activeArtworkBySeller = artworkBySeller.filter(
      (item) => item.active === true
    );
    unorderedArtwork = findUnorderedArtwork(
      activeArtworkBySeller,
      entities.Order
    );
    onceOrderedArtworkWithNewVersion = findSingleOrderedArtwork(entities.Order);
    multiOrderedArtworkWithNoNewVersions = findUniqueOrders(
      findMultiOrderedArtwork(entities.Order)
    );
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
            userDescription: new Array(ranges.userDescription.max + 2).join(
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

    // $TODO Add - should have been called
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
          userPassword: new Array(ranges.userPassword.min).join("a"),
          userConfirm: new Array(ranges.userPassword.min).join("a"),
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
          userPassword: new Array(ranges.userPassword.max + 2).join("a"),
          userConfirm: new Array(ranges.userPassword.max + 2).join("a"),
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
          userEmail: `${new Array(ranges.userEmail.max).join("a")}@test.com`,
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
