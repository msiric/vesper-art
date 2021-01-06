import createError from "http-errors";
import { discountValidation } from "../common/validation";
import { fetchDiscountByCode } from "../services/postgres/discount.js";
import { sanitizeData } from "../utils/helpers.js";

// needs transaction (done)
// treba sredit
export const getDiscount = async ({ userId, discountCode, connection }) => {
  await discountValidation.validate(sanitizeData({ discountCode }));

  const foundDiscount = await fetchDiscountByCode({
    discountCode,
    connection,
  });
  if (foundDiscount) {
    return { message: "Discount applied", payload: foundDiscount };
  }
  throw createError(400, "Discount not found");
};
