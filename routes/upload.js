const aws = require('aws-sdk');
const router = require('express').Router();
const User = require('../models/user');
const Artwork = require('../models/artwork');
const upload = require('../services/multer');
const profilePhotoUpload = upload.profilePhotoUpload;
const artworkCoverUpload = upload.artworkCoverUpload;
const artworkCoverEdit = upload.artworkCoverEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
const artworkCoverSingleUpload = artworkCoverUpload.single('image');
const artworkCoverSingleEdit = artworkCoverEdit.single('image');

router.post('/profile-image-upload', function(req, res) {
  profilePhotoSingleUpload(req, res, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image upload error', detail: err.message }]
      });
    }
    User.findOne({ _id: req.user._id }, function(err, user) {
      if (user) {
        const fileName = user.photo.split('/').slice(-1)[0];
        const folderName = 'profilePhotos/';
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        s3.deleteObject(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            user.photo = req.file.location;
            user.save(function(err) {
              if (err) return next(err);
              return res.json({ imageUrl: req.file.location });
            });
          }
        });
      }
    });
  });
});

router.post('/artwork-cover-upload', function(req, res) {
  artworkCoverSingleUpload(req, res, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image upload error', detail: err.message }]
      });
    }
    return res.json({ imageUrl: req.file.location });
  });
});

router.post('/artwork-cover-edit/:id', function(req, res) {
  const artworkId = req.params.id;
  artworkCoverSingleEdit(req, res, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: 'Image upload error', detail: err.message }]
      });
    }
    Artwork.findOne({ _id: artworkId }, function(err, artwork) {
      if (artwork && artwork.cover) {
        const fileName = artwork.cover.split('/').slice(-1)[0];
        const folderName = 'artworkCovers/';
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        s3.deleteObject(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            artwork.cover = req.file.location;
            artwork.save(function(err) {
              if (err) return next(err);
              return res.json({ imageUrl: req.file.location });
            });
          }
        });
      }
    });
  });
});

module.exports = router;
