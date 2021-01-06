import { Discount } from "../../entities/Discount";

// $Needs testing (mongo -> postgres)
export const fetchDiscountByCode = async ({ discountCode, connection }) => {
  // return await Discount.findOne({
  //   where: [{ name: discountCode }],
  // });

  const foundDiscount = await connection
    .getRepository(Discount)
    .createQueryBuilder("discount")
    .where("discount.name = :name AND discount.active = :active", {
      name: discountCode,
      // $TODO replace with a constant
      active: true,
    })
    .getOne();
  console.log(foundDiscount);
  return foundDiscount;
};

// $Needs testing (mongo -> postgres)
export const fetchDiscountById = async ({ discountId, connection }) => {
  // return await Discount.findOne({
  //   where: [{ id: discountId }],
  // });

  const foundDiscount = await connection
    .getRepository(Discount)
    .createQueryBuilder("discount")
    .where("discount.id = :discountId AND discount.active = :active", {
      discountId,
      // $TODO replace with a constant
      active: true,
    })
    .getOne();
  console.log(foundDiscount);
  return foundDiscount;
};
