import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  commentContent: Joi.string().trim().required(),
});

export default (data) => Joi.validate(data, schema);