import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  userDescription: Joi.string().trim().allow(''),
  userCountry: Joi.string().trim().allow(''),
});

export default (data) => Joi.validate(data, schema);
