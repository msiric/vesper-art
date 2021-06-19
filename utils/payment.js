import currency from "currency.js";
import { payment } from "../common/constants";
import { isObjectEmpty } from "../common/helpers";

export const calculateTotalCharge = ({
  foundVersion,
  foundDiscount,
  licenseType,
}) => {
  const licensePrice = foundVersion[licenseType];
  const licenseValue = currency(licensePrice);
  const buyerFee = currency(licensePrice)
    .multiply(payment.buyerFee.multiplier)
    .add(payment.buyerFee.addend);
  const sellerFee = currency(1 - payment.appFee);
  const discount = !isObjectEmpty(foundDiscount)
    ? currency(licensePrice).multiply(foundDiscount.discount)
    : 0;
  const buyerTotal = currency(licensePrice).subtract(discount).add(buyerFee);
  const sellerTotal = currency(licensePrice).multiply(sellerFee);
  const platformTotal = currency(buyerTotal).subtract(sellerTotal);
  const stripeFees = currency(1.03).add(2).add(0.3); // for internal use only
  const total = currency(platformTotal).subtract(stripeFees); // for internal use only

  return {
    buyerTotal: buyerTotal.intValue,
    sellerTotal: sellerTotal.intValue,
    platformTotal: platformTotal.intValue,
    licensePrice: licenseValue.intValue,
  };
};
