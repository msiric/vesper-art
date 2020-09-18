import createError from 'http-errors';
import { fetchVersionDetails } from '../services/artwork.js';

export const getCheckout = async ({ userId, versionId }) => {
  const foundVersion = await fetchVersionDetails({ versionId });
  if (foundVersion && foundVersion.artwork.active) {
    return {
      version: foundVersion,
    };
  }
  throw createError(400, 'Artwork not found');
};

export const postDownload = async ({
  userId,
  versionId,
  licenseAssignee,
  licenseCompany,
  licenseType,
}) => {
  const foundVersion = await fetchVersionDetails({ versionId });
  if (foundVersion && foundVersion.artwork.active) {
    // $TODO Bolje sredit validaciju licence
    const licensePrice =
      licenseType === 'personal'
        ? foundVersion.personal
        : licenseType === 'commercial'
        ? foundVersion.commercial
        : -1;
    if (licensePrice !== -1) {
    }
    throw createError(400, 'License type is not valid');
  }
  throw createError(400, 'Artwork not found');
};
