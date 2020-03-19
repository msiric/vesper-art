const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  description: Joi.string().required(),
  amount: Joi.number().integer(),
  delivery: Joi.date()
});

module.exports = data => Joi.validate(data, schema);
