const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: 'TZhmTLVh6KSBJRfYK2aq2eqoiYbIEncgzUptgGON',
  accessKeyId: 'AKIAIVOLPF2TBRAQ4CEQ',
  region: 'eu-west-3'
});

const s3 = new aws.S3();

const fileFilter = (req, file, callback) => {
  console.log(file);
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
    acl: 'public-read',
    metadata: function(req, file, callback) {
      callback(null, { fieldName: 'TESTING_META_DATA!' });
    },
    key: function(req, file, callback) {
      const fileName = req.user._id + Date.now().toString();
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
    acl: 'public-read',
    metadata: function(req, file, callback) {
      callback(null, { fieldName: 'TESTING_META_DATA!' });
    },
    key: function(req, file, callback) {
      const fileName = req.user._id + Date.now().toString();
      const folderName = 'artworkCovers/';
      const filePath = folderName + fileName;
      callback(null, filePath);
    }
  })
});

const artworkCoverEdit = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'vesper-testing',
    acl: 'public-read',
    metadata: function(req, file, callback) {
      callback(null, { fieldName: 'TESTING_META_DATA!' });
    },
    key: function(req, file, callback) {
      const fileName = req.user._id + Date.now().toString();
      const folderName = 'artworkCovers/';
      const filePath = folderName + fileName;
      callback(null, filePath);
    }
  })
});

module.exports = {
  profilePhotoUpload: profilePhotoUpload,
  artworkCoverUpload: artworkCoverUpload,
  artworkCoverEdit: artworkCoverEdit
};
