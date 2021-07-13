import app from "../../app";
import { statusCodes } from "../../common/constants";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { responses } from "../../utils/statuses";
import { request } from "../utils/request";

jest.useFakeTimers();

let connection;
const versionId = "8512f291-4279-4539-acdc-f347f8894ea6";

describe("Checkout tests", () => {
  beforeAll(async () => {
    connection = await connectToDatabase();
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/download/:versionId", () => {
    // needs a valid user in db to finish properly
    it("", async () => {
      const res = await request(app).post(`/api/download/${versionId}`).send({
        licenseAssignee: "",
        licenseCompany: "",
        licenseType: "",
      });
      expect(res.statusCode).toEqual(statusCodes.ok);
      expect(res.body.message).toEqual(responses.userSignedUp.message);
    });
  });
});
