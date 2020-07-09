import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  searchQuery: Joi.string().allow(''),
  searchType: Joi.string().valid('artwork', 'users').required(),
});

export default (data) => Joi.validate(data, schema);