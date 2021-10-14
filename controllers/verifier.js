import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import { fingerprintValidation } from "../common/validation";
import { fetchLicenseByFingerprint } from "../services/postgres/license";
import { formatError } from "../utils/helpers";
import { errors } from "../utils/statuses";

export const verifyLicense = async ({ licenseData, connection }) => {
  await fingerprintValidation.validate(licenseData);
  const foundLicense = await fetchLicenseByFingerprint({
    ...licenseData,
    connection,
  });
  if (!isObjectEmpty(foundLicense)) {
    console.log(foundLicense);
    return { license: foundLicense };
  }
  throw createError(...formatError(errors.licenseNotFound));
};
