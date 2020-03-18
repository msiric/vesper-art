const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  type: Joi.string().valid('personal', 'commercial'),
  credentials: Joi.string().required()
});

module.exports = data => Joi.validate(data, schema);
