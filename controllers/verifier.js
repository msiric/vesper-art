import createError from "http-errors";
import { fingerprintValidation } from "../common/validation";
import { fetchLicenseByFingerprint } from "../services/postgres/license";
import { formatError } from "../utils/helpers";
import { errors } from "../utils/statuses";

export const verifyLicense = async ({ licenseFingerprint, connection }) => {
  await fingerprintValidation.validate({ licenseFingerprint });
  const foundLicense = await fetchLicenseByFingerprint({
    licenseFingerprint,
    connection,
  });
  if (foundLicense) {
    return { license: foundLicense };
  }
  throw createError(...formatError(errors.licenseNotFound));
};

export const displayLicense = async (req, res, next) => {
  try {
    const doc = new PDFDocument();

    let finalString = "";
    const stream = doc.pipe(new Base64Encode());

    doc.end();

    stream.on("data", function (chunk) {
      finalString += chunk;
    });

    stream.on("end", function () {
      res.json({ pdf: finalString });
    });
  } catch (err) {
    next(err, res);
  }
};
