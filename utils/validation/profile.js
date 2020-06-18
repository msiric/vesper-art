import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  userPhoto: Joi.string().trim(),
  userDescription: Joi.string().trim(),
  userCountry: Joi.string().trim(),
});

export default (data) => Joi.validate(data, schema);
