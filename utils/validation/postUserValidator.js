import Joi from 'joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

const schema = Joi.object().keys({
  name: Joi.string().min(6),
  email: Joi.string().email({ minDomainSegments: 2 }),
  description: Joi.string(),
  password: Joi.string()
    .regex('^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$')
    .required(),
  repeatPassword: Joi.ref('password'),
});

export default (data) => Joi.validate(data, schema);
