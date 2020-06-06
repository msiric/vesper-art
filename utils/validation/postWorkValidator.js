import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  description: Joi.string().required(),
  amount: Joi.number().integer(),
  delivery: Joi.date(),
});

export default (data) => Joi.validate(data, schema);
