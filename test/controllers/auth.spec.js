import app from "../../app";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { request, token } from "../utils/request";

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
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(200);
    });

    it("should throw a 400 error if user is already authenticated", async () => {
      const res = await request(app, token).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(400);
    });

    it("should throw a validation error if username is too short", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "test",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(500);
    });

    it("should throw a validation error if email is invalid", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@",
        userPassword: "User1Password",
        userConfirm: "User1Password",
      });
      expect(res.statusCode).toEqual(500);
    });

    it("should throw a validation error if passwords don't match", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(500);
    });

    it("should throw a validation error if username is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userEmail: "test@test.com",
        userPassword: "User1Password",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(500);
    });

    it("should throw a validation error if email is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userPassword: "User1Password",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(500);
    });

    it("should throw a validation error if password is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(500);
    });

    it("should throw a validation error if confirmed password is missing", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        userUsername: "testuser",
        userEmail: "test@test.com",
        userConfirm: "User2Password",
      });
      expect(res.statusCode).toEqual(500);
    });
  });
});
