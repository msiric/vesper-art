import createError from "http-errors";
import { errors } from "../common/constants";
import { discountValidation } from "../common/validation";
import {
  addNewDiscount,
  fetchDiscountByCode,
} from "../services/postgres/discount.js";
import {} from "../utils/helpers.js";

// needs transaction (done)
// treba sredit
// SNACKBAR $TODO Add expose to response
export const getDiscount = async ({ userId, discountCode, connection }) => {
  await discountValidation.validate({ discountCode });
  const foundDiscount = await fetchDiscountByCode({
    discountCode,
    connection,
  });
  if (foundDiscount) {
    return { message: "Discount applied", payload: foundDiscount };
  }
  throw createError(errors.notFound, "Discount not found", { expose: true });
};

export const postDiscount = async ({ userId, discountData, connection }) => {
  const savedDiscount = await addNewDiscount({
    discountData,
    connection,
  });
  return { discount: savedDiscount };
};
