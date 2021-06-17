import argon2 from "argon2";
import aws from "aws-sdk";
import createError from "http-errors";
import { errors } from "../common/constants";
import { isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  originValidation,
  passwordValidation,
  preferencesValidation,
  profileValidation,
} from "../common/validation";
import {
  deactivateArtworkVersion,
  deactivateExistingArtwork,
  removeArtworkVersion,
} from "../services/postgres/artwork.js";
import { logUserOut } from "../services/postgres/auth";
import {
  fetchOrdersByArtwork,
  fetchOrdersByBuyer,
  fetchOrdersBySeller,
} from "../services/postgres/order.js";
import { fetchStripeBalance } from "../services/postgres/stripe.js";
import {
  addNewIntent,
  addUserAvatar,
  deactivateExistingUser,
  editUserAvatar,
  editUserEmail,
  editUserOrigin,
  editUserPassword,
  editUserPreferences,
  editUserProfile,
  fetchSellerMedia,
  fetchUserArtwork,
  fetchUserByAuth,
  fetchUserById,
  fetchUserByUsername,
  fetchUserFavorites,
  fetchUserIdByEmail,
  fetchUserIdByUsername,
  fetchUserMedia,
  fetchUserNotifications,
  fetchUserProfile,
  fetchUserPurchases,
  fetchUserReviews,
  fetchUserSales,
  removeExistingIntent,
  removeUserAvatar,
} from "../services/postgres/user.js";
import { sendEmail } from "../utils/email.js";
import { generateToken, generateUuids } from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const getUserProfile = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  const foundUser = await fetchUserProfile({
    userUsername,
    userId: foundId,
    cursor,
    limit,
    connection,
  });
  if (foundUser) return { user: foundUser };
  throw createError(errors.notFound, "User not found");
};

export const getUserArtwork = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  const foundArtwork = await fetchUserArtwork({
    userId: foundId,
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getUserUploads = async ({ userId, cursor, limit, connection }) => {
  const foundArtwork = await fetchUserArtwork({
    userId,
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getUserOwnership = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundPurchases = await fetchUserPurchases({
    userId,
    cursor,
    limit,
    connection,
  });
  // $TODO change name
  return { purchases: foundPurchases };
};

export const getUserFavorites = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundUser = await fetchUserByUsername({
    userUsername,
    connection,
  });
  if (foundUser.displayFavorites) {
    const foundFavorites = await fetchUserFavorites({
      userId: foundUser.id,
      cursor,
      limit,
      connection,
    });
    return { favorites: foundFavorites };
  }
  throw createError(errors.notAllowed, "User keeps favorites private");
};

// $TODO ne valja nista
export const getBuyerStatistics = async ({ userId, connection }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const [foundUser, foundFavorites, foundPurchases] = await Promise.all([
    fetchUserById({ userId, connection }),
    fetchUserFavorites({ userId, connection }),
    fetchUserPurchases({ userId, connection }),
  ]);
  console.log("aaa", foundUser, foundFavorites, foundPurchases);
  return {
    purchases: foundPurchases,
    favorites: foundFavorites,
  };
};

export const getSellerStatistics = async ({ userId, connection }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const [foundUser, foundReviews, foundSales] = await Promise.all([
    fetchUserById({ userId, connection }),
    fetchUserReviews({ userId, connection }),
    fetchUserSales({ userId, connection }),
  ]);
  const balance = await fetchStripeBalance({
    stripeId: foundUser.stripeId,
    connection,
  });
  console.log("aaa", foundUser, foundReviews, foundSales);
  const { amount } = balance.available[0];
  return { sales: foundSales, amount, reviews: foundReviews };
};

export const getUserSales = async ({ userId, start, end, connection }) => {
  const foundOrders = await fetchOrdersBySeller({
    userId,
    start,
    end,
    connection,
  });
  // $TODO change name
  return { statistics: foundOrders };
};

export const getUserPurchases = async ({ userId, start, end, connection }) => {
  const foundOrders = await fetchOrdersByBuyer({
    userId,
    start,
    end,
    connection,
  });
  // $TODO change name
  return { statistics: foundOrders };
};

export const updateUserOrigin = async ({
  userId,
  userBusinessAddress,
  connection,
}) => {
  await originValidation.validate({ userBusinessAddress });
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    await editUserOrigin({
      userId: foundUser.id,
      userBusinessAddress,
      connection,
    });
    return { message: "User business address updated" };
  }
  throw createError(errors.notFound, "User not found");
};

export const updateUserProfile = async ({
  userId,
  userPath,
  userFilename,
  userMimetype,
  userData,
  connection,
}) => {
  // $TODO delete S3 images when not being used anymore
  // $TODO Validate data passed to upload
  const avatarUpload = await finalizeMediaUpload({
    filePath: userPath,
    fileName: userFilename,
    mimeType: userMimetype,
    fileType: "user",
  });
  await profileValidation.validate(userData);
  const foundUser = await fetchUserById({ userId, connection });
  let avatarId = null;
  if (avatarUpload.fileMedia) {
    if (foundUser.avatar) {
      await deleteS3Object({
        fileLink: foundUser.avatar.source,
        folderName: "userMedia/",
      });
      const updatedAvatar = await editUserAvatar({
        userId: foundUser.id,
        avatarUpload,
        connection,
      });
      avatarId = updatedAvatar.raw[0].id;
    } else {
      ({ avatarId } = generateUuids({
        avatarId: null,
      }));
      await addUserAvatar({
        avatarId,
        userId: foundUser.id,
        avatarUpload,
        connection,
      });
    }
    await editUserProfile({
      foundUser,
      userData,
      avatarId,
      connection,
    });
  } else {
    if (!foundUser.avatar) {
      avatarId = null;
    }
    await editUserProfile({
      foundUser,
      userData,
      avatarId,
      connection,
    });
    if (foundUser.avatar) {
      await deleteS3Object({
        fileLink: foundUser.avatar.source,
        folderName: "userMedia/",
      });
      await removeUserAvatar({
        userId: foundUser.id,
        avatarId: foundUser.avatar.id,
        connection,
      });
    }
  }
  return { message: "User details updated" };
};

export const getUserSettings = async ({ userId, connection }) => {
  // $TODO Minimize overhead
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    // $TODO change name
    return { user: foundUser };
  }
  throw createError(errors.notFound, "User not found");
};

export const getUserNotifications = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundNotifications = await fetchUserNotifications({
    userId,
    cursor,
    limit,
    connection,
  });
  return { notifications: foundNotifications };
};

export const createUserIntent = async ({
  userId,
  versionId,
  intentId,
  connection,
}) => {
  await addNewIntent({
    userId,
    versionId,
    intentId,
    connection,
  });
  return { message: "Intent successfully saved" };
};

export const deleteUserIntent = async ({ userId, intentId, connection }) => {
  await removeExistingIntent({
    userId,
    intentId,
    connection,
  });
  return { message: "Intent successfully deleted" };
};

// $TODO Update user context with new data
export const updateUserEmail = async ({ userId, userEmail, connection }) => {
  await emailValidation.validate({ userEmail });
  const emailUsed = await fetchUserIdByEmail({ userEmail, connection });
  if (emailUsed) {
    throw createError(
      errors.conflict,
      "User with provided email already exists"
    );
  } else {
    const { verificationToken, verificationLink } = generateToken();
    await editUserEmail({ userId, userEmail, verificationToken, connection });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Please confirm your email",
      emailContent: `Hello,
        Please click on the link to verify your email:

        <a href=${verificationLink}>Click here to verify</a>`,
    });
    return { message: "Email successfully updated" };
  }
};

// needs transaction (done)
export const updateUserPassword = async ({
  userId,
  userCurrent,
  userPassword,
  userConfirm,
  connection,
}) => {
  const foundUser = await fetchUserByAuth({ userId, connection });
  if (!isObjectEmpty(foundUser)) {
    const isCurrentValid = await argon2.verify(foundUser.password, userCurrent);
    if (!isCurrentValid)
      throw createError(errors.badRequest, "Current password is incorrect");
    const isPasswordValid = await argon2.verify(
      foundUser.password,
      userPassword
    );
    if (isPasswordValid)
      throw createError(
        errors.badRequest,
        "New password cannot be identical to the old one"
      );
    await passwordValidation.validate({
      userCurrent,
      userPassword,
      userConfirm,
    });
    const hashedPassword = await argon2.hash(userPassword);
    await editUserPassword({ userId, hashedPassword, connection });
    return { message: "Password updated successfully" };
  }
  throw createError(errors.notFound, "User not found");
};

// needs transaction (done)
// $TODO Update context with new data
export const updateUserPreferences = async ({
  userId,
  userFavorites,
  connection,
}) => {
  await preferencesValidation.validate({ userFavorites });
  await editUserPreferences({ userId, userFavorites, connection });
  return { message: "Preferences updated successfully" };
};

/* const deleteUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ id: res.locals.user.id }, { active: true }]
    });
    if (foundUser) {
      if (foundUser.avatar.includes(foundUser.id)) {
        const folderName = 'profileavatars/';
        const fileName = foundUser.avatar.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: filePath
        };
        await s3.deleteObject(params).promise();
      }
      const updatedUser = await User.updateOne(
        { id: foundUser.id },
        {
          $set: {
            name: 'Deleted User',
            password: null,
            avatar: foundUser.gravatar(),
            description: null,
            facebookId: null,
            googleId: null,
            customWork: false,
            verificationToken: null,
            verified: false,
            resetToken: null,
            resetExpiry: null,
            discount: null,
            inbox: null,
            notifications: null,
            rating: null,
            reviews: null,
            favorites: null,
            earnings: null,
            incomingFunds: null,
            outgoingFunds: null,
            escrow: null,
            active: false
          }
        }
      );
      if (updatedUser) {
        req.logout();
        req.connection.destroy(function(err) {
          res.json('/');
        });
      } else {
        return res.status(400).json({ message: 'User could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
}; */

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
/* export const deactivateUser = async ({ userId, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    const foundArtwork = await fetchUserArtwork({
      userId,
      connection,
    });
    for (let artwork of foundArtwork) {
      const foundOrder = await fetchOrderByVersion({
        artworkId: artwork.id,
        versionId: artwork.current.id,
        connection,
      });
      if (!foundOrder.length) {
        await deleteS3Object({
          fileLink: artwork.current.cover.source,
          folderName: "artworkCovers/",
        });

        await deleteS3Object({
          fileLink: artwork.current.media.source,
          folderName: "artworkMedia/",
        });

        await removeArtworkVersion({
          versionId: artwork.current.id,
          connection,
        });
      }
      await deactivateExistingArtwork({ artworkId: artwork.id, connection });
    }
    if (foundUser.avatar) {
      await deleteS3Object({
        fileLink: foundUser.avatar.source,
        folderName: "userMedia/",
      });
    }
    await deactivateExistingUser({ userId: foundUser.id, connection });
    req.logout();
    req.connection.destroy(function (err) {
      res.json("/");
    });
    return { message: "User deactivated" };
  }
  throw createError(400, "User not found");
}; */

export const deactivateUser = async ({ userId, response, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    const foundArtwork = await fetchUserMedia({
      userId,
      connection,
    });
    for (let artwork of foundArtwork) {
      const foundOrders = await fetchOrdersByArtwork({
        userId: foundUser.id,
        versionId: artwork.id,
        connection,
      });
      if (!foundOrders.length) {
        const oldVersion = foundArtwork.current;
        await deactivateArtworkVersion({ artworkId, connection });
        await deleteS3Object({
          fileLink: oldVersion.cover.source,
          folderName: "artworkCovers/",
        });
        await deleteS3Object({
          fileLink: oldVersion.media.source,
          folderName: "artworkMedia/",
        });
        await removeArtworkVersion({
          versionId: oldVersion.id,
          connection,
        });
      } else if (
        foundOrders.find((item) => item.versionId === foundArtwork.current.id)
      ) {
        await deactivateExistingArtwork({ artworkId, connection });
      } else {
        const oldVersion = foundArtwork.current;
        await deactivateArtworkVersion({ artworkId, connection });
        await removeArtworkVersion({
          versionId: oldVersion.id,
          connection,
        });
      }
    }
    if (foundUser.avatar) {
      await deleteS3Object({
        fileLink: foundUser.avatar.source,
        folderName: "userMedia/",
      });
    }
    await deactivateExistingUser({ userId: foundUser.id, connection });
    logUserOut(response);
    return { message: "User deactivated" };
  }
  throw createError(errors.notFound, "User not found");
};

export const getUserMedia = async ({ userId, artworkId, connection }) => {
  const foundMedia = await fetchSellerMedia({
    userId,
    artworkId,
    connection,
  });
  if (foundMedia) {
    const s3 = new aws.S3({ signatureVersion: "v4" });
    const file = foundMedia.source.split("/").pop();
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `artworkMedia/${file}`,
      Expires: 60 * 3,
    };
    const url = s3.getSignedUrl("getObject", params);

    return { url, file };
  }
  throw createError(errors.notFound, "Artwork not found");
};
