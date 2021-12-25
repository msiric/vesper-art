import path from "path";
import app from "../../app";
import { countries, statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn } from "../utils/helpers";
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
  impartialToken;

describe.only("User tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyer, seller, impartial] = await Promise.all([
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
    ]);
    ({ cookie: buyerCookie, token: buyerToken } = logUserIn(buyer));
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    ({ cookie: impartialCookie, token: impartialToken } = logUserIn(impartial));
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

  describe("/api/users/:userId", () => {
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
      expect(res.body.message).toEqual(validationErrors.userMediaType.message);
    });

    it("should throw an error if avatar has an invalid ratio", async () => {
      const res = await request(app, buyerToken)
        .patch(`/api/users/${buyer.id}`)
        .attach(
          "userMedia",
          path.resolve(__dirname, `${MEDIA_LOCATION}/invalid_ratio_avatar.png`)
        )
        .field("userDescription", "test")
        .field("userCountry", countries[0].value);
      expect(res.statusCode).toEqual(errors.aspectRatioInvalid.status);
      expect(res.body.message).toEqual(errors.aspectRatioInvalid.message);
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
      expect(res.body.message).toEqual(validationErrors.userCountryMax.message);
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
});
