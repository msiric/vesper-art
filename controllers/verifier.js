import mongoose from 'mongoose';
import createError from 'http-errors';
import { fetchLicenseByFingerprint } from '../services/license.js';

const verifyLicense = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    const foundLicense = await fetchLicenseByFingerprint({ fingerprint });
    if (foundLicense) {
      return res.json({ license: foundLicense });
    } else {
      throw createError(400, 'License not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
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
