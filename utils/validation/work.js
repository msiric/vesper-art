import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  customWorkDescription: Joi.string().required(),
  customWorkAmount: Joi.number().integer(),
  customWorkDeadline: Joi.date(),
});

export default (data) => Joi.validate(data, schema);
