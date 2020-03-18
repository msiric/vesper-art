const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  content: Joi.string().required()
});

module.exports = data => Joi.validate(data, schema);
