import { Discount } from "../../entities/Discount";

// $Needs testing (mongo -> postgres)
export const fetchDiscountByCode = async ({ discountCode }) => {
  return await Discount.findOne({
    where: [{ name: discountCode }],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchDiscountById = async ({ discountId }) => {
  return await Discount.findOne({
    where: [{ id: discountId }],
  });
};
