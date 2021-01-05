import createError from "http-errors";
import { discountValidation } from "../common/validation";
import {
  fetchDiscountByCode,
  fetchDiscountById,
} from "../services/postgres/discount.js";
import { sanitizeData } from "../utils/helpers.js";

// needs transaction (done)
// treba sredit
export const postDiscount = async ({ userId, discountCode, session }) => {
  await discountValidation.validate(sanitizeData({ discountCode }));

  const foundDiscount = await fetchDiscountByCode({
    discountCode,
    session,
  });
  if (foundDiscount) {
    if (foundDiscount.active) {
      return { message: "Discount applied", payload: foundDiscount };
    }
    throw createError(400, "Discount expired");
  }
  throw createError(400, "Discount not found");
};

// needs transaction (done)
export const deleteDiscount = async ({ userId, discountId, session }) => {
  const foundDiscount = await fetchDiscountById({ discountId, session });
  if (foundDiscount) {
    return { message: "Discount removed" };
  }
  throw createError(400, "Discount not found");
};
