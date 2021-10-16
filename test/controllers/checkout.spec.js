import app from "../../app";
import { statusCodes } from "../../common/constants";
import { admin } from "../../config/secret";
import { fetchUserByUsername } from "../../services/postgres/user";
import { createAccessToken } from "../../utils/auth";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { formatTokenData } from "../../utils/helpers";
import { USER_SELECTION } from "../../utils/selectors";
import { responses } from "../../utils/statuses";
import { request } from "../utils/request";

jest.useFakeTimers();

let connection;
let user;
let token;

const versionId = "8512f291-4279-4539-acdc-f347f8894ea6";

describe.skip("Checkout tests", () => {
  beforeAll(async () => {
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
    token = createAccessToken({ userData: tokenPayload });
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
      expect(res.body.message).toEqual(responses.userSignedUp.message);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });
  });
});
