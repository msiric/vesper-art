const mongoose = require('mongoose');
const License = require('../models/license');
const PDFDocument = require('pdfkit');
const { Base64Encode } = require('base64-stream');
const createError = require('http-errors');

const validateLicense = async (req, res, next) => {
  try {
    const { fingerprint, credentials } = req.body;
    const foundLicense = await License.findOne({
      fingerprint: fingerprint,
      credentials: credentials,
      active: true
    });
    if (foundLicense) {
      return res.status(200).json({ foundLicense: foundLicense });
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

    stream.on('data', function(chunk) {
      finalString += chunk;
    });

    stream.on('end', function() {
      res.json({ pdf: finalString });
    });
  } catch (err) {
    next(err, res);
  }
};

module.exports = {
  validateLicense,
  displayLicense
};
