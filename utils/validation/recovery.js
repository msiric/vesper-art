import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  recoveryEmail: Joi.string().trim().email({ minDomainSegments: 2 }),
});

export default (data) => Joi.validate(data, schema);
