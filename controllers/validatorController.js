const License = require('../models/license');
const PDFDocument = require('pdfkit');
const fs = require('fs');

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
      let pdf = new PDFDocument();

      pdf.text('Hello', 100, 100);
      pdf.end();
      pdf.pipe(res);
    } else {
      return res.status(400).json({ message: 'License not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getValidator,
  validateLicense
};
