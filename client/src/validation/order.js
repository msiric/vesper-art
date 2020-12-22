import * as Yup from 'yup';
import joiObjectId from 'joi-objectid';

Yup.objectId = joiObjectId(Yup);

export const orderValidation = Yup.object().shape({
  orderBuyer: Yup.objectId().required(),
  orderSeller: Yup.objectId().required(),
  orderArtwork: Yup.objectId().required(),
  orderVersion: Yup.objectId().required(),
  orderDiscount: Yup.objectId().required(),
  orderLicense: Yup.objectId().required(),
  orderSpent: Yup.number().integer().required(),
  orderEarned: Yup.number().integer().required(),
  orderFee: Yup.number().integer().required(),
  orderIntent: Yup.objectId().required(),
});
