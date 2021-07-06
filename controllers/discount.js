import createError from "http-errors";
import { discountValidation } from "../common/validation";
import {
  addNewDiscount,
  fetchDiscountByCode,
} from "../services/postgres/discount";
import { formatError, formatResponse } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

// needs transaction (done)
// treba sredit
export const getDiscount = async ({ userId, discountCode, connection }) => {
  await discountValidation.validate({ discountCode });
  const foundDiscount = await fetchDiscountByCode({
    discountCode,
    connection,
  });
  if (foundDiscount) {
    return formatResponse({
      ...responses.discountApplied,
      payload: foundDiscount,
    });
  }
  throw createError(...formatError(errors.discountNotFound));
};

export const postDiscount = async ({ userId, discountData, connection }) => {
  const savedDiscount = await addNewDiscount({
    discountData,
    connection,
  });
  return { discount: savedDiscount };
};
