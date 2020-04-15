const mongoose = require('mongoose');
const Artwork = require('../models/artwork');
const License = require('../models/license');
const User = require('../models/user');
const crypto = require('crypto');
const createError = require('http-errors');

const getLicense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundLicenses = await License.find({
      $and: [{ artwork: id }, { owner: res.locals.user.id }, { active: false }],
    }).sort({ created: -1 });
    return res.status(200).json(foundLicenses);
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

// needs transaction (done)
const addLicense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { licenseType, licenseCredentials, artworkId } = req.body;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }],
    })
      .populate(
        'current',
        '_id cover created title price type license availability description use commercial'
      )
      .session(session);
    if (foundArtwork) {
      if (licenseType == 'personal' || licenseType == 'commercial') {
        if (
          !(
            licenseType == 'commercial' &&
            foundArtwork.current.type == 'personal'
          )
        ) {
          const newLicense = new License();
          newLicense.owner = res.locals.user.id;
          newLicense.artwork = foundArtwork._id;
          newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
          newLicense.type = licenseType;
          newLicense.credentials = licenseCredentials;
          newLicense.active = false;
          newLicense.price =
            licenseType == 'commercial' ? foundArtwork.current.commercial : 0;
          await newLicense.save({ session });
          await User.updateOne(
            {
              _id: res.locals.user.id,
              cart: { $elemMatch: { artwork: foundArtwork._id } },
            },
            {
              $push: { 'cart.$.licenses': savedLicense._id },
            }
          ).session(session);
          await session.commitTransaction();
          res.status(200).json({ message: 'Artwork quantity increased' });
        } else {
          throw createError(400, 'Invalid license type');
        }
      } else {
        throw createError(400, 'Invalid license type');
      }
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const deleteLicense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId, licenseId } = req.body;
    const foundLicense = await License.find({
      $and: [
        { artwork: artworkId },
        { owner: res.locals.user.id },
        { active: false },
      ],
    }).session(session);
    if (foundLicense) {
      if (foundLicense.length > 1) {
        const targetLicense = foundLicense.find((license) =>
          license._id.equals(licenseId)
        );
        if (targetLicense) {
          await User.updateOne(
            {
              _id: res.locals.user.id,
              cart: { $elemMatch: { artwork: targetLicense.artwork } },
            },
            {
              $pull: {
                'cart.$.licenses': targetLicense._id,
              },
            }
          ).session(session);
          await License.remove({
            $and: [
              { _id: targetLicense._id },
              { owner: res.locals.user.id },
              { active: false },
            ],
          }).session(session);
          await session.commitTransaction();
          res.status(200).json({ message: 'License deleted' });
        } else {
          throw createError(400, 'License not found');
        }
      } else {
        throw createError(
          400,
          'At least one license needs to be associated with an artwork in cart'
        );
      }
    } else {
      throw createError(400, 'License not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  getLicense,
  addLicense,
  deleteLicense,
};
