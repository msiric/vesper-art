import request from "supertest";
import app from "../../app";
import { closeConnection, connectToDatabase } from "../../utils/database";

jest.useFakeTimers();

let connection;

describe("User authentication", () => {
  beforeAll(async () => {
    connection = await connectToDatabase();
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      userUsername: "testuser",
      userEmail: "test@test.com",
      userPassword: "User1Password",
      userConfirm: "User1Password",
    });
    expect(res.statusCode).toEqual(200);
  });
});
