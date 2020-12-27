import argon2 from "argon2";
import createError from "http-errors";
import { MoreThan } from "typeorm";
import { User } from "../../entities/User";
import { sendRefreshToken, updateAccessToken } from "../../utils/auth.js";
import { fetchUserByCreds } from "./user";

// $Done (mongo -> postgres)
export const addNewUser = async ({
  userEmail,
  userUsername,
  userPassword,
  verificationToken,
}) => {
  const hashedPassword = await argon2.hash(userPassword);
  const newUser = new User();
  newUser.email = userEmail;
  newUser.name = userUsername;
  newUser.password = hashedPassword;
  newUser.avatar = null;
  newUser.verificationToken = verificationToken;
  return await User.save({ newUser });
};

// $Done (mongo -> postgres)
export const verifyUserLogin = async ({ userUsername, userPassword }) => {
  const foundUser = await fetchUserByCreds({ userUsername });
  if (!foundUser) {
    throw createError(400, "Account with provided credentials does not exist");
  } else if (!foundUser.active) {
    throw createError(400, "This account is no longer active");
  } else if (!foundUser.verified) {
    throw createError(400, "Please verify your account");
  } else {
    const valid = await argon2.verify(foundUser.password, userPassword);

    if (!valid) {
      throw createError(
        400,
        "Account with provided credentials does not exist"
      );
    }
    return { foundUser };
  }
};

export const logUserOut = (res) => {
  sendRefreshToken(res, "");
  return { accessToken: "", user: "" };
};

export const refreshAccessToken = async (req, res, next) => {
  return await updateAccessToken(req, res, next);
};

// $Needs testing (mongo -> postgres)
export const revokeAccessToken = async ({ userId }) => {
  return await User.increment(
    { where: [{ id: userId, active: true }] },
    "jwtVersion",
    1
  );
};

// $Needs testing (mongo -> postgres)
export const editUserResetToken = async ({ userEmail, resetToken }) => {
  const foundUser = await User.findOne({
    where: [{ email: userEmail, active: true }],
  });
  foundUser.resetToken = resetToken;
  foundUser.resetExpiry = Date.now() + 3600000;
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const resetUserPassword = async ({ tokenId, userPassword }) => {
  const hashedPassword = await argon2.hash(userPassword);
  const foundUser = await User.findOne({
    where: [{ resetToken: tokenId, resetExpiry: MoreThan(Date.now()) }],
  });
  foundUser.password = hashedPassword;
  foundUser.resetToken = "";
  foundUser.resetExpiry = "";
  return await User.save({ foundUser });
};

// $Done (mongo -> postgres)
export const resetRegisterToken = async ({ tokenId }) => {
  const foundUser = await User.findOne({
    where: [{ verificationToken: tokenId }],
  });
  foundUser.verificationToken = "";
  foundUser.verified = true;
  return await User.save(foundUser);
};
