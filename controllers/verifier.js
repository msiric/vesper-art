import createError from "http-errors";
import { fingerprintValidation } from "../common/validation";
import { fetchLicenseByFingerprint } from "../services/postgres/license.js";
import { sanitizeData } from "../utils/helpers.js";

export const verifyLicense = async ({ licenseFingerprint }) => {
  await fingerprintValidation.validate(sanitizeData({ licenseFingerprint }));
  const foundLicense = await fetchLicenseByFingerprint({ licenseFingerprint });
  if (foundLicense) {
    return { license: foundLicense };
  }
  throw createError(400, "License not found");
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
