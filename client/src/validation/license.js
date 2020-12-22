import * as Yup from 'yup';

export const licenseValidation = Yup.object().shape({
  // $TODO Needs licenseOwner, licenseArtwork, licensePrice for server validation

  licenseAssignee: Yup.string().required('License assignee is required'),
  licenseCompany: Yup.string(),
  licenseType: Yup.string()
    .matches(/(personal|commercial)/, 'License type is invalid')
    .required('License type is required'),
});
