import { Discount } from "../entities/Discount";
import { DISCOUNT_SELECTION } from "../utils/database";

export const fetchDiscountByCode = async ({ discountCode, connection }) => {
  const foundDiscount = await connection
    .getRepository(Discount)
    .createQueryBuilder("discount")
    .select([...DISCOUNT_SELECTION["ESSENTIAL_INFO"]()])
    .where("discount.name = :name AND discount.active = :active", {
      name: discountCode,
      active: DISCOUNT_SELECTION.ACTIVE_STATUS,
    })
    .getOne();
  return foundDiscount;
};

export const fetchDiscountById = async ({ discountId, connection }) => {
  const foundDiscount = await connection
    .getRepository(Discount)
    .createQueryBuilder("discount")
    .select([...DISCOUNT_SELECTION["ESSENTIAL_INFO"]()])
    .where("discount.id = :discountId AND discount.active = :active", {
      discountId,
      active: DISCOUNT_SELECTION.ACTIVE_STATUS,
    })
    .getOne();
  return foundDiscount;
};

export const addNewDiscount = async ({ discountData, connection }) => {
  const savedDiscount = await connection
    .createQueryBuilder()
    .insert()
    .into(Discount)
    .values([
      {
        id: discountData.id,
        name: discountData.name,
        discount: discountData.amount,
        active: discountData.active,
      },
    ])
    .execute();
  return savedDiscount;
};
