/* import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors } from "../../common/validation";
import { admin } from "../../config/secret";
import { fetchUserByUsername } from "../../services/postgres/user";
import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { formatTokenData } from "../../utils/helpers";
import { USER_SELECTION } from "../../utils/selectors";
import { errors as logicErrors, responses } from "../../utils/statuses";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection;
let user;
let cookie;
let token;

describe("Auth tests", () => {
  beforeAll(async (done) => {
    connection = await connectToDatabase();
    user = await fetchUserByUsername({
      userUsername: admin.username,
      selection: [
        ...USER_SELECTION["ESSENTIAL_INFO"](),
        ...USER_SELECTION["STRIPE_INFO"](),
        ...USER_SELECTION["VERIFICATION_INFO"](),
        ...USER_SELECTION["AUTH_INFO"](),
        ...USER_SELECTION["LICENSE_INFO"](),
      ],
      connection,
    });
    const { tokenPayload } = formatTokenData({ user });
    cookie = createRefreshToken({ userData: tokenPayload });
    token = createAccessToken({ userData: tokenPayload });
    done();
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/auth/signup", () => {
    // needs a valid user in db to finish properly
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userName: "Test User",
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.body.message).toEqual(responses.userSignedUp.message);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw a 400 error if user is already authenticated", async () => {
      const res = await request(app, token).post("/api/auth/signup").send({
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

    it("should throw a validation error if username is too short", async () => {
      const res = await request(app).post("/api/auth/signup").send({
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

    it("should throw a validation error if username is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
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
      const res = await request(app, token).post("/api/auth/login").send({
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
      const res = await request(app, token).post("/api/auth/logout").send();
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
      const res = await request(app, token, cookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toBeTruthy();
    });
  });

  describe("/api/auth/refresh_token", () => {
    it("should return a 403 error if refresh token is invalid", async () => {
      const res = await request(app, token, "invalid cookie")
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(statusCodes.forbidden);
    });
  });

  // needs a valid user in db to finish properly
  describe("/api/auth/verify_token/:tokenId", () => {
    it("should verify user's token", async () => {
      const res = await request(app, token).post("/api/auth/logout").send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toEqual("");
      expect(res.body.user).toEqual("");
    });
  });
});
 */
