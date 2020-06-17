import mongoose from 'mongoose';
import createError from 'http-errors';
import {
  fetchDiscountByCode,
  fetchDiscountById,
} from '../services/discount.js';
import {
  fetchUserById,
  addUserDiscount,
  removeUserDiscount,
} from '../services/user.js';

// needs transaction (done)
// treba sredit
const postDiscount = async ({ userId, discountCode, session }) => {
  const foundUser = await fetchUserById({
    userId,
    session,
  });
  if (!foundUser.discount) {
    const foundDiscount = await fetchDiscountByCode({
      discountCode,
      session,
    });
    if (foundDiscount) {
      if (foundDiscount.active) {
        await addUserDiscount({
          discountId: foundDiscount._id,
          userId,
          session,
        });
        return { message: 'Discount applied', payload: foundDiscount };
      }
      throw createError(400, 'Discount expired');
    }
    throw createError(400, 'Discount not found');
  }
  throw createError(400, 'User already has an applied discount');
};

// needs transaction (done)
const deleteDiscount = async ({ userId, discountId, session }) => {
  const foundDiscount = await fetchDiscountById({ discountId, session });
  if (foundDiscount) {
    await removeUserDiscount({ userId: res.locals.user.id, session });
    await session.commitTransaction();
    return { message: 'Discount removed' };
  }
  throw createError(400, 'Discount not found');
};

export default {
  postDiscount,
  deleteDiscount,
};
