import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  licenseType: Joi.string().valid('personal', 'commercial').required(),
  licensePrice: Joi.number().integer().required(),
});

export default (data) => Joi.validate(data, schema);
