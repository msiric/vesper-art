import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import * as emailUtils from "../../utils/email";
import { USER_SELECTION } from "../../utils/selectors";
import { errors, errors as logicErrors, responses } from "../../utils/statuses";
import { invalidUsers, validUsers } from "../fixtures/entities";
import { accessTokens, logUserIn, unusedCookie } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

const sendEmailMock = jest.spyOn(emailUtils, "sendEmail").mockImplementation();

let connection,
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
  expiredVerificationUserToken;

describe("Auth tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [
      seller,
      validResetUser,
      expiredResetUser,
      validVerificationUser,
      expiredVerificationUser,
    ] = await Promise.all([
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
    ]);
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
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/auth/signup", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(sendEmailMock).toHaveBeenCalled();
      expect(res.body.message).toEqual(responses.userSignedUp.message);
      expect(res.statusCode).toEqual(responses.userSignedUp.status);
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
      expect(res.statusCode).toEqual(logicErrors.alreadyAuthenticated.status);
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
      expect(res.statusCode).toEqual(validationErrors.userUsernameMin.status);
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
      expect(res.statusCode).toEqual(validationErrors.userEmailInvalid.status);
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
      expect(res.statusCode).toEqual(
        validationErrors.userPasswordMismatch.status
      );
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
      expect(res.statusCode).toEqual(
        validationErrors.userUsernameRequired.status
      );
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
      expect(res.statusCode).toEqual(validationErrors.userEmailRequired.status);
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
      expect(res.statusCode).toEqual(
        validationErrors.userPasswordRequired.status
      );
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
      expect(res.statusCode).toEqual(
        validationErrors.userConfirmationRequired.status
      );
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
      expect(res.statusCode).toEqual(logicErrors.alreadyAuthenticated.status);
    });

    it("should throw a 403 error if user is not verified", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: invalidUsers.validVerification.username,
        userPassword: invalidUsers.validVerification.password,
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
      expect(res.statusCode).toEqual(logicErrors.userDoesNotExist.status);
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
      expect(res.statusCode).toEqual(
        validationErrors.userUsernameRequired.status
      );
    });

    it("should throw a validation error if password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: "testuser",
      });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.userPasswordRequired.status
      );
    });
  });

  describe("/api/auth/logout", () => {
    it("should log the user out", async () => {
      const res = await request(app, sellerToken)
        .post("/api/auth/logout")
        .send();
      expect(res.body.accessToken).toEqual("");
      expect(res.body.user).toEqual("");
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw a 401 error if token has expired", async () => {
      const res = await request(app, accessTokens.expiredBuyer)
        .post("/api/auth/logout")
        .send();
      expect(res.body.message).toEqual(logicErrors.notAuthenticated.message);
      expect(res.statusCode).toEqual(logicErrors.notAuthenticated.status);
    });

    it("should throw a 403 error if user is not authenticated", async () => {
      const res = await request(app).post("/api/auth/logout").send();
      expect(res.body.message).toEqual(logicErrors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(logicErrors.forbiddenAccess.status);
    });
  });

  describe("/api/auth/refresh_token", () => {
    it("should return a new access token if refresh token is valid", async () => {
      const res = await request(app, sellerToken, sellerCookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.body.accessToken).toBeTruthy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should return a 403 error if refresh token is invalid", async () => {
      const res = await request(app, sellerToken, "invalid cookie")
        .post("/api/auth/refresh_token")
        .send();
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should return a 403 error if user is not found", async () => {
      const res = await request(app, "", unusedCookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.body.message).toEqual(errors.forbiddenAccess.message);
      expect(res.statusCode).toEqual(errors.forbiddenAccess.status);
    });

    it("should return a 403 error if user is not verified", async () => {
      const res = await request(
        app,
        validVerificationUserToken,
        validVerificationUserCookie
      )
        .post("/api/auth/refresh_token")
        .send();
      expect(res.body.message).toEqual(errors.userNotVerified.message);
      expect(res.statusCode).toEqual(errors.userNotVerified.status);
    });
  });

  describe("/api/auth/verify_token/:tokenId", () => {
    it("should verify user's token", async () => {
      const res = await request(app)
        .get(
          `/api/auth/verify_token/${validVerificationUser.verificationToken}`
        )
        .send();
      expect(res.body.message).toEqual(responses.registerTokenVerified.message);
      expect(res.statusCode).toEqual(responses.registerTokenVerified.status);
    });

    it("should throw an error if user is authenticated", async () => {
      const res = await request(app, validVerificationUserToken)
        .get(
          `/api/auth/verify_token/${validVerificationUser.verificationToken}`
        )
        .send();
      expect(res.body.message).toEqual(errors.alreadyAuthenticated.message);
      expect(res.statusCode).toEqual(errors.alreadyAuthenticated.status);
    });

    it("should throw an error if token is expired", async () => {
      const res = await request(app)
        .get(
          `/api/auth/verify_token/${expiredVerificationUser.verificationToken}`
        )
        .send();
      expect(res.body.message).toEqual(errors.verificationTokenInvalid.message);
      expect(res.statusCode).toEqual(errors.verificationTokenInvalid.status);
    });
  });

  describe("/api/auth/forgot_password", () => {
    it("should send reset token", async () => {
      const res = await request(app)
        .post("/api/auth/forgot_password")
        .send({ userEmail: seller.email });
      expect(sendEmailMock).toHaveBeenCalled();
      expect(res.body.message).toEqual(responses.passwordReset.message);
      expect(res.statusCode).toEqual(responses.passwordReset.status);
    });

    it("should throw an error if user is authenticated", async () => {
      const res = await request(app, sellerToken)
        .post("/api/auth/forgot_password")
        .send({ userEmail: seller.email });
      expect(res.body.message).toEqual(errors.alreadyAuthenticated.message);
      expect(res.statusCode).toEqual(errors.alreadyAuthenticated.status);
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app)
        .post("/api/auth/forgot_password")
        .send({ userEmail: false });
      expect(res.body.message).toEqual(
        validationErrors.userEmailInvalid.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailInvalid.status);
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app).post("/api/auth/forgot_password").send({});
      expect(res.body.message).toEqual(
        validationErrors.userEmailRequired.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailRequired.status);
    });

    it("should not send token if user email does not exist", async () => {
      const res = await request(app)
        .post("/api/auth/forgot_password")
        .send({ userEmail: "thisuserdoesnotexist@gmail.com" });
      expect(sendEmailMock).not.toHaveBeenCalled();
      expect(res.body.message).toEqual(responses.passwordReset.message);
      expect(res.statusCode).toEqual(responses.passwordReset.status);
    });
  });
  describe("/api/auth/reset_password/user/:userId/token/:tokenId", () => {
    it("should reset password", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${validResetUser.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
          userPassword: "newpassword123",
          userConfirm: "newpassword123",
        });
      expect(res.body.message).toEqual(responses.passwordUpdated.message);
      expect(res.statusCode).toEqual(responses.passwordUpdated.status);
    });

    it("should throw an error if user is authenticated", async () => {
      const res = await request(app, validResetUserToken)
        .post(
          `/api/auth/reset_password/user/${validResetUser.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
          userPassword: "newpassword123",
          userConfirm: "newpassword123",
        });
      expect(res.body.message).toEqual(errors.alreadyAuthenticated.message);
      expect(res.statusCode).toEqual(errors.alreadyAuthenticated.status);
    });

    it("should throw an error if token has the wrong user", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${invalidUsers.expiredReset.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
          userPassword: "newpassword123",
          userConfirm: "newpassword123",
        });
      expect(res.body.message).toEqual(errors.resetTokenInvalid.message);
      expect(res.statusCode).toEqual(errors.resetTokenInvalid.status);
    });

    it("should throw an error if user has the wrong token", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${invalidUsers.validReset.id}/token/${invalidUsers.expiredReset.randomBytes}`
        )
        .send({
          userPassword: "newpassword123",
          userConfirm: "newpassword123",
        });
      expect(res.body.message).toEqual(errors.resetTokenInvalid.message);
      expect(res.statusCode).toEqual(errors.resetTokenInvalid.status);
    });

    it("should throw an error if user id is invalid", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/false/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
          userPassword: "newpassword123",
          userConfirm: "newpassword123",
        });
      expect(res.body.message).toEqual(errors.routeParameterInvalid.message);
      expect(res.statusCode).toEqual(errors.routeParameterInvalid.status);
    });

    it("should throw an error if token is expired", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${expiredResetUser.id}/token/${invalidUsers.expiredReset.randomBytes}`
        )
        .send({
          userPassword: "newpassword123",
          userConfirm: "newpassword123",
        });
      expect(res.body.message).toEqual(errors.resetTokenInvalid.message);
      expect(res.statusCode).toEqual(errors.resetTokenInvalid.status);
    });

    it("should throw an error if password is the same as the previous one", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${validResetUser.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
          userPassword: invalidUsers.validReset.password,
          userConfirm: invalidUsers.validReset.password,
        });
      expect(res.body.message).toEqual(errors.newPasswordIdentical.message);
      expect(res.statusCode).toEqual(errors.newPasswordIdentical.status);
    });

    it("should throw a validation error if passwords don't match", async () => {
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${validResetUser.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
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
      const res = await request(app)
        .post(
          `/api/auth/reset_password/user/${validResetUser.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
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
        .post(
          `/api/auth/reset_password/user/${validResetUser.id}/token/${invalidUsers.validReset.randomBytes}`
        )
        .send({
          userPassword: new Array(ranges.password.max + 2).join("a"),
          userConfirm: new Array(ranges.password.max + 2).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMax.status);
    });
  });

  describe("/api/auth/resend_token", () => {
    it("should send resend token", async () => {
      const res = await request(app).post("/api/auth/resend_token").send({
        userEmail: validVerificationUser.email,
      });
      expect(sendEmailMock).toHaveBeenCalled();
      expect(res.body.message).toEqual(
        responses.verificationTokenResent.message
      );
      expect(res.statusCode).toEqual(responses.verificationTokenResent.status);
    });

    it("should not send token if user not found", async () => {
      const res = await request(app).post("/api/auth/resend_token").send({
        userEmail: "nonExistentEmail@mail.com",
      });
      expect(sendEmailMock).not.toHaveBeenCalled();
      expect(res.body.message).toEqual(
        responses.verificationTokenResent.message
      );
      expect(res.statusCode).toEqual(responses.verificationTokenResent.status);
    });

    it("should throw an error if user is authenticated", async () => {
      const res = await request(app, validVerificationUserToken)
        .post("/api/auth/resend_token")
        .send({
          userEmail: validVerificationUser.email,
        });
      expect(res.body.message).toEqual(errors.alreadyAuthenticated.message);
      expect(res.statusCode).toEqual(errors.alreadyAuthenticated.status);
    });

    it("should throw an error if user is verified", async () => {
      const res = await request(app).post("/api/auth/resend_token").send({
        userEmail: seller.email,
      });
      expect(res.body.message).toEqual(errors.userAlreadyVerified.message);
      expect(res.statusCode).toEqual(errors.userAlreadyVerified.status);
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app).post("/api/auth/resend_token").send({
        userEmail: "invalidEmail",
      });
      expect(res.body.message).toEqual(
        validationErrors.userEmailInvalid.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailInvalid.status);
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app).post("/api/auth/resend_token").send({});
      expect(res.body.message).toEqual(
        validationErrors.userEmailRequired.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailRequired.status);
    });

    it("should throw a validation error if email is too long", async () => {
      const res = await request(app)
        .post("/api/auth/resend_token")
        .send({
          userEmail: `${new Array(ranges.email.max).join("a")}@test.com`,
        });
      expect(res.body.message).toEqual(validationErrors.userEmailMax.message);
      expect(res.statusCode).toEqual(validationErrors.userEmailMax.status);
    });
  });

  describe("/api/auth/update_email", () => {
    it("should update email", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: "nonExistentEmail@mail.com",
        userUsername: validUsers.seller.username,
        userPassword: validUsers.seller.password,
      });
      expect(sendEmailMock).toHaveBeenCalled();
      expect(res.body.message).toEqual(responses.emailAddressUpdated.message);
      expect(res.statusCode).toEqual(responses.emailAddressUpdated.status);
    });

    it("should throw an error if user is authenticated", async () => {
      const res = await request(app, sellerToken)
        .post("/api/auth/update_email")
        .send({
          userEmail: validUsers.seller.email,
          userUsername: validUsers.seller.username,
          userPassword: validUsers.seller.password,
        });
      expect(res.body.message).toEqual(errors.alreadyAuthenticated.message);
      expect(res.statusCode).toEqual(errors.alreadyAuthenticated.status);
    });

    it("should throw an error if user doesn't exist", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: validUsers.seller.email,
        userUsername: "nonExistentUser",
        userPassword: validUsers.seller.password,
      });
      expect(res.body.message).toEqual(errors.userDoesNotExist.message);
      expect(res.statusCode).toEqual(errors.userDoesNotExist.status);
    });

    it("should throw an error if password is wrong", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: validUsers.seller.email,
        userUsername: validUsers.seller.username,
        userPassword: "wrongPassword",
      });
      expect(res.body.message).toEqual(errors.userDoesNotExist.message);
      expect(res.statusCode).toEqual(errors.userDoesNotExist.status);
    });

    it("should not reset email if email is taken", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: invalidUsers.validReset.email,
        userUsername: validUsers.seller.username,
        userPassword: validUsers.seller.password,
      });
      expect(sendEmailMock).not.toHaveBeenCalled();
      expect(res.body.message).toEqual(responses.emailAddressUpdated.message);
      expect(res.statusCode).toEqual(responses.emailAddressUpdated.status);
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: "invalidEmail",
        userUsername: validUsers.seller.username,
        userPassword: validUsers.seller.password,
      });
      expect(res.body.message).toEqual(
        validationErrors.userEmailInvalid.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailInvalid.status);
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userUsername: validUsers.seller.username,
        userPassword: validUsers.seller.password,
      });
      expect(res.body.message).toEqual(
        validationErrors.userEmailRequired.message
      );
      expect(res.statusCode).toEqual(validationErrors.userEmailRequired.status);
    });

    it("should throw a validation error if email is too long", async () => {
      const res = await request(app)
        .post("/api/auth/update_email")
        .send({
          userEmail: `${new Array(ranges.email.max).join("a")}@test.com`,
          userUsername: validUsers.seller.username,
          userPassword: validUsers.seller.password,
        });
      expect(res.body.message).toEqual(validationErrors.userEmailMax.message);
      expect(res.statusCode).toEqual(validationErrors.userEmailMax.status);
    });

    it("should throw a validation error if username is too short", async () => {
      const res = await request(app)
        .post("/api/auth/update_email")
        .send({
          userEmail: validUsers.seller.email,
          userUsername: new Array(ranges.username.min).join("a"),
          userPassword: validUsers.seller.password,
        });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameMin.message
      );
      expect(res.statusCode).toEqual(validationErrors.userUsernameMin.status);
    });

    it("should throw a validation error if username is too long", async () => {
      const res = await request(app)
        .post("/api/auth/update_email")
        .send({
          userEmail: validUsers.seller.email,
          userUsername: new Array(ranges.username.max + 2).join("a"),
          userPassword: validUsers.seller.password,
        });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.userUsernameMax.status);
    });

    it("should throw a validation error if username is invalid (contains anything other than letters, numbers and dots)", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: validUsers.seller.email,
        userUsername: "test-2",
        userPassword: validUsers.seller.password,
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameInvalid.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.userUsernameInvalid.status
      );
    });

    it("should throw a validation error if username is blacklisted", async () => {
      const res = await request(app).post("/api/auth/update_email").send({
        userEmail: validUsers.seller.email,
        userUsername: "administrator",
        userPassword: validUsers.seller.password,
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameBlacklisted.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.userUsernameBlacklisted.status
      );
    });

    it("should throw a validation error if password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/update_email")
        .send({
          userEmail: validUsers.seller.email,
          userUsername: validUsers.seller.username,
          userPassword: new Array(ranges.password.min).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMin.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMin.status);
    });

    it("should throw a validation error if password is too long", async () => {
      const res = await request(app)
        .post("/api/auth/update_email")
        .send({
          userEmail: validUsers.seller.email,
          userUsername: validUsers.seller.username,
          userPassword: new Array(ranges.password.max + 2).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMax.message
      );
      expect(res.statusCode).toEqual(validationErrors.userPasswordMax.status);
    });
  });
});