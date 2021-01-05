import createError from "http-errors";
import { discountValidation } from "../common/validation";
import {
  fetchDiscountByCode,
  fetchDiscountById,
} from "../services/postgres/discount.js";
import { sanitizeData } from "../utils/helpers.js";

// needs transaction (done)
// treba sredit
export const postDiscount = async ({ userId, discountCode, connection }) => {
  await discountValidation.validate(sanitizeData({ discountCode }));

  const foundDiscount = await fetchDiscountByCode({
    discountCode,
    connection,
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
export const deleteDiscount = async ({ userId, discountId, connection }) => {
  const foundDiscount = await fetchDiscountById({ discountId, connection });
  if (foundDiscount) {
    return { message: "Discount removed" };
  }
  throw createError(400, "Discount not found");
};
