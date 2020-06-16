import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  name: Joi.string().min(6),
  email: Joi.string().email({ minDomainSegments: 2 }),
  description: Joi.string(),
});

export default (data) => Joi.validate(data, schema);
