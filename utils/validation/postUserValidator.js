const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  name: Joi.string().min(6),
  email: Joi.string().email({ minDomainSegments: 2 }),
  description: Joi.string(),
  password: Joi.string()
    .regex('^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$')
    .required(),
  repeatPassword: Joi.ref('password'),
});

module.exports = (data) => Joi.validate(data, schema);
