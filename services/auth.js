import { User } from "../entities/User";
import { sendRefreshToken, updateAccessToken } from "../utils/auth";
import { USER_SELECTION } from "../utils/database";

export const addNewUser = async ({
  userId,
  userName,
  userEmail,
  userUsername,
  hashedPassword,
  verificationToken,
  verificationExpiry,
  verified,
  connection,
}) => {
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
        verified,
      },
    ])
    .execute();
  return savedUser;
};

export const logUserOut = ({ response }) => {
  sendRefreshToken({ response, refreshToken: "" });
  return { accessToken: "", user: "" };
};

export const refreshAccessToken = async ({ cookies, response, connection }) => {
  return await updateAccessToken({ cookies, response, connection });
};

export const revokeAccessToken = async ({ userId, connection }) => {
  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ jwtVersion: () => "jwtVersion + 1" })
    .where("id = :userId AND active = :active", {
      userId,
      active: USER_SELECTION.ACTIVE_STATUS,
    })
    .execute();
  return updatedUser;
};

export const editUserResetToken = async ({
  userEmail,
  resetToken,
  resetExpiry,
  connection,
}) => {
  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ resetToken, resetExpiry })
    .where("email = :userEmail AND active = :active", {
      userEmail,
      active: USER_SELECTION.ACTIVE_STATUS,
    })
    .execute();
  return updatedUser;
};

export const resetUserPassword = async ({
  userId,
  hashedPassword,
  connection,
}) => {
  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword, resetToken: "", resetExpiry: null })
    .where('"id" = :userId AND active = :active', {
      userId,
      active: USER_SELECTION.ACTIVE_STATUS,
    })
    .execute();
  return updatedUser;
};

export const resetVerificationToken = async ({ tokenId, connection }) => {
  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ verificationToken: "", verificationExpiry: null, verified: true })
    .where(
      '"verificationToken" = :tokenId AND "verificationExpiry" > :dateNow AND active = :active',
      {
        tokenId,
        dateNow: new Date(),
        active: USER_SELECTION.ACTIVE_STATUS,
      }
    )
    .execute();
  return updatedUser;
};
