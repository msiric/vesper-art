import Joi from 'joi';

const schema = Joi.object().keys({
  userUsername: Joi.string().trim().required(),
  userPassword: Joi.string().trim().required(),
});

export default (data) => Joi.validate(data, schema);
