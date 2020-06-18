import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

// $TODO fix date validation

const schema = Joi.object().keys({
  rangeFrom: Joi.string().trim().required(),
  rangeTo: Joi.string().trim().required(),
});

export default (data) => Joi.validate(data, schema);
