const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  artworkTitle: Joi.string().required(),
  artworkAvailability: Joi.string()
    .valid('available', 'unavailable')
    .required(),
  artworkType: Joi.when('artworkAvailability', {
    is: 'available',
    then: Joi.string().valid('commercial', 'free').required(),
    otherwise: Joi.forbidden(),
  }),
  artworkLicense: Joi.when('artworkAvailability', {
    is: 'available',
    then: Joi.string().valid('commercial', 'personal').required(),
    otherwise: Joi.forbidden(),
  }),
  artworkPrice: Joi.when('artworkAvailability', {
    is: 'available',
    then: Joi.when('artworkType', {
      is: 'commercial',
      then: Joi.number().integer().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
  artworkUse: Joi.when('artworkAvailability', {
    is: 'available',
    then: Joi.when('artworkLicense', {
      is: 'commercial',
      then: Joi.string().valid('separate', 'included').required(),
      otherwise: Joi.forbidden(),
    }),
  }),
  artworkCommercial: Joi.when('artworkAvailability', {
    is: 'available',
    then: Joi.when('artworkLicense', {
      is: 'commercial',
      then: Joi.when('artworkUse', {
        is: 'separate',
        then: Joi.number().integer().required(),
        otherwise: Joi.forbidden(),
      }),
    }),
  }),
  // artworkCategory: Joi.string().required(),
  artworkDescription: Joi.string().required(),
  artworkMedia: Joi.string().required(),
  artworkCover: Joi.string().required(),
});

module.exports = (data) => Joi.validate(data, schema);
