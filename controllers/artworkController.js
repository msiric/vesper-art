const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const aws = require('aws-sdk');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const Version = require('../models/version');
const Order = require('../models/order');
const Review = require('../models/review');

const getUserArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ owner: req.user._id }, { active: true }]
    }).populate('current');
    if (foundArtwork) {
      return res.render('main/my-artwork', { artwork: foundArtwork });
    } else {
      return res.status(500).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
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

// needs transaction (done)
const postNewArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newVersion = new Version();
    newVersion.cover = req.body.artwork_cover;
    newVersion.media = req.body.artwork_media;
    newVersion.title = req.body.artwork_title;
    newVersion.type = req.body.artwork_type;
    newVersion.category = req.body.artwork_category;
    newVersion.price = 0;
    newVersion.use = 'personal';
    newVersion.license = 0;
    newVersion.available = true;
    newVersion.about = req.body.artwork_about;
    if (req.body.artwork_type && req.body.artwork_type == 'commercial') {
      newVersion.price = req.body.artwork_price;
      if (
        req.body.artwork_license &&
        req.body.artwork_license == 'commercial'
      ) {
        newVersion.use = 'commercial';
        newVersion.license = req.body.artwork_commercial;
      }
    } else {
      newVersion.available =
        req.body.artwork_available == 'available' ? true : false;
    }
    const savedVersion = await newVersion.save({ session });
    if (savedVersion) {
      const newArtwork = new Artwork();
      newArtwork.owner = req.user._id;
      newArtwork.active = true;
      newArtwork.current = savedVersion._id;
      const savedArtwork = await newArtwork.save({ session });
      if (savedArtwork) {
        await session.commitTransaction();
        return res.status(200).json('/my_artwork');
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Could not save artwork' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Could not save version' });
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

const getArtworkDetails = async (req, res, next) => {
  try {
    const savedArtwork =
      req.user && req.user.savedArtwork.includes(req.params.id) ? true : false;
    const inCart =
      req.user &&
      req.user.cart.length > 0 &&
      req.user.cart.some(item => item.artwork._id.equals(req.params.id))
        ? true
        : false;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }]
    })
      .populate('owner')
      .populate('current');
    if (foundArtwork) {
      const foundReview = await Review.find({
        artwork: req.params.id
      }).populate('owner');
      let averageRating = 0;
      foundReview.forEach(function(review) {
        averageRating = (review.rating + averageRating) / foundReview.length;
      });
      const reviewWithAverage = foundReview;
      reviewWithAverage.rating = averageRating ? averageRating : null;
      return res.render('main/artwork-details', {
        artwork: foundArtwork,
        review: reviewWithAverage,
        inCart,
        savedArtwork
      });
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const editArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { owner: req.user._id }, { active: true }]
    }).populate('current');
    if (foundArtwork) {
      return res.render('main/edit-artwork', { artwork: foundArtwork.current });
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// needs transaction (done)
// does it work in all cases?
// needs testing
const updateArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { owner: req.user._id }, { active: true }]
    })
      .populate('current')
      .populate('versions')
      .session(session);
    if (foundArtwork) {
      const newVersion = new Version();
      newVersion.cover = req.body.artwork_cover
        ? req.body.artwork_cover
        : foundArtwork.current.cover;
      newVersion.media = req.body.artwork_media
        ? req.body.artwork_media
        : foundArtwork.current.media;
      newVersion.title = req.body.artwork_title
        ? req.body.artwork_title
        : foundArtwork.current.title;
      newVersion.type = req.body.artwork_type
        ? req.body.artwork_type
        : foundArtwork.current.type;
      newVersion.category = req.body.artwork_category
        ? req.body.artwork_category
        : foundArtwork.current.category;
      newVersion.about = req.body.artwork_about
        ? req.body.artwork_about
        : foundArtwork.current.about;
      newVersion.category = req.body.artwork_category
        ? req.body.artwork_category
        : foundArtwork.current.category;
      if (req.body.artwork_type && req.body.artwork_type == 'commercial') {
        newVersion.price = req.body.artwork_price;
        newVersion.available = true;
        if (
          req.body.artwork_license &&
          req.body.artwork_license == 'commercial'
        ) {
          newVersion.use = 'commercial';
          newVersion.license = req.body.artwork_commercial;
        } else {
          newVersion.use = 'personal';
          newVersion.license = 0;
        }
      } else {
        newVersion.use = 'personal';
        newVersion.price = 0;
        newVersion.license = 0;
        newVersion.available =
          req.body.artwork_available == 'available' ? true : false;
      }
      const savedVersion = await newVersion.save({ session });
      if (savedVersion) {
        const foundOrder = await Order.find({
          details: { $elemMatch: { artwork: foundArtwork._id } },
          details: { $elemMatch: { version: foundArtwork.current._id } }
        })
          .deepPopulate('details.artwork details.version')
          .session(session);
        if (!(foundOrder && foundOrder.length)) {
          if (!foundArtwork.versions.length) {
            if (foundArtwork.current.media != savedVersion.media) {
              const coverLink = foundArtwork.current.cover;
              const coverFolderName = 'artworkCovers/';
              const coverFileName = coverLink.split('/').slice(-1)[0];
              const coverFilePath = coverFolderName + coverFileName;
              const coverS3 = new aws.S3();
              const coverParams = {
                Bucket: 'vesper-testing',
                Key: coverFilePath
              };

              await coverS3.deleteObject(coverParams).promise();

              const mediaLink = foundArtwork.current.media;
              const mediaFolderName = 'artworkMedia/';
              const mediaFileName = mediaLink.split('/').slice(-1)[0];
              const mediaFilePath = mediaFolderName + mediaFileName;
              const mediaS3 = new aws.S3();
              const mediaParams = {
                Bucket: 'vesper-testing',
                Key: mediaFilePath
              };

              await mediaS3.deleteObject(mediaParams).promise();

              const deletedVersion = await Version.remove({
                _id: foundArtwork.current._id
              }).session(session);

              if (deletedVersion) {
                foundArtwork.current = savedVersion._id;
              } else {
                await session.abortTransaction();
                return res
                  .status(400)
                  .json({ message: 'Version could not be deleted' });
              }
            } else {
              const deletedVersion = await Version.remove({
                _id: foundArtwork.current._id
              }).session(session);

              if (deletedVersion) {
                foundArtwork.current = savedVersion._id;
              } else {
                await session.abortTransaction();
                return res
                  .status(400)
                  .json({ message: 'Version could not be deleted' });
              }
            }
          } else {
            let usedContent = false;
            foundArtwork.versions.map(function(version) {
              if (
                version.media == foundArtwork.current.media &&
                version.cover == foundArtwork.current.cover
              ) {
                usedContent = true;
              }
            });
            if (usedContent) {
              const deletedVersion = await Version.remove({
                _id: foundArtwork.current._id
              }).session(session);

              if (deletedVersion) {
                foundArtwork.current = savedVersion._id;
              } else {
                await session.abortTransaction();
                return res
                  .status(400)
                  .json({ message: 'Version could not be deleted' });
              }
            } else {
              if (foundArtwork.current.media != savedVersion.media) {
                const coverLink = foundArtwork.current.cover;
                const coverFolderName = 'artworkCovers/';
                const coverFileName = coverLink.split('/').slice(-1)[0];
                const coverFilePath = coverFolderName + coverFileName;
                const coverS3 = new aws.S3();
                const coverParams = {
                  Bucket: 'vesper-testing',
                  Key: coverFilePath
                };

                await coverS3.deleteObject(coverParams).promise();

                const mediaLink = foundArtwork.current.media;
                const mediaFolderName = 'artworkMedia/';
                const mediaFileName = mediaLink.split('/').slice(-1)[0];
                const mediaFilePath = mediaFolderName + mediaFileName;
                const mediaS3 = new aws.S3();
                const mediaParams = {
                  Bucket: 'vesper-testing',
                  Key: mediaFilePath
                };

                await mediaS3.deleteObject(mediaParams).promise();

                const deletedVersion = await Version.remove({
                  _id: foundArtwork.current._id
                }).session(session);

                if (deletedVersion) {
                  foundArtwork.current = savedVersion._id;
                } else {
                  await session.abortTransaction();
                  return res
                    .status(400)
                    .json({ message: 'Version could not be deleted' });
                }
              } else {
                const deletedVersion = await Version.remove({
                  _id: foundArtwork.current._id
                }).session(session);

                if (deletedVersion) {
                  foundArtwork.current = savedVersion._id;
                } else {
                  await session.abortTransaction();
                  return res
                    .status(400)
                    .json({ message: 'Version could not be deleted' });
                }
              }
            }
          }
        } else {
          foundArtwork.versions.push(foundArtwork.current._id);
          foundArtwork.current = savedVersion._id;
        }

        const updatedArtwork = await foundArtwork.save({ session });
        if (updatedArtwork) {
          await session.commitTransaction();
          return res.status(200).json('/my_artwork');
        } else {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: 'Artwork could not be updated' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Version could not be saved' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// needs testing
/* const deleteArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { owner: req.user._id }, { active: true }]
    })
      .populate('current')
      .populate('versions');
    if (foundArtwork) {
      const foundOrder = await Order.find({
        details: { $elemMatch: { artwork: foundArtwork._id } },
        $or: [
          {
            details: { $elemMatch: { version: { $in: foundArtwork.versions } } }
          },
          {
            details: { $elemMatch: { version: foundArtwork.current._id } }
          }
        ]
      }).deepPopulate('details.artwork details.version');
      if (foundOrder.length) {
        const usedVersions = [];
        const allVersions = [];
        foundArtwork.versions.map(function(item) {
          allVersions.push(item);
        });
        allVersions.push(foundArtwork.current);

        foundOrder.map(function(order) {
          order.details.map(function(item) {
            usedVersions.push(item.version);
          });
        });

        const unusedVersions = [];

        for (let item of allVersions) {
          if (!usedVersions.find(value => value._id.equals(item._id))) {
            unusedVersions.push(item);
          }
        }

        if (unusedVersions.length) {
          const usedCovers = [];
          const usedMedia = [];
          let unusedCovers;
          let unusedMedia;
          unusedVersions.forEach(async function(version) {
            let coverLink = version.cover;
            let mediaLink = version.media;

            foundOrder.map(function(order) {
              if (order.details.some(item => item.version.cover == coverLink)) {
                if (!usedCovers.includes(coverLink)) {
                  usedCovers.push(coverLink);
                }
              }

              if (order.details.some(item => item.version.media == mediaLink)) {
                if (!usedMedia.includes(mediaLink)) {
                  usedMedia.push(mediaLink);
                }
              }
            });

            const deletedVersion = await Version.remove({
              _id: version._id
            });

            if (!deletedVersion) {
              return res
                .status(400)
                .json({ message: 'Version could not be deleted' });
            }
          });

          if (usedMedia.length || usedCovers.length) {
            unusedMedia = unusedVersions.filter(
              x => !usedMedia.includes(x.media)
            );

            unusedCovers = unusedVersions.filter(
              x => !usedCovers.includes(x.cover)
            );

            unusedMedia.forEach(async function(item) {
              const mediaFolderName = 'artworkMedia/';
              const mediaFileName = item.media.split('/').slice(-1)[0];
              const mediaFilePath = mediaFolderName + mediaFileName;
              const mediaS3 = new aws.S3();
              const mediaParams = {
                Bucket: 'vesper-testing',
                Key: mediaFilePath
              };

              await mediaS3.deleteObject(mediaParams).promise();
            });

            unusedCovers.forEach(async function(item) {
              const coverFolderName = 'artworkCovers/';
              const coverFileName = item.cover.split('/').slice(-1)[0];
              const coverFilePath = coverFolderName + coverFileName;
              const coverS3 = new aws.S3();
              const coverParams = {
                Bucket: 'vesper-testing',
                Key: coverFilePath
              };

              await coverS3.deleteObject(coverParams).promise();
            });
          }
        }

        if (
          unusedVersions.find(value =>
            value._id.equals(foundArtwork.current._id)
          )
        ) {
          await Artwork.updateOne(
            {
              _id: req.params.id
            },
            {
              $pull: {
                versions: { $in: unusedVersions.map(version => version._id) }
              },
              active: false,
              current: null
            }
          );
        } else {
          await Artwork.updateOne(
            {
              _id: req.params.id
            },
            {
              $pull: {
                versions: { $in: unusedVersions.map(version => version._id) }
              },
              active: false
            }
          );
        }

        return res.status(200).json('/my_artwork');
      } else {
        const allVersions = [];
        foundArtwork.versions.map(function(item) {
          allVersions.push(item);
        });
        allVersions.push(foundArtwork.current);

        allVersions.forEach(async function(version) {
          const coverFolderName = 'artworkCovers/';
          const coverFileName = version.cover.split('/').slice(-1)[0];
          const coverFilePath = coverFolderName + coverFileName;
          const coverS3 = new aws.S3();
          const coverParams = {
            Bucket: 'vesper-testing',
            Key: coverFilePath
          };

          await coverS3.deleteObject(coverParams).promise();

          const mediaFolderName = 'artworkMedia/';
          const mediaFileName = version.media.split('/').slice(-1)[0];
          const mediaFilePath = mediaFolderName + mediaFileName;
          const mediaS3 = new aws.S3();
          const mediaParams = {
            Bucket: 'vesper-testing',
            Key: mediaFilePath
          };

          await mediaS3.deleteObject(mediaParams).promise();
        });

        const deletedVersion = await Version.remove({
          _id: { $in: allVersions }
        });
        if (deletedVersion) {
          const deletedArtwork = await Artwork.remove({
            _id: req.params.id
          });

          if (deletedArtwork) {
            return res.status(200).json('/my_artwork');
          } else {
            return res
              .status(400)
              .json({ message: 'Artwork could not be deleted' });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Version could not be deleted' });
        }
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; */

// needs transaction (done)
const deleteArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { owner: req.user._id }, { active: true }]
    })
      .populate('current')
      .populate('versions')
      .session(session);
    if (foundArtwork) {
      const foundOrder = await Order.find({
        details: { $elemMatch: { artwork: foundArtwork._id } },
        details: { $elemMatch: { version: foundArtwork.current._id } }
      })
        .deepPopulate('details.artwork details.version')
        .session(session);
      console.log('order', foundOrder);
      if (foundOrder.length) {
        const updatedArtwork = await Artwork.updateOne(
          {
            _id: req.params.id
          },
          {
            active: false
          }
        ).session(session);
        if (updatedArtwork) {
          await session.commitTransaction();
          return res.status(200).json('/my_artwork');
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Could not delete version' });
        }
      } else {
        console.log('length', foundArtwork.versions.length);
        if (foundArtwork.versions.length) {
          let usedContent = false;
          foundArtwork.versions.map(function(version) {
            if (
              version.media == foundArtwork.current.media &&
              version.cover == foundArtwork.current.cover
            ) {
              usedContent = true;
            }
          });
          console.log('used content', usedContent);
          if (usedContent) {
            const deletedVersion = await Version.remove({
              _id: foundArtwork.current._id
            }).session(session);
            if (deletedVersion) {
              const updatedArtwork = await Artwork.updateOne(
                {
                  _id: req.params.id
                },
                {
                  current: null,
                  active: false
                }
              ).session(session);
              if (updatedArtwork) {
                await session.commitTransaction();
                return res.status(200).json('/my_artwork');
              } else {
                await session.abortTransaction();
                return res
                  .status(400)
                  .json({ message: 'Could not update artwork' });
              }
            } else {
              await session.abortTransaction();
              return res
                .status(400)
                .json({ message: 'Could not delete version' });
            }
          } else {
            const coverFolderName = 'artworkCovers/';
            const coverFileName = foundArtwork.current.cover
              .split('/')
              .slice(-1)[0];
            const coverFilePath = coverFolderName + coverFileName;
            const coverS3 = new aws.S3();
            const coverParams = {
              Bucket: 'vesper-testing',
              Key: coverFilePath
            };

            await coverS3.deleteObject(coverParams).promise();

            const mediaFolderName = 'artworkMedia/';
            const mediaFileName = foundArtwork.current.media
              .split('/')
              .slice(-1)[0];
            const mediaFilePath = mediaFolderName + mediaFileName;
            const mediaS3 = new aws.S3();
            const mediaParams = {
              Bucket: 'vesper-testing',
              Key: mediaFilePath
            };

            await mediaS3.deleteObject(mediaParams).promise();

            const deletedVersion = await Version.remove({
              _id: foundArtwork.current._id
            }).session(session);
            if (deletedVersion) {
              const updatedArtwork = await Artwork.updateOne(
                {
                  _id: req.params.id
                },
                {
                  current: null,
                  active: false
                }
              ).session(session);
              if (updatedArtwork) {
                await session.commitTransaction();
                return res.status(200).json('/my_artwork');
              } else {
                await session.abortTransaction();
                return res
                  .status(400)
                  .json({ message: 'Could not update artwork' });
              }
            } else {
              await session.abortTransaction();
              return res
                .status(400)
                .json({ message: 'Could not delete version' });
            }
          }
        } else {
          const coverFolderName = 'artworkCovers/';
          const coverFileName = foundArtwork.current.cover
            .split('/')
            .slice(-1)[0];
          const coverFilePath = coverFolderName + coverFileName;
          const coverS3 = new aws.S3();
          const coverParams = {
            Bucket: 'vesper-testing',
            Key: coverFilePath
          };

          await coverS3.deleteObject(coverParams).promise();

          const mediaFolderName = 'artworkMedia/';
          const mediaFileName = foundArtwork.current.media
            .split('/')
            .slice(-1)[0];
          const mediaFilePath = mediaFolderName + mediaFileName;
          const mediaS3 = new aws.S3();
          const mediaParams = {
            Bucket: 'vesper-testing',
            Key: mediaFilePath
          };

          await mediaS3.deleteObject(mediaParams).promise();

          const deletedVersion = await Version.remove({
            _id: foundArtwork.current._id
          }).session(session);
          if (deletedVersion) {
            const deletedArtwork = await Artwork.remove({
              _id: req.params.id
            }).session(session);
            if (deletedArtwork) {
              await session.commitTransaction();
              return res.status(200).json('/my_artwork');
            } else {
              await session.abortTransaction();
              return res
                .status(400)
                .json({ message: 'Could not delete artwork' });
            }
          } else {
            await session.abortTransaction();
            return res
              .status(400)
              .json({ message: 'Could not delete version' });
          }
        }
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const saveArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }]
    })
      .populate('current')
      .session(session);
    if (foundArtwork) {
      const foundUser = await User.findOne({ _id: req.user._id }).session(
        session
      );
      if (foundUser) {
        let updatedUser;
        let saved;
        if (foundUser.savedArtwork.includes(foundArtwork._id)) {
          updatedUser = await User.updateOne(
            { _id: foundUser._id },
            { $pull: { savedArtwork: req.params.id } }
          ).session(session);
          saved = false;
        } else {
          updatedUser = await User.updateOne(
            { _id: foundUser._id },
            { $push: { savedArtwork: req.params.id } }
          ).session(session);
          saved = true;
        }
        if (updatedUser) {
          await session.commitTransaction();
          res.status(200).json({ saved });
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Could not update user' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'User not found' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
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
