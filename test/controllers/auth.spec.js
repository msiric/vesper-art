import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors } from "../../common/validation";
import { createAccessToken } from "../../utils/auth";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { errors as logicErrors, responses } from "../../utils/statuses";
import { fakeUser, request, token } from "../utils/request";

jest.useFakeTimers();

let connection;

describe("User authentication", () => {
  beforeAll(async () => {
    connection = await connectToDatabase();
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("User signup", () => {
    // needs a valid user in db to finish properly
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.message).toEqual(responses.userSignedUp.message);
    });

    it("should throw a 400 error if user is already authenticated", async () => {
      const res = await request(app, token).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        logicErrors.alreadyAuthenticated.message
      );
    });

    it("should throw a validation error if username is too short", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "test",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userUsernameMin.message
      );
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userEmailInvalid.message
      );
    });

    it("should throw a validation error if passwords don't match", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userPasswordMismatch.message
      );
    });

    it("should throw a validation error if username is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userUsernameRequired.message
      );
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userEmailRequired.message
      );
    });

    it("should throw a validation error if password is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userPasswordRequired.message
      );
    });

    it("should throw a validation error if confirmed password is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userConfirmationRequired.message
      );
    });
  });

  // needs a valid user in db to finish properly
  describe("User login", () => {
    it("should throw a 400 error if user is already authenticated", async () => {
      const res = await request(app, token).post("/api/auth/login").send({
        userUsername: "test@test.com",
        userPassword: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        logicErrors.alreadyAuthenticated.message
      );
    });

    it("should throw a 404 error if user doesn't exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: "test@test.com",
        userPassword: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.notFound);
      expect(res.body.message).toEqual(logicErrors.userDoesNotExist.message);
    });

    it("should throw a validation error if username is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userPassword: "User1Password",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userUsernameRequired.message
      );
    });

    it("should throw a validation error if password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        userUsername: "test@test.com",
      });
      expect(res.statusCode).toEqual(statusCodes.badRequest);
      expect(res.body.message).toEqual(
        validationErrors.userPasswordRequired.message
      );
    });
  });

  describe("User logout", () => {
    it("should log the user out", async () => {
      const newToken = createAccessToken({ userData: fakeUser });
      const res = await request(app, newToken).post("/api/auth/logout").send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toEqual("");
      expect(res.body.user).toEqual("");
    });

    it("should throw a 500 error if user is not authenticated", async () => {
      const res = await request(app).post("/api/auth/logout").send();
      expect(res.statusCode).toEqual(statusCodes.forbidden);
      expect(res.body.message).toEqual(logicErrors.forbiddenAccess.message);
    });

    // needs a valid user in db to finish properly
    it("should return an empty access token", async () => {
      const newToken = createAccessToken({ userData: fakeUser });
      const cookie = newToken;
      const res = await request(app, newToken, cookie)
        .post("/api/auth/refresh_token")
        .send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toEqual("");
    });
  });

  // needs a valid user in db to finish properly
  describe("User verification", () => {
    /*   it("should verify user's token", async () => {
            const res = await request(app, newToken).post("/api/auth/logout").send();
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.accessToken).toEqual("");
      expect(res.body.user).toEqual("");
    }); */
  });
});
