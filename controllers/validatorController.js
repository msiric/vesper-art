const License = require('../models/license');
const PDFDocument = require('pdfkit');
const { Base64Encode } = require('base64-stream');

const getValidator = async (req, res, next) => {
  try {
    res.render('main/validator');
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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
      return res.status(400).json({ message: 'License not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getValidator,
  validateLicense,
  displayLicense
};
