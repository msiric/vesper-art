import * as Yup from 'yup';

export const ticketValidation = Yup.object().shape({
  ticketTitle: Joi.string().trim().required(),
  ticketBody: Joi.string().trim().required(),
});
