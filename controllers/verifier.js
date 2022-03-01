import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import { fingerprintValidation } from "../common/validation";
import { fetchLicenseByFingerprint } from "../services/license";
import { formatError } from "../utils/helpers";
import { errors } from "../utils/statuses";

export const verifyLicense = async ({
  licenseFingerprint,
  assigneeIdentifier,
  assignorIdentifier,
  connection,
}) => {
  await fingerprintValidation.validate({
    licenseFingerprint,
    assigneeIdentifier,
    assignorIdentifier,
  });
  const foundLicense = await fetchLicenseByFingerprint({
    licenseFingerprint,
    assigneeIdentifier,
    assignorIdentifier,
    connection,
  });
  if (!isObjectEmpty(foundLicense)) {
    return { license: foundLicense };
  }
  throw createError(...formatError(errors.licenseNotFound));
};
