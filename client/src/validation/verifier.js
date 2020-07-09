import * as Yup from 'yup';

export const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string().trim().required(),
});
