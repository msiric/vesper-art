import Discount from "../../models/discount";

export const fetchDiscountByCode = async ({ discountCode, session = null }) => {
  return await Discount.findOne({
    name: discountCode,
  }).session(session);
};

export const fetchDiscountById = async ({ discountId, session = null }) => {
  return await Discount.findOne({
    id: discountId,
  }).session(session);
};
