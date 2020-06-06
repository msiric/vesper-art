import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  category: 'ne znam',
  budget: Joi.number().integer(),
  delivery: Joi.date(),
  description: Joi.string().required(),
});

export default (data) => Joi.validate(data, schema);
