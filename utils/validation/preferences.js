import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  displaySaves: Joi.boolean().required(),
});

export default (data) => Joi.validate(data, schema);
