import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  orderBuyer: Joi.objectId().required(),
  orderSeller: Joi.objectId().required(),
  orderArtwork: Joi.objectId().required(),
  orderVersion: Joi.objectId().required(),
  orderDiscount: Joi.objectId().required(),
  orderLicenses: Joi.array().items(Joi.objectId()).required(),
  orderSpent: Joi.number().integer().required(),
  orderEarned: Joi.number().integer().required(),
  orderFee: Joi.number().integer().required(),
  orderIntent: Joi.objectId().required(),
});

export default (data) => Joi.validate(data, schema);
