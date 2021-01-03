import argon2 from "argon2";
import createError from "http-errors";
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
  /*   const newUser = new User();
  newUser.email = userEmail;
  newUser.name = userUsername;
  newUser.password = hashedPassword;
  newUser.avatar = null;
  newUser.verificationToken = verificationToken;
  return await User.save(newUser); */

  const savedUser = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        email: userEmail,
        name: userUsername,
        password: hashedPassword,
        avatar: null,
        verificationToken: verificationToken,
      },
    ])
    .execute();
  console.log(savedUser);
  return savedUser;
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
  /*   return await User.increment(
    { where: [{ id: userId, active: true }] },
    "jwtVersion",
    1
  );
 */
  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ jwtVersion: () => "jwtVersion + 1" }) // One hour
    .where("id = :userId AND active = :active", {
      userId,
      // $TODO add constant
      active: true,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const editUserResetToken = async ({ userEmail, resetToken }) => {
  /*   const foundUser = await User.findOne({
    where: [{ email: userEmail, active: true }],
  });
  foundUser.resetToken = resetToken;
  foundUser.resetExpiry = Date.now() + 3600000;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ resetToken, resetExpiry: Date.now() + 3600000 }) // One hour
    .where("email = :userEmail AND active = :active", {
      userEmail,
      // $TODO add constant
      active: true,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const resetUserPassword = async ({ tokenId, userPassword }) => {
  const hashedPassword = await argon2.hash(userPassword);
  /*   const foundUser = await User.findOne({
    where: [{ resetToken: tokenId, resetExpiry: MoreThan(Date.now()) }],
  });
  foundUser.password = hashedPassword;
  foundUser.resetToken = "";
  foundUser.resetExpiry = "";
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword, resetToken: "", resetExpiry: "" })
    .where(
      "resetToken = :tokenId AND resetExpiry > :dateNow AND active = :active",
      {
        tokenId,
        dateNow: Date.now(),
        // $TODO add constant
        active: true,
      }
    )
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Done (mongo -> postgres)
export const resetRegisterToken = async ({ tokenId }) => {
  /*   const foundUser = await User.findOne({
    where: [{ verificationToken: tokenId }],
  });
  foundUser.verificationToken = "";
  foundUser.verified = true;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ verificationToken: "", verified: true })
    .where("verificationToken = :tokenId AND active = :active", {
      tokenId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};
