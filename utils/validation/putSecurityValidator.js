const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  password: Joi.string()
    .regex('^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$')
    .required(),
  repeatPassword: Joi.ref('password')
});

module.exports = data => Joi.validate(data, schema);
