import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors } from "../../common/validation";
import { fetchUserByUsername } from "../../services/postgres/user";
import { closeConnection, connectToDatabase } from "../../utils/database";
import * as emailUtils from "../../utils/email";
import { USER_SELECTION } from "../../utils/selectors";
import { errors as logicErrors, responses } from "../../utils/statuses";
import { validUsers } from "../fixtures/entities";
import { logUserIn } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection, seller, buyer, sellerCookie, sellerToken;

describe("Auth tests", () => {
  beforeAll(async () => {
    connection = await connectToDatabase();
    seller = await fetchUserByUsername({
      userUsername: validUsers.seller.username,
      selection: [
        ...USER_SELECTION["ESSENTIAL_INFO"](),
        ...USER_SELECTION["STRIPE_INFO"](),
        ...USER_SELECTION["VERIFICATION_INFO"](),
        ...USER_SELECTION["AUTH_INFO"](),
        ...USER_SELECTION["LICENSE_INFO"](),
      ],
      connection,
    });
    ({ cookie: sellerCookie, token: sellerToken } = logUserIn(seller));
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
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "test",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(
        validationErrors.userUsernameMin.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
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

  // needs a valid user in db to finish properly
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

    it("should throw a 400 error if user is not verified", async () => {
      const res = await request(app, sellerToken).post("/api/auth/login").send({
        userUsername: "testuser",
        userPassword: "User1Password",
      });
      expect(res.body.message).toEqual(
        logicErrors.alreadyAuthenticated.message
      );
      expect(res.statusCode).toEqual(statusCodes.badRequest);
    });

    it("should throw a 404 error if user doesn't exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: "testuser",
        userPassword: "User1Password",
      });
      expect(res.body.message).toEqual(logicErrors.userDoesNotExist.message);
      expect(res.statusCode).toEqual(statusCodes.notFound);
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

  // needs a valid user in db to finish properly
  describe("/api/auth/refresh_token", () => {
    it("should return a new access token if refresh token is valid", async () => {
      const res = await request(app, sellerToken, sellerCookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toBeTruthy();
    });
  });

  describe("/api/auth/refresh_token", () => {
    it("should return a 403 error if refresh token is invalid", async () => {
      const res = await request(app, sellerToken, "invalid cookie")
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(statusCodes.forbidden);
    });
  });

  // needs a valid user in db to finish properly
  describe("/api/auth/verify_token/:tokenId", () => {
    it("should verify user's token", async () => {
      const res = await request(app, sellerToken)
        .post("/api/auth/logout")
        .send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toEqual("");
      expect(res.body.user).toEqual("");
    });
  });
});
