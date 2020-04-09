const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  artworkTitle: Joi.string().required(),
  artworkAvailable: Joi.string().valid('available', 'unavailable').required(),
  artworkType: Joi.string().valid('commercial', 'showcase').required(),
  artworkPrice: Joi.when('type', {
    is: 'commercial',
    then: Joi.number().integer().required(),
  }),
  artworkLicense: Joi.when('type', {
    is: 'commercial',
    then: Joi.when('use', {
      is: 'commercial',
      then: Joi.string().valid('commercial', 'personal').required(),
    }),
  }),
  artworkCommercial: Joi.when('type', {
    is: 'commercial',
    then: Joi.when('use', {
      is: 'commercial',
      then: Joi.number().integer().required(),
    }),
  }),
  artworkCategory: Joi.string().required(),
  artworkDescription: Joi.string().required(),
  artworkMedia: Joi.string().required(),
  artworkCover: Joi.string().required(),
});

module.exports = (data) => Joi.validate(data, schema);
