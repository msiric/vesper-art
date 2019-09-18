const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const Jimp = require('jimp');

aws.config.update({
  secretAccessKey: 'TZhmTLVh6KSBJRfYK2aq2eqoiYbIEncgzUptgGON',
  accessKeyId: 'AKIAIVOLPF2TBRAQ4CEQ',
  region: 'eu-west-3'
});

const s3 = new aws.S3();

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(
      new Error('Invalid Mime Type, only JPEG and PNG files allowed'),
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

const artworkCoverUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    limits: { fileSize: 5 * 1024 * 1024 },
    acl: 'public-read',
    shouldTransform: function(req, file, callback) {
      callback(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: 'original',
        key: function(req, file, callback) {
          const fileName =
            req.user._id +
            Date.now().toString() +
            path.extname(file.originalname);

          const folderName = 'artworkCovers/';
          const filePath = folderName + fileName;
          callback(null, filePath);
        },
        transform: async function(req, file, callback) {
          const readFile = await Jimp.read(file);
          const width = 10;
          const height = Jimp.AUTO;

          const resizedFile = readFile.resize(width, height);

          file = await resizedFile.getBufferAsync(Jimp.MIME_PNG);
          callback(null, file);
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

const artworkMediaUpload = multer({
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
  artworkCoverUpload: artworkCoverUpload,
  artworkCoverEdit: artworkCoverEdit,
  artworkMediaUpload: artworkMediaUpload,
  artworkMediaEdit: artworkMediaEdit
};
