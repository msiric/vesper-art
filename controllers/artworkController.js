const aws = require('aws-sdk');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Review = require('../models/review');

const getUserArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.find({
      $and: [{ owner: req.user._id }, { active: true }]
    });
    return res.render('main/my-artwork', { artwork: artwork });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getNewArtwork = async (req, res, next) => {
  try {
    return res.render('main/add-new-artwork');
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postNewArtwork = async (req, res, next) => {
  try {
    const newArtwork = new Artwork();
    newArtwork.owner = req.user._id;
    newArtwork.cover = req.body.artwork_cover;
    newArtwork.media = req.body.artwork_media;
    newArtwork.deleted = false;
    newArtwork.title = req.body.artwork_title;
    newArtwork.category = req.body.artwork_category;
    newArtwork.about = req.body.artwork_about;
    newArtwork.price = req.body.artwork_price;
    newArtwork.active = true;
    const savedArtwork = await newArtwork.save();

    const updatedUser = await User.update(
      {
        _id: req.user._id
      },
      {
        $push: { artworks: savedArtwork._id }
      }
    );
    if (!updatedUser) {
      return res.status(400).json({ message: 'Could not update user' });
    } else {
      return res.status(200).json('/my-artwork');
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getArtworkDetails = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const savedArtwork = req.user.savedArtwork.includes(artworkId)
      ? true
      : false;
    let rating;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }]
    }).populate('owner');
    if (foundArtwork) {
      let inCart = false;
      let userId = null;
      if (req.user) {
        userId = req.user._id;
        if (req.user.cart.indexOf(artworkId) > -1) {
          inCart = true;
        }
      }
      const foundReview = await Review.find({ artwork: artworkId });
      if (foundReview) {
        let ratings = 0;
        let reviews = 0;
        foundReview.map(function(review) {
          ratings += review.rating;
          reviews++;
        });
        rating = (parseInt(ratings) / parseInt(reviews))
          .toFixed(2)
          .replace(/[.,]00$/, '');
      }
      return res.render('main/artwork-details', {
        id: userId,
        artwork: foundArtwork,
        review: foundReview,
        rating: rating,
        inCart: inCart,
        savedArtwork
      });
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const editArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }]
    });
    if (foundArtwork) {
      return res.render('main/edit-artwork', { artwork: foundArtwork });
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }]
    });
    if (foundArtwork) {
      if (req.body.artwork_cover) foundArtwork.cover = req.body.artwork_cover;
      if (req.body.artwork_media) foundArtwork.media = req.body.artwork_media;
      if (req.body.artwork_title) foundArtwork.title = req.body.artwork_title;
      if (req.body.artwork_category)
        foundArtwork.category = req.body.artwork_category;
      if (req.body.artwork_about) foundArtwork.about = req.body.artwork_about;
      if (req.body.artwork_price) foundArtwork.price = req.body.artwork_price;
      const savedArtwork = await foundArtwork.save();
      if (savedArtwork) {
        return res.status(200).json('/my-artwork');
      } else {
        return res
          .status(400)
          .json({ message: 'Artwork could not be updated' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// needs testing
const deleteArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { owner: req.user._id }, { active: true }]
    });
    if (foundArtwork) {
      const foundOrders = await Order.find({ artwork: req.params.id });
      if (!foundOrders) {
        const folderName = 'artworkCovers/';
        const fileName = foundArtwork.cover.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        const deletedCover = await s3.deleteObject(params).promise();
        if (deletedCover) {
          const folderName = 'artworkMedia/';
          const fileName = foundArtwork.media.split('/').slice(-1)[0];
          const filePath = folderName + fileName;
          const s3 = new aws.S3();
          const params = {
            Bucket: 'vesper-testing',
            Key: filePath
          };
          const deletedMedia = await s3.deleteObject(params).promise();
          if (deletedMedia) {
            const deletedArtwork = await Artwork.deleteOne({
              _id: req.params.id
            });
            if (deletedArtwork) {
              const updatedUser = await User.update(
                {
                  _id: req.user._id
                },
                {
                  $pull: { artworks: req.params.id }
                }
              );
              if (updatedUser) {
                return res.status(200).json('/my-artwork');
              } else {
                return res
                  .status(400)
                  .json({ message: 'User could not be updated' });
              }
            } else {
              return res
                .status(400)
                .json({ message: 'Artwork could not be deleted' });
            }
          } else {
            return res
              .status(400)
              .json({ message: 'Artwork media could not be deleted' });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Artwork cover could not be deleted' });
        }
      } else {
        const updatedArtwork = await Artwork.updateOne(
          {
            _id: req.params.id
          },
          { deleted: true }
        );
        if (updatedArtwork) {
          return res.status(200).json('/my-artwork');
        } else {
          return res
            .status(400)
            .json({ message: 'Artwork could not be deleted' });
        }
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const saveArtwork = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const foundArtwork = await Artwork.findOne({ _id: artworkId });
    if (foundArtwork) {
      const foundUser = await User.findOne({ _id: req.user._id });
      if (foundUser) {
        let updatedUser;
        let saved;
        if (foundUser.savedArtwork.includes(foundArtwork._id)) {
          updatedUser = await User.updateOne(
            { _id: foundUser._id },
            { $pull: { savedArtwork: artworkId } }
          );
          saved = false;
        } else {
          updatedUser = await User.updateOne(
            { _id: foundUser._id },
            { $push: { savedArtwork: artworkId } }
          );
          saved = true;
        }
        if (updatedUser) {
          res.status(200).json({ saved });
        } else {
          return res.status(400).json({ message: 'Could not update user' });
        }
      } else {
        return res.status(400).json({ message: 'User not found' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  getUserArtwork,
  getNewArtwork,
  postNewArtwork,
  getArtworkDetails,
  editArtwork,
  updateArtwork,
  deleteArtwork,
  saveArtwork
};
