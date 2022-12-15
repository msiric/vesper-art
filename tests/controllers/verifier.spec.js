import app from "../../app";
import { statusCodes } from "../../common/constants";
import { errors as validationErrors, ranges } from "../../common/validation";
import { getOrderDetails } from "../../controllers/order";
import { closeConnection, connectToDatabase } from "../../utils/database";
import { errors } from "../../utils/statuses";
import { entities, validUsers } from "../fixtures/entities";
import { unusedFingerprint } from "../utils/helpers";
import { request } from "../utils/request";

jest.useFakeTimers();
jest.setTimeout(3 * 60 * 1000);

let connection,
  buyerOrder,
  sellerOrder,
  firstLicenseByBuyer,
  firstLicenseBySeller;

describe("Verifier tests", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    connection = await connectToDatabase();
    [buyerOrder, sellerOrder] = await Promise.all([
      getOrderDetails({
        userId: validUsers.buyer.id,
        orderId: entities.Order.find(
          (item) => item.buyerId === validUsers.buyer.id
        ).id,
        connection,
      }),
      getOrderDetails({
        userId: validUsers.seller.id,
        orderId: entities.Order.find(
          (item) => item.sellerId === validUsers.seller.id
        ).id,
        connection,
      }),
    ]);
    firstLicenseByBuyer = buyerOrder.order.license;
    firstLicenseBySeller = sellerOrder.order.license;
  });

  afterAll(async () => {
    await closeConnection(connection);
  });

  describe("/api/verifier", () => {
    it("should return essential license data", async () => {
      const res = await request(app).post("/api/verifier").send({
        licenseFingerprint: firstLicenseByBuyer.fingerprint,
      });
      expect(res.body.license.fingerprint).toEqual(
        firstLicenseByBuyer.fingerprint
      );
      expect(res.body.license.assignee).toBeFalsy();
      expect(res.body.license.assignor).toBeFalsy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should return buyer license data", async () => {
      const res = await request(app).post("/api/verifier").send({
        licenseFingerprint: firstLicenseByBuyer.fingerprint,
        assigneeIdentifier: firstLicenseByBuyer.assigneeIdentifier,
      });
      expect(res.body.license.fingerprint).toEqual(
        firstLicenseByBuyer.fingerprint
      );
      expect(res.body.license.assignee).toEqual(validUsers.buyer.name);
      expect(res.body.license.assignor).toBeFalsy();
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should return seller license data", async () => {
      const res = await request(app).post("/api/verifier").send({
        licenseFingerprint: firstLicenseBySeller.fingerprint,
        assignorIdentifier: firstLicenseBySeller.assignorIdentifier,
      });
      expect(res.body.license.fingerprint).toEqual(
        firstLicenseBySeller.fingerprint
      );
      expect(res.body.license.assignee).toBeFalsy();
      expect(res.body.license.assignor).toEqual(validUsers.seller.name);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should return complete license data", async () => {
      const res = await request(app).post("/api/verifier").send({
        licenseFingerprint: firstLicenseByBuyer.fingerprint,
        assigneeIdentifier: firstLicenseByBuyer.assigneeIdentifier,
        assignorIdentifier: firstLicenseBySeller.assignorIdentifier,
      });
      expect(res.body.license.fingerprint).toEqual(
        firstLicenseByBuyer.fingerprint
      );
      expect(res.body.license.assignee).toEqual(validUsers.buyer.name);
      expect(res.body.license.assignor).toEqual(validUsers.seller.name);
      expect(res.statusCode).toEqual(statusCodes.ok);
    });

    it("should throw an error if license is not found", async () => {
      const res = await request(app).post("/api/verifier").send({
        licenseFingerprint: unusedFingerprint,
      });
      expect(res.body.message).toEqual(errors.licenseNotFound.message);
      expect(res.statusCode).toEqual(errors.licenseNotFound.status);
    });

    it("should throw a validation if fingerprint is missing", async () => {
      const res = await request(app).post("/api/verifier").send({});
      expect(res.body.message).toEqual(
        validationErrors.licenseFingerprintRequired.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseFingerprintRequired.status
      );
    });

    it("should throw a validation if fingerprint is too long", async () => {
      const res = await request(app)
        .post("/api/verifier")
        .send({
          licenseFingerprint: new Array(
            ranges.licenseFingerprint.exact + 2
          ).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.licenseFingerprintExact.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.licenseFingerprintExact.status
      );
    });

    it("should throw a validation if assignee identifier is too long", async () => {
      const res = await request(app)
        .post("/api/verifier")
        .send({
          assigneeIdentifier: new Array(
            ranges.assigneeIdentifier.exact + 2
          ).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.assigneeIdentifierExact.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.assigneeIdentifierExact.status
      );
    });

    it("should throw a validation if assignor identifier is too long", async () => {
      const res = await request(app)
        .post("/api/verifier")
        .send({
          assignorIdentifier: new Array(
            ranges.assignorIdentifier.exact + 2
          ).join("a"),
        });
      expect(res.body.message).toEqual(
        validationErrors.assignorIdentifierExact.message
      );
      expect(res.statusCode).toEqual(
        validationErrors.assignorIdentifierExact.status
      );
    });
  });
});
