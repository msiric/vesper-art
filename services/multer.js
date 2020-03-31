const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const path = require('path');
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

/* const watermark = new Buffer.from(
  `<svg width="100%" height="200%">
      <text style="font-size: 35; font-family: arial; font-weight: bold;" fill="black" fill-opacity="0.5" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
          artcore
      </text>
  </svg>`
); */

const profilePhotoUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 2 * 1024 * 1024 },
    acl: 'public-read',
    key: function(req, file, cb) {
      const fileName =
        res.locals.user.id +
        Date.now().toString() +
        path.extname(file.originalname);
      const folderName = 'profilePhotos/';
      const filePath = folderName + fileName;
      cb(null, filePath);
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
          const fileName =
            res.locals.user.id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkMedia/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          cb(null, sharp());
        }
      },
      {
        id: 'cover',
        key: function(req, file, cb) {
          const fileName =
            res.locals.user.id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkCovers/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          cb(null, sharp().resize(300, null));
        }
      }
    ]
  })
});

const artworkMediaEdit = multer({
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
          const fileName =
            res.locals.user.id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkMedia/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          cb(null, sharp());
        }
      },
      {
        id: 'cover',
        key: function(req, file, cb) {
          const fileName =
            res.locals.user.id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkCovers/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          cb(null, sharp().resize(300, null));
        }
      }
    ]
  })
});

module.exports = {
  profilePhotoUpload: profilePhotoUpload,
  artworkMediaUpload: artworkMediaUpload,
  artworkMediaEdit: artworkMediaEdit
};
