const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  name: Joi.string().min(6),
  email: Joi.string().email({ minDomainSegments: 2 }),
  about: Joi.string()
});

module.exports = data => Joi.validate(data, schema);
