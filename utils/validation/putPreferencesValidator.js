const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  customWork: Joi.boolean()
});

module.exports = data => Joi.validate(data, schema);
