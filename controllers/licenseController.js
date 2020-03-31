const License = require('../models/license');

const getLicenseInformation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundLicenses = await License.find({
      $and: [{ artwork: id }, { owner: res.locals.user.id }, { active: false }]
    }).sort({ created: -1 });
    return res.status(200).json(foundLicenses);
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

module.exports = {
  getLicenseInformation
};
