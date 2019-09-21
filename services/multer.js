const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const Jimp = require('jimp');
const sharp = require('sharp');

aws.config.update({
  secretAccessKey: 'TZhmTLVh6KSBJRfYK2aq2eqoiYbIEncgzUptgGON',
  accessKeyId: 'AKIAIVOLPF2TBRAQ4CEQ',
  region: 'eu-west-3'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid Mime Type, only JPEG, PNG and GIF files are allowed'),
      false
    );
  }
};

const profilePhotoUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 2 * 1024 * 1024 },
    acl: 'public-read',
    key: function(req, file, callback) {
      const fileName =
        req.user._id + Date.now().toString() + path.extname(file.originalname);
      const folderName = 'profilePhotos/';
      const filePath = folderName + fileName;
      callback(null, filePath);
    }
  })
});

const artworkMediaUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 5 * 1024 * 1024 },
    acl: 'public-read',
    shouldTransform: function(req, file, cb) {
      cb(null, true);
    },
    transforms: [
      {
        id: 'image',
        key: function(req, file, cb) {
          console.log('original');
          const fileName =
            req.user._id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkMedia/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          console.log('original1');

          cb(null, sharp().jpg());
        }
      },
      {
        id: 'cover',
        key: function(req, file, cb) {
          console.log('thumbnail');
          const fileName =
            req.user._id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkCovers/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          console.log('thumbnail1');

          cb(
            null,
            sharp()
              .resize(10, 10)
              .jpg()
          );
        }
      }
    ]
  })
});

const artworkCoverEdit = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 5 * 1024 * 1024 },
    acl: 'public-read',
    key: function(req, file, callback) {
      const fileName =
        req.user._id + Date.now().toString() + path.extname(file.originalname);
      const folderName = 'artworkCovers/';
      const filePath = folderName + fileName;
      callback(null, filePath);
    }
  })
});

/* const artworkMediaUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 20 * 1024 * 1024 },
    acl: 'public-read',
    key: function(req, file, callback) {
      const fileName =
        req.user._id + Date.now().toString() + path.extname(file.originalname);
      const folderName = 'artworkMedia/';
      const filePath = folderName + fileName;
      callback(null, filePath);
    }
  })
}); */

const artworkMediaEdit = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 20 * 1024 * 1024 },
    acl: 'public-read',
    key: function(req, file, callback) {
      const fileName =
        req.user._id + Date.now().toString() + path.extname(file.originalname);
      const folderName = 'artworkMedia/';
      const filePath = folderName + fileName;
      callback(null, filePath);
    }
  })
});

module.exports = {
  profilePhotoUpload: profilePhotoUpload,
  /*   artworkCoverUpload: artworkCoverUpload,
  artworkCoverEdit: artworkCoverEdit, */
  artworkMediaUpload: artworkMediaUpload
  /*   artworkMediaEdit: artworkMediaEdit */
};
