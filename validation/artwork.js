import Joi from "joi";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  artworkDimensions: Joi.object({
    height: Joi.number(),
    width: Joi.number(),
    type: Joi.string(),
  }),
  artworkTitle: Joi.string().required(),
  artworkAvailability: Joi.string()
    .valid("available", "unavailable")
    .required(),
  artworkType: Joi.when("artworkAvailability", {
    is: "available",
    then: Joi.string().valid("commercial", "free").required(),
    otherwise: Joi.forbidden(),
  }),
  artworkLicense: Joi.when("artworkAvailability", {
    is: "available",
    then: Joi.string().valid("commercial", "personal").required(),
    otherwise: Joi.forbidden(),
  }),
  artworkPersonal: Joi.when("artworkAvailability", {
    is: "available",
    then: Joi.when("artworkType", {
      is: "commercial",
      then: Joi.when("artworkUse", {
        is: "included",
        then: Joi.forbidden(),
        otherwise: Joi.number().integer().required(),
      }),
    }),
  }),
  artworkUse: Joi.when("artworkAvailability", {
    is: "available",
    then: Joi.when("artworkLicense", {
      is: "commercial",
      then: Joi.string().valid("separate", "included").required(),
      otherwise: Joi.forbidden(),
    }),
  }),
  artworkCommercial: Joi.when("artworkAvailability", {
    is: "available",
    then: Joi.when("artworkLicense", {
      is: "commercial",
      then: Joi.when("artworkUse", {
        is: "separate",
        then: Joi.number().integer().required(),
      }),
    }),
  }),
  artworkDescription: Joi.string().required(),
  /*   artworkMedia: Joi.string().required(),
  artworkCover: Joi.string().required(), */
  // artworkCategory: Joi.string().required(),
});

export default (data) => Joi.validate(data, schema);
