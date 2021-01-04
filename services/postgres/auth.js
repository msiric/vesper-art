import { getConnection } from "typeorm";
import { User } from "../../entities/User";
import { sendRefreshToken, updateAccessToken } from "../../utils/auth.js";

// $Done (mongo -> postgres)
export const addNewUser = async ({
  userId,
  userEmail,
  userUsername,
  hashedPassword,
  verificationToken,
}) => {
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
        id: userId,
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
export const resetUserPassword = async ({ tokenId, hashedPassword }) => {
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
      // $TODO add constant
      active: true,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};
