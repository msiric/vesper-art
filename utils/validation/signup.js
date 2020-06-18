import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  userUsername: Joi.string().trim().required(),
  userEmail: Joi.string().trim().required(),
  userPassword: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/)
    .required(),
  confirmedPassword: Joi.ref('password'),
});

export default (data) => Joi.validate(data, schema);
