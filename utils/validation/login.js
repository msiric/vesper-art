import Joi from 'joi';

const schema = Joi.object().keys({
  userUsername: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/)
    .required(),
  userPassword: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/)
    .required(),
});

export default (data) => Joi.validate(data, schema);
