const aws = require('aws-sdk');
const User = require('../models/user');
const Artwork = require('../models/artwork');

const getUserArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.find({ owner: req.user._id });
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
    newArtwork.title = req.body.artwork_title;
    newArtwork.category = req.body.artwork_category;
    newArtwork.about = req.body.artwork_about;
    newArtwork.price = req.body.artwork_price;
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
    const foundArtwork = await Artwork.findOne({ _id: req.params.id }).populate(
      'owner'
    );
    if (foundArtwork) {
      let inCart = false;
      let userId = null;
      if (req.user) {
        userId = req.user._id;
        if (req.user.cart.indexOf(artworkId) > -1) {
          inCart = true;
        }
      }
      return res.render('main/artwork-details', {
        id: userId,
        artwork: foundArtwork,
        inCart: inCart
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
    const foundArtwork = await Artwork.findOne({ _id: req.params.id });
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
    const foundArtwork = await Artwork.findOne({ _id: req.params.id });
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

// does not delete cover and media
const deleteArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { owner: req.user._id }]
    });
    if (foundArtwork) {
      const folderName = 'artworkCovers/';
      const fileName = foundArtwork.cover.split('/').slice(-1)[0];
      const filePath = folderName + fileName;
      const s3 = new aws.S3();
      const params = {
        Bucket: 'vesper-testing',
        Key: filePath
      };
      const deletedCover = await s3.deleteObject(params);
      if (deletedCover) {
        const folderName = 'artworkMedia/';
        const fileName = foundArtwork.media.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        const deletedMedia = await s3.deleteObject(params);
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
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
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
  deleteArtwork
};
