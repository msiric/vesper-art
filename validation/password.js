import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  userCurrent: Joi.string().trim().required(),
  userPassword: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/)
    .required(),
  userConfirm: Joi.ref('password'),
});

export default (data) => Joi.validate(data, schema);
