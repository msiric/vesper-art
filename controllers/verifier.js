import mongoose from 'mongoose';
import createError from 'http-errors';
import { fetchLicenseByFingerprint } from '../services/license.js';
import verifierValidator from '../utils/validation/verifier.js';
import { sanitizeData } from '../utils/helpers.js';

const verifyLicense = async ({ fingerprint }) => {
  const { error } = verifierValidator(
    sanitizeData({ licenseFingerprint: fingerprint })
  );
  if (error) throw createError(400, error);
  const foundLicense = await fetchLicenseByFingerprint({ fingerprint });
  if (foundLicense) {
    return { license: foundLicense };
  }
  throw createError(400, 'License not found');
};

const displayLicense = async (req, res, next) => {
  try {
    const doc = new PDFDocument();

    let finalString = '';
    const stream = doc.pipe(new Base64Encode());

    doc.end();

    stream.on('data', function (chunk) {
      finalString += chunk;
    });

    stream.on('end', function () {
      res.json({ pdf: finalString });
    });
  } catch (err) {
    next(err, res);
  }
};

export default {
  verifyLicense,
  displayLicense,
};
