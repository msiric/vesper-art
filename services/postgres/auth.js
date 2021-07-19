import { User } from "../../entities/User";
import { sendRefreshToken, updateAccessToken } from "../../utils/auth";

// $Done (mongo -> postgres)
export const addNewUser = async ({
  userId,
  userName,
  userEmail,
  userUsername,
  hashedPassword,
  verificationToken,
  verificationExpiry,
  connection,
}) => {
  /*   const newUser = new User();
  newUser.email = userEmail;
  newUser.name = userUsername;
  newUser.password = hashedPassword;
  newUser.avatar = null;
  newUser.verificationToken = verificationToken;
  return await User.save(newUser); */

  const savedUser = await connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        id: userId,
        email: userEmail,
        fullName: userName,
        name: userUsername,
        password: hashedPassword,
        // $TODO should be avatarId?
        avatar: null,
        verificationToken,
        verificationExpiry,
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

export const refreshAccessToken = async (req, res, next, connection) => {
  return await updateAccessToken(req, res, next, connection);
};

// $Needs testing (mongo -> postgres)
export const revokeAccessToken = async ({ userId, connection }) => {
  /*   return await User.increment(
    { where: [{ id: userId, active: true }] },
    "jwtVersion",
    1
  );
 */
  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ jwtVersion: () => "jwtVersion + 1" })
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
export const editUserResetToken = async ({
  userEmail,
  resetToken,
  resetExpiry,
  connection,
}) => {
  /*   const foundUser = await User.findOne({
    where: [{ email: userEmail, active: true }],
  });
  foundUser.resetToken = resetToken;
  foundUser.resetExpiry = Date.now() + 3600000;
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ resetToken, resetExpiry })
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
export const resetUserPassword = async ({
  tokenId,
  hashedPassword,
  connection,
}) => {
  /*   const foundUser = await User.findOne({
    where: [{ resetToken: tokenId, resetExpiry: MoreThan(Date.now()) }],
  });
  foundUser.password = hashedPassword;
  foundUser.resetToken = "";
  foundUser.resetExpiry = "";
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword, resetToken: "", resetExpiry: null })
    .where(
      '"resetToken" = :tokenId AND "resetExpiry" > :dateNow AND active = :active',
      {
        tokenId,
        dateNow: new Date(),
        // $TODO add constant
        active: true,
      }
    )
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Done (mongo -> postgres)
export const resetVerificationToken = async ({ tokenId, connection }) => {
  /*   const foundUser = await User.findOne({
    where: [{ verificationToken: tokenId }],
  });
  foundUser.verificationToken = "";
  foundUser.verified = true;
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ verificationToken: "", verificationExpiry: null, verified: true })
    .where(
      '"verificationToken" = :tokenId AND "verificationExpiry" > :dateNow AND active = :active',
      {
        tokenId,
        dateNow: new Date(),
        // $TODO add constant
        active: true,
      }
    )
    .execute();
  console.log(updatedUser);
  return updatedUser;
};
