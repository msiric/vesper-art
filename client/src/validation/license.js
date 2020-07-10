import * as Yup from "yup";

export const licenseValidation = Yup.object().shape({
  // $TODO Needs licenseOwner, licenseArtwork, licensePrice for server validation

  licenseType: Yup.string()
    .matches(/(personal|commercial)/)
    .required("License type is required"),
});
