import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import * as emailUtils from "../../utils/email";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, errors as logicErrors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn, unusedCookie } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection,
  seller,
  sellerCookie,
  sellerToken,
  validReset,
  validResetCookie,
  validResetToken,
  invalidReset,
  invalidResetCookie,
  invalidResetToken,
  expiredReset,
  expiredResetCookie,
  expiredResetToken,
  validVerification,
  validVerificationCookie,
  validVerificationToken,
  invalidVerification,
  invalidVerificationCookie,
  invalidVerificationToken,
  expiredVerification,
  expiredVerificationCookie,
  expiredVerificationToken;

describe("Auth tests", () => {
  beforeAll(async () => {
    connection = await connectToDatabase();
    [
      seller,
      validReset,
      invalidReset,
      expiredReset,
      validVerification,
      invalidVerification,
      expiredVerification,
    ] = await Promise.all([
      await fetchUserByUsername({
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
      await fetchUserByUsername({
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
      await fetchUserByUsername({
        userUsername: "invalidResetToken",
        selection: [
          ...USER_SELECTION["ESSENTIAL_INFO"](),
          ...USER_SELECTION["STRIPE_INFO"](),
          ...USER_SELECTION["VERIFICATION_INFO"](),
          ...USER_SELECTION["AUTH_INFO"](),
          ...USER_SELECTION["LICENSE_INFO"](),
        ],
        connection,
      }),
      await fetchUserByUsername({
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
      await fetchUserByUsername({
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
      await fetchUserByUsername({
        userUsername: "invalidVerificationToken",
        selection: [
          ...USER_SELECTION["ESSENTIAL_INFO"](),
          ...USER_SELECTION["STRIPE_INFO"](),
          ...USER_SELECTION["VERIFICATION_INFO"](),
          ...USER_SELECTION["AUTH_INFO"](),
          ...USER_SELECTION["LICENSE_INFO"](),
        ],
        connection,
      }),
      await fetchUserByUsername({
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
    ]);
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
    ({ cookie: validResetCookie, token: validResetToken } =
      logUserIn(validReset));
    ({ cookie: invalidResetCookie, token: invalidResetToken } =
      logUserIn(invalidReset));
    ({ cookie: expiredResetCookie, token: expiredResetToken } =
      logUserIn(expiredReset));
    ({ cookie: validVerificationCookie, token: validVerificationToken } =
      logUserIn(validVerification));
    ({ cookie: invalidVerificationCookie, token: invalidVerificationToken } =
      logUserIn(invalidVerification));
    ({ cookie: expiredVerificationCookie, token: expiredVerificationToken } =
      logUserIn(expiredVerification));
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/auth/signup", () => {
    it("should create a new user", async () => {
      const sendEmailMock = jest
        .spyOn(emailUtils, "sendEmail")
        .mockImplementation();
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(responses.userSignedUp.message);
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(sendEmailMock).toHaveBeenCalled();
    });

    it("should throw a 400 error if user is already authenticated", async () => {
      const res = await request(app, sellerToken)
        .post("/api/auth/signup")
        .send({
          userName: "Test User",
          userUsername: "testuser",
          userEmail: "test@test.com",
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(
        logicErrors.alreadyAuthenticated.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a 409 error if username is already taken", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: seller.name,
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(logicErrors.userAlreadyExists.message);
      expect(res.statusCode).toEqual(logicErrors.userAlreadyExists.status);
    });

    it("should throw a 409 error if email is already taken", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: seller.email,
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(logicErrors.userAlreadyExists.message);
      expect(res.statusCode).toEqual(logicErrors.userAlreadyExists.status);
    });

    it("should throw a validation error if username is too short", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          userName: "Test User",
          userUsername: new Array(ranges.username.min).join("a"),
          userEmail: "test@test.com",
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameMin.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if username is too long", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          userName: "Test User",
          userUsername: new Array(ranges.username.max + 2).join("a"),
          userEmail: "test@test.com",
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.userUsernameMax.status);
    });

    it("should throw a validation error if username is invalid (contains anything other than letters, numbers and dots)", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "test-2",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameInvalid.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.userUsernameInvalid.status
      );
    });

    it("should throw a validation error if username is blacklisted", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "administrator",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameBlacklisted.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.userUsernameBlacklisted.status
      );
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: "test@",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userEmailInvalid.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if passwords don't match", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User2Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMismatch.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          userName: "Test User",
          userUsername: "testuser",
          userEmail: "test@test.com",
          userPassword: new Array(ranges.password.min).join("a"),
          userConfirm: new Array(ranges.password.min).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMin.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMin.status);
    });

    it("should throw a validation error if password is too long", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          userName: "Test User",
          userUsername: "testuser",
          userEmail: "test@test.com",
          userPassword: new Array(ranges.password.max + 2).join("a"),
          userConfirm: new Array(ranges.password.max + 2).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMax.status);
    });

    it("should throw a validation error if name is too long", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          userName: new Array(ranges.fullName.max + 2).join("a"),
          userUsername: "testuser",
          userEmail: "test@test.com",
          userPassword: "User1Password",
          userConfirm: "User1Password",
        });
      expect(res.body.message).toEqual(validationErrors.userNameMax.message);
      expect(res.statusCode).toEqual(validationErrors.userNameMax.status);
    });

    it("should throw a validation error if name is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userNameRequired.message
      );
      expect(res.statusCode).toEqual(validationErrors.userNameRequired.status);
    });

    it("should throw a validation error if username is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameRequired.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userEmailRequired.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if password is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userName: "Test User",
        userEmail: "test@test.com",
        userConfirm: "User2Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordRequired.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if confirmed password is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userConfirmationRequired.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });
  });

  describe("/api/auth/login", () => {
    it("should throw a 400 error if user is already authenticated", async () => {
      const res = await request(app, sellerToken).post("/api/auth/login").send({
        userUsername: "testuser",
        userPassword: "User1Password",
      });
      expect(res.body.message).toEqual(
        logicErrors.alreadyAuthenticated.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a 403 error if user is not verified", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: validVerification.name,
        userPassword: validVerification.password,
      });
      expect(res.body.message).toEqual(logicErrors.userNotVerified.message);
      expect(res.statusCode).toEqual(logicErrors.userNotVerified.status);
    });

    it("should throw a 404 error if user doesn't exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: "testuser",
        userPassword: "User1Password",
      });
      expect(res.body.message).toEqual(logicErrors.userDoesNotExist.message);
      expect(res.statusCode).toEqual(statusCodes.notFound);
    });

    it("should throw a 404 error if password is incorrect", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: seller.name,
        userPassword: "invalidpassword",
      });
      expect(res.body.message).toEqual(logicErrors.userDoesNotExist.message);
      expect(res.statusCode).toEqual(logicErrors.userDoesNotExist.status);
    });

    it("should throw a validation error if username is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userPassword: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameRequired.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a validation error if password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: "testuser",
      });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordRequired.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });
  });

  describe("/api/auth/logout", () => {
    it("should log the user out", async () => {
      const res = await request(app, sellerToken)
        .post("/api/auth/logout")
        .send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toEqual("");
      expect(res.body.user).toEqual("");
    });

    it("should throw a 403 error if user is not authenticated", async () => {
      const res = await request(app).post("/api/auth/logout").send();
      expect(res.body.message).toEqual(logicErrors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(statusCodes.forbidden);
    });
  });

  describe("/api/auth/refresh_token", () => {
    it("should return a new access token if refresh token is valid", async () => {
      const res = await request(app, sellerToken, sellerCookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toBeTruthy();
    });

    it("should return a 403 error if refresh token is invalid", async () => {
      const res = await request(app, sellerToken, "invalid cookie")
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should return a 403 error if user is not found", async () => {
      const res = await request(app, "", unusedCookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
    });

    it("should return a 403 error if user is not verified", async () => {
      const res = await request(
        app,
        validVerificationToken,
        validVerificationCookie
      )
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(errors.userNotVerified.status);
      expect(res.body.message).toEqual(errors.userNotVerified.message);
    });
  });

  describe.only("/api/auth/verify_token/:tokenId", () => {
    it("should verify user's token", async () => {
      const res = await request(app)
        .get(`/api/auth/verify_token/${validVerification.verificationToken}`)
        .send();
      expect(res.statusCode).toEqual(responses.registerTokenVerified.status);
      expect(res.body.message).toEqual(responses.registerTokenVerified.message);
    });

    it("should throw an error if user is authenticated", async () => {
      const res = await request(app, validVerificationToken)
        .get(`/api/auth/verify_token/${validVerification.verificationToken}`)
        .send();
      expect(res.statusCode).toEqual(errors.alreadyAuthenticated.status);
      expect(res.body.message).toEqual(errors.alreadyAuthenticated.message);
    });

    it("should throw an error if tokenId is invalid", async () => {
      const res = await request(app)
        .get(`/api/auth/verify_token/${invalidVerification.verificationToken}`)
        .send();
      expect(res.statusCode).toEqual(errors.routeParameterInvalid.status);
      expect(res.body.message).toEqual(errors.routeParameterInvalid.message);
    });

    it("should throw an error if token is expired", async () => {
      const res = await request(app)
        .get(`/api/auth/verify_token/${expiredVerification.verificationToken}`)
        .send();
      expect(res.statusCode).toEqual(errors.verificationTokenInvalid.status);
      expect(res.body.message).toEqual(errors.verificationTokenInvalid.message);
    });
  });
});
