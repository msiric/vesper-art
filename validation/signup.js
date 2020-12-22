import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  userUsername: Joi.string().trim().required(),
  userEmail: Joi.string().trim().email({ minDomainSegments: 2 }),
  userPassword: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    .required(),
  userConfirm: Joi.ref('userPassword'),
});

export default (data) => Joi.validate(data, schema);
