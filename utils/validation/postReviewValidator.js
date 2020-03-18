const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  review: Joi.string(),
  rating: Joi.number()
    .integer()
    .required()
});

module.exports = data => Joi.validate(data, schema);
