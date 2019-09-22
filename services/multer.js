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

const watermark = new Buffer.from(
  `<svg width="1366" height="768">
      <style>
          @font-face {
              font-family: arial;
          }
      </style>
      <rect x="0" y="0" width="1366" height="768" fill="#000" fill-opacity="0.4"/>
      <rect x="0" y="0" width="1366" height="96" fill="#000" fill-opacity="0.8"/>
      <text class="title" style="font-size: 24; font-family:Aller_Light" x="5" y="22" fill="#FFF">
          artcore
      </text>
  </svg>`
);

const profilePhotoUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 2 * 1024 * 1024 },
    acl: 'public-read',
    key: function(req, file, cb) {
      const fileName =
        req.user._id + Date.now().toString() + path.extname(file.originalname);
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
            req.user._id +
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
            req.user._id +
            Date.now().toString() +
            path.extname(file.originalname);
          const folderName = 'artworkCovers/';
          const filePath = folderName + fileName;
          cb(null, filePath);
        },
        transform: function(req, file, cb) {
          cb(
            null,
            sharp()
              .resize(null, 100)
              .composite([{ input: watermark }])
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
