import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  requestCategory: 'ne znam',
  requestBudget: Joi.number().integer(),
  requestDeadline: Joi.date(),
  requestDescription: Joi.string().required(),
});

export default (data) => Joi.validate(data, schema);
