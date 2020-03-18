const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
  artworkTitle: Joi.string(),
  artworkType: Joi.string().valid('commercial', 'showcase'),
  artworkAvailable: Joi.string().valid('available', 'unavailable'),
  artworkPrice: Joi.when('type', {
    is: 'commercial',
    then: Joi.number()
      .integer()
      .required()
  }),
  artworkLicense: Joi.when('type', {
    is: 'commercial',
    then: Joi.when('use', {
      is: 'commercial',
      then: Joi.string()
        .valid('commercial', 'personal')
        .required()
    })
  }),
  artworkCommercial: Joi.when('type', {
    is: 'commercial',
    then: Joi.when('use', {
      is: 'commercial',
      then: Joi.number()
        .integer()
        .required()
    })
  })
    .when('type', {
      is: 'commercial',
      then: Joi.when('use', {
        is: 'personal',
        then: Joi.forbidden()
      })
    })
    .when('type', {
      is: 'showcase',
      then: Joi.forbidden()
    }),
  artworkCategory: Joi.string(),
  artworkAbout: Joi.string(),
  artworkMedia: Joi.string(),
  artworkCover: Joi.string()
});

module.exports = data => Joi.validate(data, schema);
